# CLAUDE.md

Guidance for Claude Code working in this fullstack template.

## Stack

- **Backend**: Django + DRF. API in `api/` (v1 in `api/v1/`), shared models/utils in `core/`. Token auth (`rest_framework.authtoken`). Package mgmt via `uv`.
- **Frontend**: React + Vite SPA in `frontend/`, routing by TanStack Router (file-based, `frontend/src/routes/`), state by Jotai. Package mgmt via `pnpm`.

## Auth + frontend flow (read before touching login/onboarding/routing)

- Endpoints: `api/v1/auth_api.py` — `POST /auth/google/`, `POST /auth/register/`, `POST /auth/login/` each return `{ token, user }`; `GET /auth/me/` rehydrates the user from the token; `POST /auth/logout/` deletes the token.
- The user shape is `UserSerializer` in `api/v1/serializers.py` → `{ id, email, onboarded }`. Frontend mirror: `AuthUser` in `frontend/src/features/auth/types.ts`.
- **Routing is centralized in `AuthGate`** (`frontend/src/features/auth/components/auth-gate.tsx`) — the single source of truth for redirects:
  - No token + not on a public path (`/`, `/login`) → `/login`.
  - Token + `!onboarded` → `/onboarding` (the opt-in gate; dormant by default).
  - `onboarded` + on public/`/onboarding` → `/dashboard`.
- **`onboarded` source of truth** = `get_onboarded` in `api/v1/serializers.py`. **It defaults to `True`** so a fresh template runs `login → dashboard` out of the box. The `/onboarding` page (`frontend/src/routes/onboarding.tsx`) is an optional placeholder and is unreachable while `onboarded` is always true.

### Enabling a real onboarding step

Previously the template trapped users in onboarding because `get_onboarded` read a non-existent `profile` model and always returned false with no way to complete it. To build a working onboarding flow, change **all four** touch-points in one pass:

1. **Model**: add a `Profile` model (or an `onboarded`/`full_name` field) in `core/models.py`, then `make mmg && make migrate`.
2. **Serializer**: `get_onboarded` in `api/v1/serializers.py` returns the real state (e.g. `bool(obj.profile.full_name)`).
3. **Endpoint**: add a PATCH/POST in `api/v1/auth_api.py` (wired in the v1 urls) that fills the profile / flips the flag.
4. **Frontend**: build the form in `frontend/src/routes/onboarding.tsx` to call that endpoint, then refetch `me()` so `AuthGate` redirects to `/dashboard`.

## Dev commands (Makefile)

- `make dev` — Django dev server on :8000.
- `make web` — frontend dev server (`pnpm run dev`).
- `make migrate` / `make mmg` — apply / make migrations.
- `make lint` — `ruff format` + `ruff check --fix`.
- `make dock` — full docker compose stack.
- Frontend build/typecheck: `cd frontend && pnpm run build`.
