import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { theme2fase as t } from '../../constants/theme2fase';

const { width, height } = Dimensions.get('window');

export default function PortalSegundaFase() {
  const navigation = useNavigation<any>();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const lineWidth = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const btnOpacity = useSharedValue(0);

  const goToHub = () => navigation.replace('HubSegundaFase');

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withTiming(1, { duration: 800 });
    lineWidth.value = withDelay(600, withTiming(width * 0.6, { duration: 700 }));
    textOpacity.value = withDelay(1100, withTiming(1, { duration: 600 }));
    btnOpacity.value = withDelay(2000, withTiming(1, { duration: 500 }));
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: withTiming(textOpacity.value === 0 ? 12 : 0) }],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    opacity: btnOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, containerStyle]}>
        <Text style={styles.fase1label}>1ª FASE ✓</Text>
        <Animated.View style={[styles.line, lineStyle]} />
        <Animated.View style={textStyle}>
          <Text style={styles.title}>Você chegou na</Text>
          <Text style={styles.titleBold}>2ª Fase</Text>
          <Text style={styles.subtitle}>
            A prova mudou.{' '}A estratégia também.
          </Text>
        </Animated.View>
        <Animated.View style={btnStyle}>
          <TouchableOpacity style={styles.btn} onPress={goToHub}>
            <Text style={styles.btnText}>Entrar →</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { alignItems: 'center', paddingHorizontal: 32 },
  fase1label: {
    fontSize: 12,
    color: t.accentMuted,
    letterSpacing: 3,
    fontWeight: '600',
    marginBottom: 16,
  },
  line: {
    height: 1,
    backgroundColor: t.primary,
    marginBottom: 32,
  },
  title: {
    fontSize: 22,
    color: t.textSecondary,
    textAlign: 'center',
    fontWeight: '400',
  },
  titleBold: {
    fontSize: 48,
    color: t.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: t.textMuted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 26,
  },
  btn: {
    marginTop: 48,
    backgroundColor: t.primary,
    paddingVertical: 16,
    paddingHorizontal: 52,
    borderRadius: 14,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
