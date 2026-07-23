import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../db/supabase';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingReset, setLoadingReset] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      return Alert.alert('Preencha todos os campos');
    }

    setLoading(true);

    try {
      await signIn(email, senha);
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleEsqueciSenha = async () => {
    if (!email) {
      Alert.alert(
        'Informe seu e-mail',
        'Digite o e-mail cadastrado antes de solicitar a redefinição de senha.'
      );
      return;
    }

    setLoadingReset(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://luraoab.pages.dev/reset-senha',
      });

      if (error) {
        Alert.alert('Erro', error.message);
        return;
      }

      Alert.alert(
        'Verifique seu e-mail',
        'Enviamos um link para redefinir sua senha.'
      );
    } catch (e: any) {
      Alert.alert('Erro', 'Não foi possível enviar o e-mail de redefinição.');
    } finally {
      setLoadingReset(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>Lura</Text>
      <Text style={styles.subtitle}>Bem-vinda de volta 👋</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.btnText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleEsqueciSenha} disabled={loadingReset}>
        <Text style={styles.forgotLink}>
          {loadingReset ? 'Enviando...' : 'Esqueceu a senha?'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tem conta? Criar agora</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
    opacity: 0.7,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotLink: {
    color: '#9f9cc7',
    textAlign: 'center',
    marginTop: 14,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  link: {
    color: '#7C3AED',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
  },
});