# CLAUDE.md

Guidance for Claude Code working in this fullstack template.

## Stack

- **Backend**: Django + DRF. API in `api/` (v1 in `api/v1/`). `core/` = project config (settings/urls/wsgi) + shared abstractions only (`BaseModel`, `AppSetting`, payments, utils). **Domain models do NOT go in `core` — each context gets its own app** (see [App structure](#app-structure-where-models-go)). Token auth (`rest_framework.authtoken`). Package mgmt via `uv`.
- **Frontend**: React + Vite SPA in `frontend/`, routing by TanStack Router (file-based, `frontend/src/routes/`), state by Jotai. Package mgmt via `pnpm`.

## App structure (where models go)

**One Django app per domain context. A new model = a new (or existing) domain app, NEVER `core`.**

- Create it: `uv run manage.py startapp <name>` at repo root (top-level, sibling to `core/` and `api/`), add `"<name>"` to `INSTALLED_APPS` in `core/settings.py`, then `make mmg && make migrate`.
- Name apps by context (`accounts`, `billing`, `projects`), not by layer. Domain models subclass `BaseModel` from `core.models` for ObjectId PK + timestamps + `actor`.
- `core` is reserved for project config and cross-cutting shared code only (`BaseModel`, `AppSetting`, payments, utils). Do **not** add feature/domain models to `core/models.py`.

## API conventions (read before adding endpoints)

API modules live in `api/v1/{resource}_api.py`. Use class-based `from rest_framework.views import APIView` (one `APIView` subclass per resource), wired in `api/v1/urls.py` via `.as_view()`, serializers centralized in `api/v1/serializers.py`.

- **A `{resource}_api.py` view may only define the four standard CRUD methods: `get`, `patch`, `post`, `delete`** (retrieve/list, update, create, destroy on that resource). No other HTTP methods belong here.
- **Everything else goes to `api/v1/{resource}_extras_api.py`** — one extras file per resource, sibling to its `_api.py`, wired in the same `urls.py`, also `APIView` classes. "Everything else" = custom / RPC-style actions that aren't plain CRUD on the resource: auth flows (`login`, `register`, `logout`, `google`), webhooks, bulk / aggregate / side-effect endpoints.
- Example: `ProjectAPI(APIView)` in `projects_api.py` defines `get`/`patch`/`post`/`delete` for projects; `projects_extras_api.py` holds `POST /projects/{id}/archive/` or `POST /projects/import/`.

> Existing `auth_api.py` / `payments_api.py` use the older function-based `@api_view` style and predate this rule. `auth_api.py`'s custom endpoints (`login`/`register`/`logout`/`google`) are the canonical example of what now belongs in an `auth_extras_api.py`. Leave both as-is unless you're touching them for another reason.

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

1. **Model**: create an `accounts` app (`uv run manage.py startapp accounts`), add `"accounts"` to `INSTALLED_APPS` in `core/settings.py`, define `Profile(BaseModel)` (e.g. `full_name`, `OneToOne` to `User`) in `accounts/models.py`, then `make mmg && make migrate`. Do **not** put this in `core/models.py` (see [App structure](#app-structure-where-models-go)).
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
