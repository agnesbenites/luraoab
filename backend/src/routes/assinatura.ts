import { Router, Request, Response } from 'express';
import { supabase } from '../db/supabase';

const router = Router();

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_TOKEN || 'SEU_ACCESS_TOKEN_AQUI';

/**
 * POST /assinatura/criar-checkout
 * Gera um link de pagamento do Mercado Pago e retorna ao app
 */
router.post('/criar-checkout', async (req: Request, res: Response) => {
  const { userId, email, plano } = req.body;

  if (!userId || !email || !plano) {
    return res.status(400).json({
      error: 'userId, email e plano são obrigatórios.',
    });
  }

  const planos: Record<string, { title: string; price: number }> = {
    mensal: {
      title: 'Lura OAB Premium Mensal',
      price: 15.9,
    },
    anual: {
      title: 'Lura OAB Premium Anual',
      price: 119.9,
    },
  };

  const planoSelecionado = planos[plano];

  if (!planoSelecionado) {
    return res.status(400).json({
      error: 'Plano inválido. Use mensal ou anual.',
    });
  }

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            title: planoSelecionado.title,
            quantity: 1,
            unit_price: planoSelecionado.price,
            currency_id: 'BRL',
          },
        ],
        payer: {
          email,
        },
        external_reference: String(userId),
        notification_url: 'https://p4g658sh-3333.use2.devtunnels.ms/assinatura/webhook',
        back_urls: {
          success: 'https://p4g658sh-3333.use2.devtunnels.ms/assinatura/sucesso',
          failure: 'https://p4g658sh-3333.use2.devtunnels.ms/assinatura/falha',
          pending: 'https://p4g658sh-3333.use2.devtunnels.ms/assinatura/pendente',
        },
        auto_return: 'approved',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('STATUS MP:', response.status);
      console.error('BODY MP:', errorText);

      return res.status(500).json({
        error: 'Falha ao criar checkout no Mercado Pago.',
        detalhe: errorText,
      });
    }

    const data = await response.json();
    const checkoutUrl = data.sandbox_init_point || data.init_point;

    if (!checkoutUrl) {
      return res.status(500).json({
        error: 'Checkout URL não retornada pelo Mercado Pago.',
      });
    }

    return res.status(200).json({ checkoutUrl });
  } catch (error) {
    console.error('Erro interno ao criar checkout:', error);
    return res.status(500).json({
      error: 'Erro interno ao gerar checkout.',
    });
  }
});

/**
 * POST /assinatura/webhook
 * URL para receber notificações do Mercado Pago
 */
router.post('/webhook', async (req: Request, res: Response) => {
  const { query, body } = req;
  const topic = query.topic || body.type;

  if (topic === 'payment') {
    const paymentId = query.id || (body.data && body.data.id);

    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao consultar o Mercado Pago');
      }

      const paymentData = await response.json();

      if (paymentData.status === 'approved') {
        const userId = paymentData.external_reference;

        if (userId) {
          const { error } = await supabase
            .from('perfis')
            .update({
              assinatura_ativa: true,
              data_pagamento: new Date().toISOString(),
              mercado_pago_id: paymentId,
            })
            .eq('id', userId);

          if (error) {
            console.error('Erro ao atualizar Supabase:', error.message);
            return res.status(500).send('Erro interno ao salvar assinatura.');
          }

          console.log(`Assinatura ativada com sucesso para o usuário: ${userId}`);
        }
      }
    } catch (error) {
      console.error('Erro no processamento do Webhook:', error);
      return res.status(500).send('Erro no processamento.');
    }
  }

  return res.status(200).send('OK');
});

export default router;