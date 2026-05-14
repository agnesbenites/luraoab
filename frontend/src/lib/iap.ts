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
  try {
    await initConnection();
    console.log('IAP conectado');
  } catch (e) {
    console.warn('Erro ao conectar IAP:', e);
  }
}

export async function encerrarIAP() {
  await endConnection();
}

export async function buscarAssinaturas() {
  try {
    const subs = await getSubscriptions({ skus: Object.values(PRODUCT_IDS) });
    return subs;
  } catch (e) {
    console.warn('Erro ao buscar assinaturas:', e);
    return [];
  }
}

export async function assinar(productId: string) {
  await requestSubscription({ sku: productId });
}

export function ouvirCompras(
  onSucesso: (purchase: SubscriptionPurchase) => void,
  onErro: (error: PurchaseError) => void
) {
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
