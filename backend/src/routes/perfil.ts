import { Router, Request, Response } from 'express';
import { supabase } from '../db/supabase';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/onboarding', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const {
    prestouOAB, quantasVezes, faseChegou,
    estudouAntes, fezCursinho, qualCursinho,
    tempoEstudo, meta, materiaDificuldade,
  } = req.body;

  const { error } = await supabase.from('perfil_onboarding').upsert({
    usuario_id: userId,
    prestou_oab: prestouOAB,
    quantas_vezes: quantasVezes,
    fase_chegou: faseChegou,
    estudou_antes: estudouAntes,
    fez_cursinho: fezCursinho,
    qual_cursinho: qualCursinho,
    tempo_estudo: tempoEstudo,
    meta,
    materia_dificuldade: materiaDificuldade,
    criado_em: new Date().toISOString(),
  });

  if (error) return res.status(500).json({ erro: error.message });
  return res.json({ mensagem: 'Perfil salvo com sucesso' });
});

router.get('/metricas', async (_req: Request, res: Response) => {
  const { data, error } = await supabase.from('perfil_onboarding').select('*');
  if (error) return res.status(500).json({ erro: error.message });
  return res.json(data);
});

export default router;
