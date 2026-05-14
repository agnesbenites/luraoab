import React, { useEffect, useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, StyleSheet, Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FRASES = [
  { emoji: '💪', texto: 'Você está se dedicando o máximo que pode.\nIsso já é motivo de orgulho.' },
  { emoji: '🎯', texto: 'Você só precisa acertar 40 questões.\nNão se cobre pela perfeição — se cobre pelo foco.' },
  { emoji: '🧠', texto: 'Confie naquilo que você estudou.\nSeu cérebro absorveu mais do que você imagina.' },
  { emoji: '🔥', texto: 'Não esqueça o motivo que te fez começar.\nEle ainda é válido. Ele ainda é seu.' },
  { emoji: '🌱', texto: 'Cada questão respondida hoje\né uma semente plantada para a aprovação.' },
  { emoji: '⚖️', texto: 'A OAB não exige perfeição.\nExige consistência. E você está aqui, sendo consistente.' },
  { emoji: '🛤️', texto: 'Mantenha o foco no processo.\nA aprovação é consequência de cada dia de estudo.' },
  { emoji: '🌟', texto: 'Candidatos aprovados não são os mais inteligentes.\nSão os que não desistiram.' },
  { emoji: '📖', texto: 'Um erro é uma oportunidade disfarçada.\nO que você errou hoje, você não esquece amanhã.' },
  { emoji: '🏁', texto: 'Você está mais perto do que estava ontem.\nContinue. Um dia de cada vez.' },
  { emoji: '💡', texto: 'Revisão não é fraqueza.\nÉ o que separa quem passa de quem quase passou.' },
  { emoji: '🤝', texto: 'Ninguém passa na OAB por acaso.\nE você está aqui, no caminho certo.' },
];

export default function MotivacionalModal() {
  const [visivel, setVisivel] = useState(false);
  const [frase, setFrase] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(60))[0];

  useEffect(() => {
    verificarExibicao();
  }, []);

  async function verificarExibicao() {
    try {
      const hoje = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const ultimaExibicao = await AsyncStorage.getItem('motivacional_ultima_data');

      if (ultimaExibicao === hoje) return; // já mostrou hoje

      // Escolhe frase baseada no dia do ano (rotação automática)
      const diaDoAno = Math.floor(
        (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
      );
      const fraseHoje = FRASES[diaDoAno % FRASES.length];

      setFrase(fraseHoje);
      setVisivel(true);
      await AsyncStorage.setItem('motivacional_ultima_data', hoje);

      // Animação de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, duration: 400, useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0, tension: 65, friction: 10, useNativeDriver: true,
        }),
      ]).start();
    } catch (err) {
      console.error(err);
    }
  }

  function fechar() {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0, duration: 250, useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 60, duration: 250, useNativeDriver: true,
      }),
    ]).start(() => setVisivel(false));
  }

  if (!visivel || !frase) return null;

  return (
    <Modal transparent animationType="none" visible={visivel}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View style={[
          styles.card,
          { transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={styles.emoji}>{frase.emoji}</Text>
          <Text style={styles.texto}>{frase.texto}</Text>
          <Text style={styles.data}>
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </Text>
          <TouchableOpacity style={styles.btn} onPress={fechar}>
            <Text style={styles.btnText}>Vamos lá 🚀</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28,
  },
  card: {
    backgroundColor: '#FFF', borderRadius: 28, padding: 32,
    alignItems: 'center', width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 10,
  },
  emoji: { fontSize: 56, marginBottom: 20 },
  texto: {
    fontSize: 18, fontWeight: '700', color: '#1E293B',
    textAlign: 'center', lineHeight: 28, marginBottom: 20,
  },
  data: {
    fontSize: 12, color: '#94A3B8', fontWeight: '600',
    textTransform: 'capitalize', marginBottom: 28,
  },
  btn: {
    backgroundColor: '#4F46E5', paddingVertical: 14,
    paddingHorizontal: 40, borderRadius: 16,
  },
  btnText: { color: '#FFF', fontWeight: '800', fontSize: 15 },
});