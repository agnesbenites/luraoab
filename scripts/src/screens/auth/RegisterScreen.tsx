import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!email || !senha || !confirmar) return Alert.alert('Preencha todos os campos');
    if (senha !== confirmar) return Alert.alert('As senhas não coincidem');
    setLoading(true);
    try {
      // Salvar no seu backend/Supabase aqui
      router.push('/onboarding');
    } catch (e) {
      Alert.alert('Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.logo}>Lura</Text>
      <Text style={styles.subtitle}>Crie sua conta e comece sua aprovação</Text>

      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#999"
        keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#999"
        secureTextEntry value={senha} onChangeText={setSenha} />
      <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#999"
        secureTextEntry value={confirmar} onChangeText={setConfirmar} />

      <TouchableOpacity style={styles.btn} onPress={handleCadastro} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Criando conta...' : 'Criar conta'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Já tem conta? Entrar</Text>
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