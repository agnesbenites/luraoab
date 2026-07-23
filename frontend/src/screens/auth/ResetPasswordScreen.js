import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../../db/supabase';

export default function ResetPasswordScreen() {
  const navigation = useNavigation<any>();
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveryReady, setRecoveryReady] = useState(false);

  useEffect(() => {
    const prepararRecovery = async () => {
      try {
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          const hash = window.location.hash?.replace(/^#/, '') || '';
          const params = new URLSearchParams(hash);

          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          const type = params.get('type');

          if (type === 'recovery' && access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (error) {
              Alert.alert('Erro', 'Não foi possível validar o link de recuperação.');
              return;
            }

            setRecoveryReady(true);
            return;
          }
        }

        const { data } = await supabase.auth.getSession();

        if (data.session) {
          setRecoveryReady(true);
        } else {
          Alert.alert('Link inválido', 'Solicite um novo link de redefinição de senha.');
        }
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível abrir o fluxo de redefinição.');
      }
    };

    prepararRecovery();
  }, []);

  const handleResetPassword = async () => {
    if (!novaSenha || !confirmarSenha) {
      return Alert.alert('Erro', 'Preencha os dois campos.');
    }

    if (novaSenha.length < 6) {
      return Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
    }

    if (novaSenha !== confirmarSenha) {
      return Alert.alert('Erro', 'As senhas não coincidem.');
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: novaSenha,
      });

      if (error) {
        Alert.alert('Erro', error.message);
        return;
      }

      Alert.alert('Sucesso', 'Sua senha foi redefinida com sucesso.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível redefinir a senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Lura</Text>
      <Text style={styles.title}>Redefinir senha</Text>
      <Text style={styles.subtitle}>
        Digite sua nova senha para concluir a recuperação.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nova senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={novaSenha}
        onChangeText={setNovaSenha}
        editable={recoveryReady && !loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar nova senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        editable={recoveryReady && !loading}
      />

      <TouchableOpacity
        style={[
          styles.btn,
          (!recoveryReady || loading) && styles.btnDisabled,
        ]}
        onPress={handleResetPassword}
        disabled={!recoveryReady || loading}
      >
        <Text style={styles.btnText}>
          {loading ? 'Salvando...' : 'Salvar nova senha'}
        </Text>
      </TouchableOpacity>

      {!recoveryReady && (
        <Text style={styles.helper}>
          Validando link de recuperação...
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    padding: 28,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#7C3AED',
    textAlign: 'center',
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
    fontSize: 15,
  },
  input: {
    backgroundColor: '#1a1a2e',
    color: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  btn: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  helper: {
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 13,
  },
});