import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme2fase as t } from '../../constants/theme2fase';

const cards = [
  {
    icon: '🧭',
    title: 'Me ajuda a escolher',
    subtitle: 'Veja estatísticas e receba uma recomendação personalizada',
    screen: 'EscolhaEstrategica',
    mode: 'quiz',
    accent: t.accent,
  },
  {
    icon: '📋',
    title: 'Já escolhi minha área',
    subtitle: 'Ir direto para simulados, provas e treino de peças',
    screen: 'EscolhaEstrategica',
    mode: 'areas',
    accent: t.accentMuted,
  },
  {
    icon: '🔄',
    title: 'Estou em repescagem',
    subtitle: 'Plano focado nos seus pontos fracos com countdown',
    screen: 'Repescagem',
    accent: t.warning,
  },
];

export default function HubSegundaFase() {
  const navigation = useNavigation<any>();

  const handlePress = (card: any) => {
    if (card.screen === 'EscolhaEstrategica') {
      navigation.navigate('EscolhaEstrategica', { modo: card.mode });
      return;
    }

    navigation.navigate(card.screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={t.background} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.badge}>2a FASE</Text>
          <Text style={styles.title}>Por onde vamos comecar?</Text>
          <Text style={styles.subtitle}>
            Prova manuscrita, com consulta, 4h30. Cada ponto conta.
          </Text>
        </View>

        <View style={styles.cards}>
          {cards.map((card, i) => (
            <TouchableOpacity
              key={i}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => handlePress(card)}
            >
              <View style={[styles.cardIcon, { borderColor: card.accent }]}>
                <Text style={styles.cardIconText}>{card.icon}</Text>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{card.title}</Text>
                <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
              </View>

              <Text style={[styles.cardArrow, { color: card.accent }]}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Constitucional aprova{' '}
            <Text style={{ color: t.accent, fontWeight: 'bold' }}>29,6%</Text>
            {' '}dos candidatos — o dobro de Penal.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.background,
  },

  scroll: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
  },

  header: {
    marginBottom: 40,
  },

  badge: {
    fontSize: 11,
    color: t.accentMuted,
    letterSpacing: 3,
    fontWeight: '700',
    marginBottom: 12,
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: t.textPrimary,
    lineHeight: 42,
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 14,
    color: t.textSecondary,
    lineHeight: 22,
  },

  cards: {
    gap: 14,
  },

  card: {
    backgroundColor: t.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardIconText: {
    fontSize: 22,
  },

  cardBody: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: t.textPrimary,
    marginBottom: 4,
  },

  cardSubtitle: {
    fontSize: 12,
    color: t.textSecondary,
    lineHeight: 18,
  },

  cardArrow: {
    fontSize: 24,
    fontWeight: '300',
  },

  footer: {
    marginTop: 36,
    backgroundColor: t.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: t.border,
    padding: 16,
  },

  footerText: {
    fontSize: 13,
    color: t.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
});