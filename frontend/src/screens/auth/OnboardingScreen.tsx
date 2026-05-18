import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Animated,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme2fase as t } from '../../constants/theme2fase'; // Usando as cores padrão do app

const { width, height } = Dimensions.get('window');

// ─── DADOS DO ONBOARDING ─────────────────────────────────────────────

const SLIDES = [
  {
    id: '1',
    title: 'A sua aprovação\ncomeça aqui',
    description: 'Estudo estratégico e focado no que a FGV realmente cobra na 2ª fase.',
    icon: '🎯',
  },
  {
    id: '2',
    title: 'Correção Inteligente',
    description: 'Faça peças discursivas e receba feedback imediato da nossa Inteligência Artificial baseado no espelho oficial.',
    icon: '🧠',
  },
  {
    id: '3',
    title: 'Vade Mecum Integrado',
    description: 'Consulte a legislação de forma rápida enquanto resolve os simulados, sem carregar peso.',
    icon: '📚',
  },
];

// ─── COMPONENTE ───────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  // Avança para o próximo slide ou vai para o login se for o último
  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Register'); // Vai direto para criar conta
    }
  };

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />

      {/* Botão Pular */}
      <View style={styles.header}>
        {currentIndex < SLIDES.length - 1 ? (
          <TouchableOpacity onPress={() => navigation.replace('Register')} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
        ) : (
          <View /> // Espaço vazio no último slide
        )}
      </View>

      {/* Carrossel */}
      <View style={styles.carouselContainer}>
        <FlatList
          data={SLIDES}
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>

      {/* Paginação e Botão */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index.toString()}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === SLIDES.length - 1 ? 'Começar agora' : 'Continuar'}
          </Text>
        </TouchableOpacity>

        {currentIndex === SLIDES.length - 1 && (
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.replace('Login')}>
              <Text style={styles.loginLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── ESTILOS ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.background,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
  },
  skipText: {
    color: t.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  carouselContainer: {
    flex: 3,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: height * 0.05,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: t.surface,
    borderWidth: 2,
    borderColor: t.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    shadowColor: t.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  icon: {
    fontSize: 64,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: t.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    color: t.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  footer: {
    flex: 1.5,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: t.accent,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: t.accent,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: t.textSecondary,
    fontSize: 14,
  },
  loginLink: {
    color: t.accent,
    fontSize: 14,
    fontWeight: '700',
  },
});