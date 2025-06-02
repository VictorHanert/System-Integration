[GitHub] 
   │
   │ POST /githubwebhookjson (JSON‐payload)
   ▼
────────────────────────────────────  <─ Public Internet 
│  https://mywebhook.loca.lt        │
│  (Localtunnel URL)                │
────────────────────────────────────
   │
   │ Tunnel → https://localhost:8080
   ▼
[Local Express‐app] listens on /githubwebhookjson
   │
   │ console.log(req.body)
   └─>  response 204 No Content
GitHub ser 204 og ved, at det lykkedes.
