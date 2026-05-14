import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function PaywallScreen() {
  const router = useRouter();

  const handleAssinar = async () => {
    // Aqui entra o react-native-iap futuramente
    Alert.alert('Em breve', 'Integração com Google Play em implementação!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Seu plano de aprovação está pronto 🎯</Text>
      <Text style={styles.subtitulo}>
        Desbloqueie acesso completo à Lura e comece a estudar do jeito certo.
      </Text>

      {/* Card plano */}
      <View style={styles.card}>
        <View style={styles.badge}><Text style={styles.badgeText}>MAIS POPULAR</Text></View>
        <Text style={styles.planoNome}>Lura Premium</Text>
        <Text style={styles.preco}>R$ 15,90<Text style={styles.precoSub}>/mês</Text></Text>
        <Text style={styles.precoInfo}>Cancele quando quiser</Text>

        <View style={styles.divider} />

        {[
          '✅ Questões ilimitadas com IA',
          '✅ Diagnóstico personalizado',
          '✅ Simulados completos e por fase',
          '✅ Vade Mecum com marcações',
          '✅ Relatórios de desempenho',
          '✅ Motivação diária com a Lura',
        ].map((item, i) => (
          <Text key={i} style={styles.item}>{item}</Text>
        ))}

        <TouchableOpacity style={styles.btn} onPress={handleAssinar}>
          <Text style={styles.btnText}>Assinar por R$ 15,90/mês</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/(tabs)')} style={styles.trial}>
        <Text style={styles.trialText}>Experimentar 7 dias grátis</Text>
      </TouchableOpacity>

      <Text style={styles.rodape}>
        Cobrado mensalmente via Google Play. Cancele a qualquer momento.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', padding: 24, justifyContent: 'center' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtitulo: { color: '#aaa', textAlign: 'center', fontSize: 15, marginBottom: 28, lineHeight: 22 },
  card: { backgroundColor: '#1a1a2e', borderRadius: 20, padding: 24,
    borderWidth: 2, borderColor: '#7C3AED' },
  badge: { backgroundColor: '#7C3AED', borderRadius: 20, paddingHorizontal: 12,
    paddingVertical: 4, alignSelf: 'center', marginBottom: 16 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  planoNome: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  preco: { color: '#7C3AED', fontSize: 42, fontWeight: 'bold', textAlign: 'center', marginTop: 8 },
  precoSub: { fontSize: 18, color: '#aaa' },
  precoInfo: { color: '#666', textAlign: 'center', fontSize: 13, marginBottom: 16 },
  divider: { height: 1, backgroundColor: '#2a2a3e', marginVertical: 16 },
  item: { color: '#ccc', fontSize: 15, marginBottom: 8 },
  btn: { backgroundColor: '#7C3AED', borderRadius: 14, padding: 16,
    alignItems: 'center', marginTop: 20 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  trial: { marginTop: 20, alignItems: 'center' },
  trialText: { color: '#7C3AED', fontSize: 15, fontWeight: '600' },
  rodape: { color: '#444', fontSize: 12, textAlign: 'center', marginTop: 16, lineHeight: 18 },
});