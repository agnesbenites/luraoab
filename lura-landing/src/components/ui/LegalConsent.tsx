import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';

interface LegalConsentProps {
  onAcceptChange: (accepted: boolean) => void;
}

export function LegalConsent({ onAcceptChange }: LegalConsentProps) {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    const nextState = !isChecked;
    setIsChecked(nextState);
    onAcceptChange(nextState);
  };

  const openLegalWebpage = () => {
    // Substitua pela URL final da sua landing page onde está a rota /legal
    Linking.openURL('https://luraoab.com.br/legal');
  };

  return (
    <View className="my-4 w-full">
      <TouchableOpacity 
        style={styles.container} 
        activeOpacity={0.8} 
        onPress={handleCheckboxChange}
      >
        <View style={[styles.checkbox, isChecked && styles.checked]}>
          {isChecked && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.text}>
          Li, compreendi e concordo com os{' '}
          <Text style={styles.link} onPress={openLegalWebpage}>
            Termos de Uso (Contrato de Adesão)
          </Text>{' '}
          e as{' '}
          <Text style={styles.link} onPress={openLegalWebpage}>
            Políticas de Privacidade
          </Text>{' '}
          do Lura OAB.
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#4A4A4A',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#b794ff',
    borderColor: '#b794ff',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 13,
    color: '#A0A0A0',
    flex: 1,
    lineHeight: 18,
  },
  link: {
    color: '#b794ff',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
});
