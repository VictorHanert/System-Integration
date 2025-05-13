12a - Webhook System (Exposee & Integrator Roles)

- Vi har to roller i opgaven:
  1. **Exposee** – tillader registrering af webhooks og sender events ud.
  2. **Integrator** – registrerer sin webhook og modtager events.

- Vi bruger:
  - Node.js og Express til begge roller.
  - `ngrok` til at eksponere lokale servere til internettet.
  - JSON som format for webhook payloads.
  - cURL (eller Postman) til at registrere og teste.

INSTALLATION OG START
--------------------------------------------------------------------------------
Installer og start exposee (webhook-server):
   npm install
   cd exposee
   node server.js

Start integrator (webhook-modtager):

   cd integrator
   node receiver.js

Start exposee NGROK server:

   ngrok http 3000

Start integrator NGROK server:

   ngrok http 4000


ROLLE: SOM EXPOSEE
--------------------------------------------------------------------------------

Webhook-server (`server.js`) skal understøtte følgende endpoints:

   - `POST /register` – gem webhook (fx i en JSON-fil)
   - `GET /ping` – sender test payload til ALLE registrerede webhooks
   - `POST /simulate-payment` – sender "payment_received"-event

Register/unregister webhook via cURL (kørt af integrator eller ven):

   curl -X POST https://abc123.ngrok-free.app/register \
     -H "Content-Type: application/json" \
     -d '{"url": "https://xyz456.ngrok-free.app/webhook", "event": "payment_received"}'

    curl -X POST https://abc123.ngrok-free.app/unregister \
     -H "Content-Type: application/json" \
     -d '{"url": "https://xyz456.ngrok-free.app/webhook", "event": "payment_received"}'

Test med ping:
   curl https://abc123.ngrok-free.app/ping

Simuler betaling:
   curl -X POST http://localhost:3000/simulate-payment


STORAGE AF WEBHOOKS
--------------------------------------------------------------------------------

Webhooks gemmes lokalt i en JSON-fil: `webhooks.json`.

Format:

[
  {
    "url": "https://xyz456.ngrok-free.app/webhook",
    "event": "payment_received"
  }
]


