# Chapter 10 — Cloud Production Deployment

## Outcome

You will deploy the React frontend and Node API as repeatable artifacts, understand Vercel rewrites, Docker multi-stage builds, Render/Railway service settings, SnapDeploy-style triggers, health checks, secrets, and rollback.

## 1. Build locally like CI

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
docker build --tag launchpad-api:local --file chapter-10-cloud-production-deployment/Dockerfile .
docker run --rm --publish 3000:3000 --env ALLOWED_ORIGIN=http://localhost:5173 launchpad-api:local
```

Test the image in a second terminal:

```bash
curl --fail http://127.0.0.1:3000/health
```

## 2. Vercel frontend

```bash
npx vercel login
npx vercel link
npx vercel env add VITE_API_ORIGIN production
npx vercel deploy --prod
```

Set the frontend build command to `pnpm run build`, output directory to `dist`, and install command to `pnpm install --frozen-lockfile`. The supplied `vercel.json` proxies API requests to a separately deployed origin and sends basic security headers.

## 3. Render

Create a Web Service from the repository:

```text
Build command: docker build -t launchpad-api -f chapter-10-cloud-production-deployment/Dockerfile .
Start command: docker run --publish $PORT:3000 launchpad-api
Health check path: /health
```

Prefer Render's native Docker service configuration when available so the platform owns port mapping. Set `PORT`, `ALLOWED_ORIGIN`, database URLs, and provider keys through the dashboard secret store.

## 4. Railway

```bash
railway login
railway init
railway variables set NODE_ENV=production
railway up
railway domain
```

Configure the service to use the Dockerfile, expose port `3000`, and attach a managed database only after reviewing backup and deletion settings.

## 5. SnapDeploy or equivalent

The deployment trigger must receive a signed webhook, verify the commit SHA, build an immutable image, run migrations as a separate approved step, execute smoke tests, shift traffic, and retain the previous image for rollback. Never deploy a mutable branch name as the release identifier.

## 6. Release gate

Record image digest, Git SHA, migration version, environment, operator, smoke-test output, and rollback target. A deployment is incomplete until `/health`, TLS, frontend asset loading, authenticated API behavior, and logs have been verified.

