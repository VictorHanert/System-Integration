# 12a - Webhook System (Exposee & Integrator Roles)

## Roller

1. **Exposee** – tillader registrering af webhooks og sender events ud.
2. **Integrator** – registrerer sin webhook og modtager events.

## Teknologier

- Node.js og Express til begge roller.
- `ngrok` til at eksponere lokale servere til internettet.
- JSON som format for webhook payloads.
- cURL (eller Postman) til at registrere og teste.

---

## Installation og Start

**Installer og start exposee (webhook-server):**
```sh
npm install
cd exposee
node server.js
```

**Start integrator (webhook-modtager):**
```sh
cd integrator
node receiver.js
```

**Start exposee NGROK server:**
```sh
ngrok http 3000
```

**Start integrator NGROK server:**
```sh
ngrok http 4000
```

---

## Rolle: Som Exposee

Webhook-server (`server.js`) skal understøtte følgende endpoints:

- `POST /register` – gem webhook (fx i en JSON-fil)
- `GET /ping` – sender test payload til ALLE registrerede webhooks
- `POST /simulate-payment` – sender "payment_received"-event

---

## Register/Unregister Webhook via cURL

Registrer webhook:
```sh
curl -X POST https://abc123.ngrok-free.app/register \
  -H "Content-Type: application/json" \
  -d '{"url": "https://xyz456.ngrok-free.app/webhook", "event": "payment_received"}'
```

Afregistrer webhook:
```sh
curl -X POST https://abc123.ngrok-free.app/unregister \
  -H "Content-Type: application/json" \
  -d '{"url": "https://xyz456.ngrok-free.app/webhook", "event": "payment_received"}'
```

---

## Test og Simulering

**Test med ping:**
```sh
curl https://abc123.ngrok-free.app/ping
```

**Simuler betaling:**
```sh
curl -X POST http://localhost:3000/simulate-payment
```

---

## Storage af Webhooks

Webhooks gemmes lokalt i en JSON-fil: `webhooks.json`.

**Format:**
```json
[
  {
    "url": "https://xyz456.ngrok-free.app/webhook",
    "event": "payment_received"
  }
]
```