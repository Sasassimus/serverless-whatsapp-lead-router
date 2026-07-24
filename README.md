# Facebook Lead Ads to WhatsApp (via Zernio API)

This Cloudflare Worker script automatically captures new leads from Facebook Lead Ads webhooks and instantly sends them a customized WhatsApp template message using the [Zernio API](https://zernio.com).

## 🚀 Features
- **Zero Server Costs**: Runs entirely on Cloudflare Workers (The Free tier handles up to 100,000 requests/day).
- **Instant Engagement**: Contacts the lead within milliseconds of the form submission.
- **Secure**: Uses Cloudflare Secrets to keep your API keys hidden and safe from exposure.

## 🛠️ Setup Instructions

### 1. Cloudflare Permissions (For Client Setup)
If you are setting this up on a client's Cloudflare account, you only need them to grant you the **"Workers Platform Admin"** role. This provides the minimum access required to create the script and add the secure variables.

### 2. Environment Variables
You must configure the following in your Cloudflare Worker settings (`Settings > Variables and Secrets`):
- `ZERNIO_API_KEY`: Your Zernio API token (Add this as an encrypted **Secret**).
- `ZERNIO_ACCOUNT_ID`: Your Zernio WhatsApp Inbox ID (Alphanumeric string, e.g., `6a52...`).

### 3. Facebook Form Fields Mapping
**CRITICAL**: The script expects the Facebook Lead Form to use specific field names. Ensure your Facebook Form fields match the variables expected in the code:
- `phoneNumber`
- `fullName`

*If your form uses different parameter names (e.g., `phone` instead of `phoneNumber`), update line 28 in the `worker.js` file accordingly.*

### 4. WhatsApp Template Configuration
Before deploying, edit the following properties inside `worker.js`:
- `templateName`: The exact name of your approved WhatsApp template (e.g., `welcome_message_v1`).
- `templateLanguage`: The 2-letter language code of your template (e.g., `en`, `it`).
