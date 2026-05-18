import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST() {
  try {
    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            id: "lura-oab-mensal",
            title: "Lura OAB - Plano Mensal",
            quantity: 1,
            unit_price: 15.9,
            currency_id: "BRL",
          },
        ],
        back_urls: {
          success: "https://luraoab.pages.dev/sucesso",
          failure: "https://luraoab.pages.dev/falha",
          pending: "https://luraoab.pages.dev/pendente",
        },
        auto_return: "approved",
        notification_url: "https://SEU-BACKEND-REAL.com/api/webhooks/mercadopago",
        statement_descriptor: "LURAOAB",
        external_reference: "plano-mensal-lura-oab",
      },
    });

    return NextResponse.json({
      init_point: response.init_point,
      id: response.id,
    });
  } catch (error) {
    console.error("Erro ao criar checkout Mercado Pago:", error);
    return NextResponse.json(
      { error: "Não foi possível criar o checkout." },
      { status: 500 }
    );
  }
}
