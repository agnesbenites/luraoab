import { Router, Request, Response } from 'express';
import { supabase } from '../db/supabase';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/validar', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { purchaseToken, productId } = req.body;

  const { error } = await supabase.from('assinaturas').upsert({
    usuario_id: userId,
    produto_id: productId,
    purchase_token: purchaseToken,
    status: 'pendente_validacao',
    criado_em: new Date().toISOString(),
  });

  if (error) return res.status(500).json({ erro: error.message });
  return res.json({ mensagem: 'Assinatura registrada, validação em andamento' });
});

router.get('/status', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  const { data, error } = await supabase
    .from('assinaturas')
    .select('*')
    .eq('usuario_id', userId)
    .eq('status', 'ativa')
    .single();

  if (error || !data) return res.json({ ativa: false });
  return res.json({ ativa: true, plano: data.produto_id });
});

export default router;
