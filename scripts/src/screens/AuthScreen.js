import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [modo, setModo] = useState('login'); // 'login' | 'cadastro'
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  const handleSubmit = async () => {
    if (!email || !senha) return setErro('Preencha todos os campos.');
    if (modo === 'cadastro' && !nome) return setErro('Informe seu nome.');
    setErro('');
    setLoading(true);
    try {
      if (modo === 'login') await signIn(email, senha);
      else await signUp(email, senha, nome);
    } catch (e) {
      setErro(e.message || 'Erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.logo}>⚖️ Lura OAB</Text>
        <Text style={styles.subtitle}>
          {modo === 'login' ? 'Entre na sua conta' : 'Crie sua conta'}
        </Text>

        {modo === 'cadastro' && (
          <TextInput style={styles.input} placeholder="Seu nome" value={nome}
            onChangeText={setNome} autoCapitalize="words" />
        )}
        <TextInput style={styles.input} placeholder="E-mail" value={email}
          onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Senha" value={senha}
          onChangeText={setSenha} secureTextEntry />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> :
            <Text style={styles.btnPrimaryText}>
              {modo === 'login' ? 'ENTRAR' : 'CRIAR CONTA'}
            </Text>
          }
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setModo(modo === 'login' ? 'cadastro' : 'login')}>
          <Text style={styles.toggleText}>
            {modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', justifyContent: 'center', padding: 24 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 28, elevation: 4 },
  logo: { fontSize: 28, fontWeight: '900', color: '#4F46E5', textAlign: 'center', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, padding: 14,
    fontSize: 15, marginBottom: 12, color: '#1E293B' },
  erro: { color: '#EF4444', fontSize: 13, marginBottom: 10, textAlign: 'center' },
  btnPrimary: { backgroundColor: '#4F46E5', padding: 16, borderRadius: 14,
    alignItems: 'center', marginTop: 4, marginBottom: 16 },
  btnPrimaryText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
  toggleText: { color: '#4F46E5', textAlign: 'center', fontWeight: '600', fontSize: 14 }
});