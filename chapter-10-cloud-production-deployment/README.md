# Chapter 10 — Cloud Production Deployment

## Outcome

You will deploy the React frontend and Node API as repeatable artifacts, understand Vercel rewrites, Docker multi-stage builds, Render/Railway service settings, SnapDeploy-style triggers, health checks, secrets, and rollback.

## 1. Build locally like CI

These commands install project dependencies using the selected package manager and its lockfile policy. They also run the project tool through the configured package-manager/runtime workflow. They also build the deployable container artifact from the repository and its dockerfile. They also start the local container with explicit name, environment, port, and lifecycle settings.

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

These commands fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.

```bash
curl --fail http://127.0.0.1:3000/health
```

## 2. Vercel frontend

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

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

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

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

## 7. Provider CLI matrix

| Provider | Install | Verify | Deploy |
|---|---|---|---|
| Vercel | `npm i -g vercel` / `brew install vercel-cli` | `vercel whoami` | `vercel deploy --prod` |
| Railway | official CLI installer | `railway whoami` | `railway up` |
| Render | `brew install render` where supported or dashboard | `render workspace list` | service deploy hook |
| Docker | Docker Desktop/Engine | `docker version` | registry push |
| SnapDeploy | vendor CLI/webhook | vendor status command | signed release trigger |

PowerShell and POSIX shells differ in environment assignment:

These commands set a process environment variable so the next command receives explicit configuration. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
$env:VITE_API_ORIGIN = 'https://api.example.com'
vercel env add VITE_API_ORIGIN production
```

These commands set a process environment variable so the next command receives explicit configuration. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```bash
export VITE_API_ORIGIN=https://api.example.com
vercel env add VITE_API_ORIGIN production
```

## 8. AI deployment-agent contract

An agent may generate Dockerfiles, provider manifests, smoke-test scripts, and rollback instructions. It may not apply production migrations, rotate credentials, change DNS, or trigger a production deployment without a named human approval. Require the agent to print the Git SHA, image digest, environment, and rollback command before release.

## Learn by executing

Run [`LAB.md`](LAB.md) to build the image, run its health check, and deploy when cloud credentials exist. Inline command comments explain the release sequence; [`EXPLAINED.md`](EXPLAINED.md) explains the container and provider flow.
