import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function Repescagem({ navigation, route }: any) {
  const areaNomeAnterior = route.params?.areaNome || 'sua área anterior';
  const areaIdAnterior = route.params?.areaId || '';

  function continuarMesmaArea() {
    navigation.navigate('AreaHome', {
      areaId: areaIdAnterior,
      areaNome: areaNomeAnterior,
    });
  }

  function trocarArea() {
    navigation.navigate('EscolhaEstrategica', {
      modo: 'areas',
      origem: 'repescagem',
    });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.badge}>REPECAGEM</Text>
          <Text style={styles.title}>Sua nova tentativa começa aqui</Text>
          <Text style={styles.subtitle}>
            Você pode seguir com a mesma área ou escolher outra disciplina para a 2ª fase.
          </Text>
        </View>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Área anterior</Text>
          <Text style={styles.noticeValue}>{areaNomeAnterior}</Text>
        </View>

        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={continuarMesmaArea}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>Continuar com minha área</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
          <Text style={styles.cardDescription}>
            Retome os estudos em {areaNomeAnterior} com provas, peças e simulados.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={trocarArea}>
          <View style={styles.cardTop}>
            <Text style={styles.cardTitle}>Trocar área da 2ª fase</Text>
            <Text style={styles.arrow}>›</Text>
          </View>
          <Text style={styles.cardDescription}>
            Escolha uma nova disciplina e reorganize sua preparação.
          </Text>
        </TouchableOpacity>
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
    color: '#F7C66B',
    backgroundColor: '#3A2A10',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#C7D2E8',
  },
  notice: {
    backgroundColor: '#121A2B',
    borderWidth: 1,
    borderColor: '#1F2A44',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  noticeTitle: {
    fontSize: 13,
    color: '#AAB6D3',
    marginBottom: 6,
  },
  noticeValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#121A2B',
    borderWidth: 1,
    borderColor: '#1F2A44',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
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
    color: '#F7C66B',
    fontWeight: '700',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: '#AAB6D3',
  },
});