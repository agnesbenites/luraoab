import { Router, Request, Response } from 'express';
import { supabase } from '../db/supabase';
import { createClient } from '@supabase/supabase-js';
import { authMiddleware } from '../middleware/authMiddleware';

// Cliente admin com service_role para deletar usuários do auth
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: 'Email e senha obrigatórios' });

  const { data, error } = await supabase.auth.signUp({ email, password: senha });
  if (error) return res.status(400).json({ erro: error.message });

  return res.status(201).json({ mensagem: 'Conta criada com sucesso', usuario: data.user });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, senha } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) return res.status(401).json({ erro: 'Credenciais inválidas' });

  return res.json({ token: data.session?.access_token, usuario: data.user });
});

// ── Exclusão permanente de conta ─────────────────────────────────────────────
router.delete('/excluir-conta', authMiddleware, async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    // 1. Remove respostas do usuário
    await supabaseAdmin
      .from('respostas_usuario')
      .delete()
      .eq('user_id', userId);

    // 2. Remove perfil de onboarding
    await supabaseAdmin
      .from('perfil_onboarding')
      .delete()
      .eq('usuario_id', userId);

    // 3. Remove perfil principal
    await supabaseAdmin
      .from('perfis')
      .delete()
      .eq('id', userId);

    // 4. Remove o usuário do auth (requer service_role)
    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteAuthError) throw deleteAuthError;

    return res.json({ mensagem: 'Conta excluída com sucesso' });
  } catch (error: any) {
    console.error('Erro ao excluir conta:', error);
    return res.status(500).json({ erro: 'Não foi possível excluir a conta.' });
  }
});

export default router;