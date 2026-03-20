import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nome, email, telefone, servico, mensagem, pagina } = body;

    if (!nome?.trim() || !telefone?.trim()) {
      return NextResponse.json(
        { error: "Nome e telefone são obrigatórios." },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY não configurada.");
      return NextResponse.json(
        { error: "Configuração de email incompleta no servidor." },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const origem = servico || pagina || "Site";
    const assunto = `Orçamento ISF: ${origem} — ${nome}`;

    const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /></head>
<body style="font-family:Arial,sans-serif;background:#f4f4f4;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <div style="background:#126798;padding:24px 28px;">
      <h1 style="color:#fff;margin:0;font-size:1.2rem;">Nova solicitação de orçamento</h1>
      <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:0.88rem;">ISF Soluções em Segurança — ${origem}</p>
    </div>
    <div style="padding:28px;">
      <table style="width:100%;border-collapse:collapse;font-size:0.93rem;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;width:120px;vertical-align:top;">Nome</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#1a1d20;font-weight:600;">${nome}</td>
        </tr>
        ${email ? `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;vertical-align:top;">E-mail</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#1a1d20;">${email}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;vertical-align:top;">Telefone</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#1a1d20;">${telefone}</td>
        </tr>
        ${servico ? `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;vertical-align:top;">Serviço</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#1a1d20;">${servico}</td>
        </tr>` : ""}
        ${pagina ? `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#6b7280;vertical-align:top;">Página</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#1a1d20;">${pagina}</td>
        </tr>` : ""}
        ${mensagem ? `
        <tr>
          <td style="padding:10px 0;color:#6b7280;vertical-align:top;">Mensagem</td>
          <td style="padding:10px 0;color:#1a1d20;line-height:1.6;">${mensagem.replace(/\n/g, "<br>")}</td>
        </tr>` : ""}
      </table>
    </div>
    <div style="background:#f9fafb;padding:16px 28px;font-size:0.78rem;color:#9ca3af;">
      Enviado via formulário do site em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
    </div>
  </div>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || "ISF Site <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL,
      replyTo: email || undefined,
      subject: assunto,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Erro ao enviar mensagem." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erro ao enviar email de contato:", err);
    return NextResponse.json(
      { error: "Erro ao enviar mensagem. Tente novamente." },
      { status: 500 }
    );
  }
}
