# Parked: RAG chatbot + ShakGPT inference — 05/27/2026
Stopped pending regulatory clearance. Reversible.

## Frontend code (this repo)
git mv the following back from _parked/ to original locations:
- _parked/app-chat → src/app/chat
- _parked/app-admin → src/app/admin
- _parked/components-chat → src/components/chat
- _parked/components-admin → src/components/admin
- _parked/contexts → src/contexts
- _parked/useChatSession.ts, useChatMessages.ts → src/hooks/
- _parked/useChatSession.test.ts, useChatMessages.test.ts → src/hooks/__tests__/
- _parked/api-chat.ts → src/lib/api/chat.ts
- _parked/api-admin.ts → src/lib/api/admin.ts
- _parked/api-chat.test.ts → src/lib/api/__tests__/chat.test.ts
- _parked/types-chat.ts → src/lib/types/chat.ts
Then re-add: HeroSection AI CTA + ProjectMenu admin gear (see git history).

## VPS (chatbot backend)
See /opt/RAG_Personal/RESTORE.md on the VPS.
cd /opt/RAG_Personal && docker compose -f docker-compose.prod.yml start

## Pi (ShakGPT inference)
sudo systemctl enable --now cloudflared shakgpt-query shakgpt-babble