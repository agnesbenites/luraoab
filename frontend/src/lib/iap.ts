import { Platform } from 'react-native';
import {
  initConnection,
  endConnection,
  getSubscriptions,
  requestSubscription,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  type SubscriptionPurchase,
  type PurchaseError,
} from 'react-native-iap';

// ID do produto criado no Google Play Console
export const PRODUCT_IDS = {
  mensal: 'lura_premium_monthly',
  anual: 'lura_premium_yearly',
};

export async function iniciarIAP() {
  if (Platform.OS === 'web') {
    console.log('Ambiente Web detectado: IAP nativo ignorado.');
    return;
  }
  try {
    await initConnection();
    console.log('IAP conectado');
  } catch (e) {
    console.warn('Erro ao conectar IAP:', e);
  }
}

export async function encerrarIAP() {
  if (Platform.OS === 'web') return;
  try {
    await endConnection();
  } catch (e) {
    console.warn('Erro ao encerrar IAP:', e);
  }
}

export async function buscarAssinaturas() {
  if (Platform.OS === 'web') {
    console.log('Ambiente Web: Retornando lista de assinaturas vazia.');
    return [];
  }
  try {
    const subs = await getSubscriptions({ skus: Object.values(PRODUCT_IDS) });
    return subs;
  } catch (e) {
    console.warn('Erro ao buscar assinaturas:', e);
    return [];
  }
}

export async function assinar(productId: string) {
  if (Platform.OS === 'web') {
    console.warn('Assinatura nativa não disponível no ambiente Web.');
    return;
  }
  await requestSubscription({ sku: productId });
}

export function ouvirCompras(
  onSucesso: (purchase: SubscriptionPurchase) => void,
  onErro: (error: PurchaseError) => void
) {
  if (Platform.OS === 'web') {
    // Retorna uma função vazia de limpeza (cleanup) para não quebrar o useEffect do componente
    return () => {};
  }

  const listenerSucesso = purchaseUpdatedListener(async (purchase) => {
    await finishTransaction({ purchase, isConsumable: false });
    onSucesso(purchase as SubscriptionPurchase);
  });

  const listenerErro = purchaseErrorListener(onErro);

  return () => {
    listenerSucesso.remove();
    listenerErro.remove();
  };
}
