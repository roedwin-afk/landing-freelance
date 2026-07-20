// src/pages/api/capi.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    const pixelId = import.meta.env.META_PIXEL_ID;
    const token = import.meta.env.META_ACCESS_TOKEN;
    const testEventCode = import.meta.env.META_TEST_EVENT_CODE; // Espacio para configuración futura
    
    if (!pixelId || !token) {
        return new Response(JSON.stringify({ error: 'Faltan credenciales CAPI' }), { status: 500 });
    }

    try {
        const body = await request.json();
        const eventName = body.eventName || 'InitiateCheckout';
        const eventSourceUrl = request.headers.get('referer') || '';
        const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || '';
        const userAgent = request.headers.get('user-agent') || '';

        const payload: any = {
            data: [
                {
                    event_name: eventName,
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    event_source_url: eventSourceUrl,
                    user_data: {
                        client_ip_address: clientIp,
                        client_user_agent: userAgent
                    }
                }
            ]
        };

        // Si existe el código de prueba en las variables de entorno, lo inyecta en el payload
        if (testEventCode) {
            payload.test_event_code = testEventCode;
        }

        const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${token}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: response.ok ? 200 : 400 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error interno CAPI' }), { status: 500 });
    }
};