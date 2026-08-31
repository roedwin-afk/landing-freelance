// src/pages/api/lead.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    const webhookUrl = import.meta.env.N8N_LEAD_WEBHOOK_URL;

    if (!webhookUrl) {
        return new Response(JSON.stringify({ error: 'Falta configurar webhook de n8n' }), { status: 500 });
    }

    try {
        const body = await request.json();
        const email = (body.email || '').trim();
        const name = (body.name || '').trim();
        const hp = body.hp; // honeypot anti-spam

        // Si el campo trampa viene lleno, es un bot: respondemos ok sin hacer nada
        if (hp) {
            return new Response(JSON.stringify({ ok: true }), { status: 200 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return new Response(JSON.stringify({ error: 'Email inválido' }), { status: 400 });
        }

        const eventSourceUrl = request.headers.get('referer') || '';
        const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || '';

        const payload = {
            email,
            name: name || null,
            source: 'landing-freelance',
            page_url: eventSourceUrl,
            client_ip: clientIp,
            created_at: new Date().toISOString()
        };

        const n8nResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!n8nResponse.ok) {
            return new Response(JSON.stringify({ error: 'Error al enviar a n8n' }), { status: 502 });
        }

        return new Response(JSON.stringify({ ok: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error interno' }), { status: 500 });
    }
};