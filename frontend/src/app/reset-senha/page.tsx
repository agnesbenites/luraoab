'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-browser';

export default function ResetSenhaPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('Validando link...');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const setupRecoverySession = async () => {
      const hash = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(hash);

      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');
      const type = params.get('type');

      if (type !== 'recovery' || !access_token || !refresh_token) {
        setStatus('Link inválido ou expirado. Solicite um novo e-mail de recuperação.');
        setReady(false);
        return;
      }

      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

      if (error) {
        setStatus('Não foi possível validar o link de recuperação.');
        setReady(false);
        return;
      }

      setStatus('');
      setReady(true);
      window.history.replaceState({}, document.title, '/reset-senha');
    };

    setupRecoverySession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setStatus('Preencha os dois campos.');
      return;
    }

    if (password.length < 6) {
      setStatus('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    setStatus('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus(error.message || 'Não foi possível redefinir a senha.');
      setLoading(false);
      return;
    }

    setStatus('Senha redefinida com sucesso. Você já pode entrar com a nova senha.');
    setLoading(false);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Redefinir senha</h1>
        <p style={styles.subtitle}>
          Digite sua nova senha para concluir a recuperação da conta.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!ready || loading}
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!ready || loading}
            style={styles.input}
          />

          <button type="submit" disabled={!ready || loading} style={styles.button}>
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>

        {!!status && <p style={styles.status}>{status}</p>}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0f0f1a',
    padding: '24px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#151528',
    border: '1px solid #2a2a3e',
    borderRadius: '16px',
    padding: '32px 24px',
    boxSizing: 'border-box',
  },
  title: {
    color: '#fff',
    fontSize: '28px',
    margin: 0,
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#aaa',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '24px',
    lineHeight: 1.5,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  input: {
    background: '#1a1a2e',
    color: '#fff',
    border: '1px solid #2a2a3e',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '15px',
    outline: 'none',
  },
  button: {
    background: '#7C3AED',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 16px',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  status: {
    color: '#d1d5db',
    fontSize: '14px',
    textAlign: 'center',
    marginTop: '16px',
    lineHeight: 1.5,
  },
};