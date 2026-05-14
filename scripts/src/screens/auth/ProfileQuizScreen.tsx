import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const materias = [
  'Direito Civil', 'Direito Penal', 'Direito Constitucional',
  'Direito Processual Civil', 'Direito Processual Penal',
  'Direito do Trabalho', 'Direito Empresarial', 'Direito Tributário',
  'Ética e Estatuto da OAB', 'Direito Administrativo',
];

export default function ProfileQuizScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0, 1, 2

  // Step 0 — Perfil
  const [prestouOAB, setPrestouOAB] = useState<string | null>(null);
  const [quantasVezes, setQuantasVezes] = useState<string | null>(null);
  const [faseChegou, setFaseChegou] = useState<string | null>(null);

  // Step 1 — Histórico
  const [estudouAntes, setEstudouAntes] = useState<string | null>(null);
  const [fezCursinho, setFezCursinho] = useState<string | null>(null);
  const [qualCursinho, setQualCursinho] = useState('');
  const [tempoEstudo, setTempoEstudo] = useState<string | null>(null);

  // Step 2 — Meta
  const [meta, setMeta] = useState<string | null>(null);
  const [materiaDificuldade, setMateriaDificuldade] = useState<string | null>(null);

  const salvarEAvancar = async () => {
    const perfil = {
      prestouOAB, quantasVezes, faseChegou,
      estudouAntes, fezCursinho, qualCursinho,
      tempoEstudo, meta, materiaDificuldade,
      criadoEm: new Date().toISOString(),
    };
    await AsyncStorage.setItem('@lura_perfil_onboarding', JSON.stringify(perfil));
    // Enviar para backend também aqui para métricas de marketing
    router.push('/paywall');
  };

  const Opcao = ({ label, valor, selecionado, onPress }: any) => (
    <TouchableOpacity
      style={[styles.opcao, selecionado === valor && styles.opcaoSelecionada]}
      onPress={() => onPress(valor)}
    >
      <Text style={[styles.opcaoText, selecionado === valor && styles.opcaoTextSelecionada]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const steps = [
    // Step 0 — Perfil do candidato
    <ScrollView key="step0" contentContainerStyle={styles.stepContainer}>
      <Text style={styles.stepIndicator}>1 de 3</Text>
      <Text style={styles.titulo}>Seu perfil como candidato</Text>

      <Text style={styles.pergunta}>Já prestou a OAB antes?</Text>
      {['Não', 'Sim, 1 vez', 'Sim, 2 vezes', 'Sim, 3 vezes ou mais'].map(op => (
        <Opcao key={op} label={op} valor={op} selecionado={prestouOAB} onPress={setPrestouOAB} />
      ))}

      {prestouOAB && prestouOAB !== 'Não' && (
        <>
          <Text style={styles.pergunta}>Qual fase você chegou?</Text>
          {['1ª Fase', '2ª Fase (Peça)', 'Aprovei em alguma fase'].map(op => (
            <Opcao key={op} label={op} valor={op} selecionado={faseChegou} onPress={setFaseChegou} />
          ))}
        </>
      )}

      <TouchableOpacity
        style={[styles.btn, !prestouOAB && styles.btnDisabled]}
        disabled={!prestouOAB}
        onPress={() => setStep(1)}
      >
        <Text style={styles.btnText}>Próximo →</Text>
      </TouchableOpacity>
    </ScrollView>,

    // Step 1 — Histórico de estudos
    <ScrollView key="step1" contentContainerStyle={styles.stepContainer}>
      <Text style={styles.stepIndicador}>2 de 3</Text>
      <Text style={styles.titulo}>Seu histórico de estudos</Text>

      <Text style={styles.pergunta}>Já estudou para a OAB antes?</Text>
      {['Não, é minha primeira vez', 'Sim, estudei por conta', 'Sim, com material pago'].map(op => (
        <Opcao key={op} label={op} valor={op} selecionado={estudouAntes} onPress={setEstudouAntes} />
      ))}

      <Text style={styles.pergunta}>Já fez cursinho preparatório?</Text>
      {['Não', 'Sim'].map(op => (
        <Opcao key={op} label={op} valor={op} selecionado={fezCursinho} onPress={setFezCursinho} />
      ))}
      {fezCursinho === 'Sim' && (
        <TextInput
          style={styles.input}
          placeholder="Qual cursinho? (opcional)"
          placeholderTextColor="#666"
          value={qualCursinho}
          onChangeText={setQualCursinho}
        />
      )}

      <Text style={styles.pergunta}>Quanto tempo consegue estudar por dia?</Text>
      {['Menos de 1 hora', '1 a 2 horas', 'Mais de 2 horas'].map(op => (
        <Opcao key={op} label={op} valor={op} selecionado={tempoEstudo} onPress={setTempoEstudo} />
      ))}

      <TouchableOpacity
        style={[styles.btn, (!estudouAntes || !fezCursinho || !tempoEstudo) && styles.btnDisabled]}
        disabled={!estudouAntes || !fezCursinho || !tempoEstudo}
        onPress={() => setStep(2)}
      >
        <Text style={styles.btnText}>Próximo →</Text>
      </TouchableOpacity>
    </ScrollView>,

    // Step 2 — Meta
    <ScrollView key="step2" contentContainerStyle={styles.stepContainer}>
      <Text style={styles.stepIndicador}>3 de 3</Text>
      <Text style={styles.titulo}>Sua meta</Text>

      <Text style={styles.pergunta}>Quando quer passar na OAB?</Text>
      {['No próximo exame', 'Em até 6 meses', 'Não tenho prazo definido'].map(op => (
        <Opcao key={op} label={op} valor={op} selecionado={meta} onPress={setMeta} />
      ))}

      <Text style={styles.pergunta}>Qual matéria você mais tem dificuldade?</Text>
      {materias.map(op => (
        <Opcao key={op} label={op} valor={op} selecionado={materiaDificuldade} onPress={setMateriaDificuldade} />
      ))}

      <TouchableOpacity
        style={[styles.btn, (!meta || !materiaDificuldade) && styles.btnDisabled]}
        disabled={!meta || !materiaDificuldade}
        onPress={salvarEAvancar}
      >
        <Text style={styles.btnText}>Ver meu plano →</Text>
      </TouchableOpacity>
    </ScrollView>,
  ];

  return <View style={styles.container}>{steps[step]}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f1a' },
  stepContainer: { padding: 28, paddingBottom: 60 },
  stepIndicator: { color: '#7C3AED', fontWeight: 'bold', marginBottom: 8 },
  stepIndicador: { color: '#7C3AED', fontWeight: 'bold', marginBottom: 8 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 24 },
  pergunta: { fontSize: 16, color: '#ccc', marginTop: 20, marginBottom: 10, fontWeight: '600' },
  opcao: { backgroundColor: '#1a1a2e', borderRadius: 12, padding: 14,
    marginBottom: 8, borderWidth: 1, borderColor: '#2a2a3e' },
  opcaoSelecionada: { borderColor: '#7C3AED', backgroundColor: '#1e1040' },
  opcaoText: { color: '#aaa', fontSize: 15 },
  opcaoTextSelecionada: { color: '#fff', fontWeight: 'bold' },
  input: { backgroundColor: '#1a1a2e', color: '#fff', borderRadius: 12,
    padding: 14, marginTop: 8, borderWidth: 1, borderColor: '#2a2a3e' },
  btn: { backgroundColor: '#7C3AED', borderRadius: 14, padding: 16,
    alignItems: 'center', marginTop: 32 },
  btnDisabled: { backgroundColor: '#3a2a5e', opacity: 0.5 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});