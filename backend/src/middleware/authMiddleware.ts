import { Request, Response, NextFunction } from 'express';
import { supabase } from '../db/supabase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ erro: 'Token inválido' });

  (req as any).userId = data.user.id;
  next();
};
