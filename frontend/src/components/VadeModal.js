import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function VadeModal({ visivel, fechar, artigos, aoExplicarArtigo, loadingArtigo, conteudo }) {
  return (
    <Modal animationType="slide" transparent={true} visible={visivel}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>VADEMECUM CONTEXTUAL</Text>
            <TouchableOpacity onPress={fechar} style={styles.btnClose}>
              <Text style={styles.btnCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.instrucao}>Selecione um artigo para ver a doutrina comparada:</Text>

            {loadingArtigo && !conteudo && (
              <ActivityIndicator color="#8B5CF6" style={{ marginVertical: 20 }} />
            )}

            {artigos.map((art, index) => (
              <View key={index} style={styles.artigoCard}>
                <Text style={styles.artigoTexto}>{art}</Text>
                <TouchableOpacity
                  style={styles.btnExplicaArtigo}
                  onPress={() => aoExplicarArtigo(art)}
                  disabled={loadingArtigo}
                >
                  <Text style={styles.btnTextSmall}>
                    {loadingArtigo ? "Consultando..." : "✨ Explicar Artigo"}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Exibe análise doutrinária do artigo selecionado */}
            {conteudo ? (
              <View style={styles.conteudoCard}>
                <Text style={styles.conteudoTitle}>📖 Análise Doutrinária</Text>
                <Text style={styles.conteudoTexto}>{conteudo}</Text>
              </View>
            ) : null}

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#FFF', height: '80%', borderTopLeftRadius: 30,
    borderTopRightRadius: 30, padding: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontWeight: '900', color: '#4F46E5', fontSize: 14 },
  btnClose: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center' },
  btnCloseText: { fontSize: 14, color: '#64748B', fontWeight: '700' },
  instrucao: { color: '#94A3B8', marginBottom: 15, fontSize: 12 },
  artigoCard: { backgroundColor: '#F8FAFC', padding: 15, borderRadius: 12,
    marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  artigoTexto: { fontSize: 14, color: '#1E293B', lineHeight: 20, marginBottom: 10 },
  btnExplicaArtigo: { backgroundColor: '#8B5CF6', padding: 8, borderRadius: 8, alignSelf: 'flex-start' },
  btnTextSmall: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  conteudoCard: { backgroundColor: '#F5F3FF', borderRadius: 14, padding: 16,
    borderLeftWidth: 4, borderLeftColor: '#8B5CF6', marginTop: 8 },
  conteudoTitle: { fontSize: 13, fontWeight: '800', color: '#4C1D95', marginBottom: 8 },
  conteudoTexto: { fontSize: 14, color: '#4C1D95', lineHeight: 22 },
});