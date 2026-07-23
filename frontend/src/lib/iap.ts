export async function inicializarIAP() {
  return false;
}

export async function buscarProdutos() {
  return [];
}

export async function comprarPlano() {
  throw new Error('IAP temporariamente desativado para o build de release.');
}

export function iniciarListenersDeCompra() {
  return () => {};
}

export async function finalizarIAP() {
  return;
}
