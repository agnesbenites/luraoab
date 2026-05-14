import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const { signUp } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmar) return Alert.alert('Preencha todos os campos');
    if (senha !== confirmar) return Alert.alert('As senhas não coincidem');
    if (senha.length < 6) return Alert.alert('Senha deve ter no mínimo 6 caracteres');

    setLoading(true);
    try {
      await signUp(email, senha, nome);
      navigation.navigate('Onboarding');
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Não foi possível criar a conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.logo}>Lura</Text>
      <Text style={styles.subtitle}>Crie sua conta e comece sua aprovação</Text>

      <TextInput style={styles.input} placeholder="Seu nome" placeholderTextColor="#999"
        value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#999"
        keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#999"
        secureTextEntry value={senha} onChangeText={setSenha} />
      <TextInput style={styles.input} placeholder="Confirmar senha" placeholderTextColor="#999"
        secureTextEntry value={confirmar} onChangeText={setConfirmar} />

      <TouchableOpacity style={styles.btn} onPress={handleCadastro} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Criando conta...' : 'Criar conta'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
