# Taskly

Editorial task management for focused teams.

## Getting Started

1. Copy env vars:

```bash
cp .env.example .env.local
```

2. Fill in your Supabase project URL and anon key in `.env.local`.

3. Install and run:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth routes

- `/sign-up` — create an account
- `/login` — sign in
- `/project` — protected area (requires `access_token` cookie)

API:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
