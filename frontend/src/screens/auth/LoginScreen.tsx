import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) return Alert.alert('Preencha todos os campos');
    setLoading(true);
    try {
      await signIn(email, senha);
      // AuthContext atualiza o user automaticamente → RootNavigator redireciona
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.logo}>Lura</Text>
      <Text style={styles.subtitle}>Bem-vinda de volta 👋</Text>

      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#999"
        keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#999"
        secureTextEntry value={senha} onChangeText={setSenha} />

      <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tem conta? Criar agora</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', justifyContent: 'center', padding: 28 },
  logo: { fontSize: 42, fontWeight: 'bold', color: '#7C3AED', textAlign: 'center', marginBottom: 6 },
  subtitle: { color: '#aaa', textAlign: 'center', marginBottom: 32, fontSize: 15 },
  input: { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 14, fontSize: 15, borderWidth: 1, borderColor: '#2a2a3e' },
  btn: { backgroundColor: '#7C3AED', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  link: { color: '#7C3AED', textAlign: 'center', marginTop: 20, fontSize: 14 },
});
