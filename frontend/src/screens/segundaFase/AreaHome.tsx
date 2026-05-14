import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function SegundaFaseAreaHome({ navigation, route }: any) {
  const areaNome = route.params?.areaNome || 'Minha Área';
  const areaId = route.params?.areaId || '';

  const modulos = [
    {
      key: 'provas',
      titulo: 'Provas reais',
      descricao: 'Veja exames anteriores da sua matéria e abra o gabarito comentado.',
      screen: 'ProvasReais',
    },
    {
      key: 'pecas',
      titulo: 'Treino de peças',
      descricao: 'Pratique as peças mais cobradas da 2ª fase.',
      screen: 'TreinoPecas',
    },
    {
      key: 'discursivas',
      titulo: 'Questões discursivas',
      descricao: 'Treine respostas curtas com foco em estrutura e fundamento.',
      screen: 'Dissertativas',
    },
    {
      key: 'simulado',
      titulo: 'Simulado completo',
      descricao: 'Faça um treino mais próximo da prova real.',
      screen: 'SimuladoCompleto',
    },
    {
      key: 'desempenho',
      titulo: 'Desempenho',
      descricao: 'Acompanhe sua evolução na matéria escolhida.',
      screen: 'Desempenho2fase',
    },
  ];

  function openModulo(screen: string) {
    navigation.navigate(screen, {
      areaId,
      areaNome,
    });
  }

  function trocarArea() {
    navigation.navigate('EscolhaEstrategica', { modo: 'areas' });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.badge}>2ª FASE</Text>
          <Text style={styles.label}>Minha área</Text>
          <Text style={styles.area}>{areaNome}</Text>
          <Text style={styles.subtitle}>
            Escolha como você quer estudar dentro da sua matéria.
          </Text>

          <TouchableOpacity style={styles.changeButton} onPress={trocarArea}>
            <Text style={styles.changeButtonText}>Trocar área</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cards}>
          {modulos.map((mod) => (
            <TouchableOpacity
              key={mod.key}
              activeOpacity={0.85}
              style={styles.card}
              onPress={() => openModulo(mod.screen)}
            >
              <View style={styles.cardTop}>
                <Text style={styles.cardTitle}>{mod.titulo}</Text>
                <Text style={styles.arrow}>›</Text>
              </View>

              <Text style={styles.cardDescription}>{mod.descricao}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '800',
    color: '#8FB4FF',
    backgroundColor: '#14213D',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#AAB6D3',
    marginBottom: 6,
  },
  area: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#C7D2E8',
    marginBottom: 16,
  },
  changeButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#1F2A44',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#121A2B',
  },
  changeButtonText: {
    color: '#C7D2E8',
    fontSize: 13,
    fontWeight: '700',
  },
  cards: {
    gap: 14,
  },
  card: {
    backgroundColor: '#121A2B',
    borderWidth: 1,
    borderColor: '#1F2A44',
    borderRadius: 18,
    padding: 18,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginRight: 12,
  },
  arrow: {
    fontSize: 26,
    lineHeight: 26,
    color: '#8FB4FF',
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#AAB6D3',
  },
});