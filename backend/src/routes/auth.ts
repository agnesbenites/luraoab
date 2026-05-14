import { Router, Request, Response } from 'express';
import { supabase } from '../db/supabase';

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

export default router;
