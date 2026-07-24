/**
 * Cloudflare Worker: Facebook Lead Ads to WhatsApp (via Zernio API)
 * 
 * Environment Variables required in Cloudflare:
 * - ZERNIO_API_KEY: Your Zernio API Key
 * - ZERNIO_ACCOUNT_ID: Your Zernio WhatsApp Inbox ID
 */

export default {
  async fetch(request, env, ctx) {
    // 1. Only allow POST requests (Facebook Webhook standard)
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const payload = await request.json();
      console.log("Payload received:", JSON.stringify(payload));

      // 2. Filter events (Process only new leads)
      if (payload.event !== 'lead.received') {
        return new Response('Event ignored', { status: 200 }); 
      }

      // 3. Extract Lead Form Fields
      // IMPORTANT: The keys 'phoneNumber' and 'fullName' MUST exactly match 
      // the field names configured in the Facebook Lead Form.
      const fields = payload.lead?.fields || {};
      const { phoneNumber, fullName } = fields;

      if (!phoneNumber || !fullName) {
        console.error("Missing essential lead data (phone or name).");
        return new Response('Bad Request: Missing data', { status: 400 });
      }

      // 4. Prepare the WhatsApp Template payload for Zernio
      const zernioBody = {
        accountId: env.ZERNIO_ACCOUNT_ID,
        participantId: phoneNumber,
        templateName: 'YOUR_WHATSAPP_TEMPLATE_NAME', // <-- Replace with your template name
        templateLanguage: 'en',                      // <-- Replace with your language code (e.g., 'en', 'it')
        templateParams: [fullName]                   // Parameters to inject into the template
      };

      // 5. Send request to Zernio API
      const zernioResponse = await fetch('https://api.zernio.com/v1/inbox/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.ZERNIO_API_KEY}`
        },
        body: JSON.stringify(zernioBody)
      });

      // 6. Handle API response
      if (!zernioResponse.ok) {
        const errorDetail = await zernioResponse.text();
        console.error("Zernio API Error:", zernioResponse.status, errorDetail);
        throw new Error(`Zernio Error: ${zernioResponse.status}`);
      }

      console.log("Success! Message sent to:", phoneNumber);
      return new Response('OK', { status: 200 });

    } catch (error) {
      console.error("Critical Worker Error:", error.message);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
