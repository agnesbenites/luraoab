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
import { supabase } from '../../db/supabase';

export default function ResetPasswordScreen({ navigation }) {
  const [novaSenha, setNovaSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    async function handleRecoveryToken() {
      if (Platform.OS === 'web') {
        const hash = window.location.hash;

        if (hash && hash.includes('access_token')) {
          const params = new URLSearchParams(hash.substring(1));
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');

          if (access_token && refresh_token) {
            const { error } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });

            if (!error) {
              setSessionReady(true);
            }
          }
        }
      } else {
        setSessionReady(true);
      }
    }

    handleRecoveryToken();
  }, []);

  const handleAtualizarSenha = async () => {
    if (!novaSenha || novaSenha.length < 6) {
      Alert.alert('Aviso', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: novaSenha });

    setLoading(false);

    if (error) {
      Alert.alert('Erro', error.message);
      return;
    }

    Alert.alert('Sucesso', 'Senha atualizada com sucesso.');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redefinir senha</Text>

      {!sessionReady ? (
        <Text style={styles.subtitle}>Validando link de recuperação...</Text>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nova senha"
            placeholderTextColor="#8c8c8c"
            secureTextEntry
            value={novaSenha}
            onChangeText={setNovaSenha}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleAtualizarSenha}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Atualizando...' : 'Atualizar senha'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#a0a0a0',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#15142b',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});