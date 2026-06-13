import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message, type = "text" } = body;

    if (!to || !message) {
      return NextResponse.json(
        { error: "Se requieren los campos 'to' y 'message'" },
        { status: 400 }
      );
    }

    // Integración con WhatsApp Business API (Meta)
    // Reemplazar con credenciales reales en producción
    const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return NextResponse.json(
        { error: "Configuración de WhatsApp no encontrada" },
        { status: 503 }
      );
    }

    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type,
      text: type === "text" ? { preview_url: false, body: message } : undefined,
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Error al enviar mensaje", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, messageId: data.messages?.[0]?.id });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// Webhook de verificación para Meta
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Token inválido" }, { status: 403 });
}
