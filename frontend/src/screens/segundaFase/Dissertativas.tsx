import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { theme2fase as t } from '../../constants/theme2fase';

export default function SegundaFaseDissertativas() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const areaNome = route.params?.areaNome || '';
  const areaId = route.params?.areaId || '';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.badge}>2ª FASE — {areaNome.toUpperCase()}</Text>
        <Text style={styles.title}>Questões Dissertativas</Text>
        <Text style={styles.subtitle}>
          Escolha a origem das questões para estudar nesta área.
        </Text>

        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('segundaFaseDissertativasOAB', {
              areaId,
              areaNome,
            })
          }
        >
          <Text style={styles.optionEyebrow}>BANCO OFICIAL</Text>
          <Text style={styles.optionTitle}>Banco de questões OAB</Text>
          <Text style={styles.optionText}>
            Questões baseadas nas provas reais da 2ª fase, organizadas por exame.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('segundaFaseDissertativasIA', {
              areaId,
              areaNome,
            })
          }
        >
          <Text style={styles.optionEyebrow}>BANCO INTELIGENTE</Text>
          <Text style={styles.optionTitle}>Banco de questões da IA</Text>
          <Text style={styles.optionText}>
            Questões geradas por IA para treino complementar na sua área.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: t.background },
  scroll: { padding: 24, paddingTop: 56, paddingBottom: 48 },
  back: { color: t.accentMuted, fontSize: 14, marginBottom: 20 },
  badge: {
    fontSize: 11,
    color: t.accentMuted,
    letterSpacing: 2,
    fontWeight: '700',
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: t.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: t.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: t.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: t.border,
    padding: 18,
    marginBottom: 16,
  },
  optionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: t.accentMuted,
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: t.textPrimary,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    color: t.textSecondary,
    lineHeight: 22,
  },
});