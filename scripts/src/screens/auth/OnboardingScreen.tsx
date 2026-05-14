import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    emoji: '🎯',
    titulo: 'Feito por quem já passou',
    descricao: 'Criado por quem já esteve no seu lugar — pagou cursinho, estudou do jeito errado, e passou. Aqui você aprende exatamente o que a OAB cobra, sem enrolação.',
  },
  {
    id: '2',
    emoji: '📌',
    titulo: 'Só o que realmente cai',
    descricao: 'Esqueça o mar de conteúdo. A Lura filtra o que realmente importa e monta o seu caminho até a aprovação — sem sobrecarga, sem culpa.',
  },
  {
    id: '3',
    emoji: '🤖',
    titulo: 'Tecnologia que trabalha por você',
    descricao: 'A Lura usa inteligência artificial e um design pensado para não te cansar — para que estudar seja mais leve, eficiente e te mantenha motivado até o dia da prova.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/profile-quiz');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skip} onPress={() => router.push('/profile-quiz')}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal pagingEnabled scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.descricao}>{item.descricao}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleNext}>
        <Text style={styles.btnText}>
          {currentIndex === slides.length - 1 ? 'Começar →' : 'Próximo →'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a', alignItems: 'center', justifyContent: 'center' },
  skip: { position: 'absolute', top: 52, right: 24 },
  skipText: { color: '#666', fontSize: 14 },
  slide: { alignItems: 'center', justifyContent: 'center', padding: 36 },
  emoji: { fontSize: 64, marginBottom: 24 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 16 },
  descricao: { fontSize: 16, color: '#aaa', textAlign: 'center', lineHeight: 26 },
  dots: { flexDirection: 'row', marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#333', marginHorizontal: 4 },
  dotActive: { backgroundColor: '#7C3AED', width: 24 },
  btn: { backgroundColor: '#7C3AED', borderRadius: 14, paddingVertical: 16,
    paddingHorizontal: 48, marginBottom: 48 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});