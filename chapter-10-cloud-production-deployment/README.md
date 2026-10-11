# Chapter 10 — Cloud Production Deployment

## Outcome

You will deploy the React frontend and Node API as repeatable artifacts, understand Vercel rewrites, Docker multi-stage builds, Render/Railway service settings, SnapDeploy-style triggers, health checks, secrets, and rollback.

## 1. Build locally like CI

```bash
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
pnpm install --frozen-lockfile
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run lint
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run typecheck
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run test
# What/why: Run the project tool through the configured package-manager/runtime workflow.
pnpm run build
# What/why: Build the deployable container artifact from the repository and its Dockerfile.
docker build --tag launchpad-api:local --file chapter-10-cloud-production-deployment/Dockerfile .
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --rm --publish 3000:3000 --env ALLOWED_ORIGIN=http://localhost:5173 launchpad-api:local
```

Test the image in a second terminal:

```bash
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail http://127.0.0.1:3000/health
```

## 2. Vercel frontend

```bash
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
npx vercel login
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
npx vercel link
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
npx vercel env add VITE_API_ORIGIN production
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
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
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
railway login
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
railway init
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
railway variables set NODE_ENV=production
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
railway up
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
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

```powershell
# What/why: Set a process environment variable so the next command receives explicit configuration.
$env:VITE_API_ORIGIN = 'https://api.example.com'
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
vercel env add VITE_API_ORIGIN production
```

```bash
# What/why: Set a process environment variable so the next command receives explicit configuration.
export VITE_API_ORIGIN=https://api.example.com
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
vercel env add VITE_API_ORIGIN production
```

## 8. AI deployment-agent contract

An agent may generate Dockerfiles, provider manifests, smoke-test scripts, and rollback instructions. It may not apply production migrations, rotate credentials, change DNS, or trigger a production deployment without a named human approval. Require the agent to print the Git SHA, image digest, environment, and rollback command before release.

## Learn by executing

Run [`LAB.md`](LAB.md) to build the image, run its health check, and deploy when cloud credentials exist. Inline command comments explain the release sequence; [`EXPLAINED.md`](EXPLAINED.md) explains the container and provider flow.
