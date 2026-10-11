# Practical Lab 10 — Produce and Verify a Cloud Deployment

## Starting point

Complete Lab 09 and create accounts only for a provider you intend to use. A local Docker deployment is the required fallback when cloud credentials are unavailable.

## Installation

```powershell
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install Docker.DockerDesktop
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
npm install --global vercel
```

```bash
# What/why: Install the required developer tool through Homebrew on macOS.
brew install --cask docker
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
npm install --global vercel
```

For Railway use its official CLI installer; for Render use the dashboard or supported CLI. Verify each with `<provider> --version`.

## Configuration

Build and run the API image:

```bash
# What/why: Build the deployable container artifact from the repository and its Dockerfile.
docker build --tag launchpad-api:lab --file chapter-10-cloud-production-deployment/Dockerfile .
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --rm --publish 3000:3000 --env ALLOWED_ORIGIN=http://localhost:5173 launchpad-api:lab
```

In another terminal:

```bash
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail http://127.0.0.1:3000/health
```

Vercel:

```bash
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
vercel login
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
vercel link
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
vercel env add VITE_API_ORIGIN production
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
vercel deploy --prod
```

## Execution

Run the local image in one terminal and the health check in another. If you have a configured Vercel project, run the Vercel commands above after setting `VITE_API_ORIGIN`; otherwise record the local Docker URL as the reproducible fallback.

## Expected result

The container starts, `/health` returns `{"status":"ok"}`, and the deployed frontend is reachable if a Vercel project is configured. If cloud credentials are unavailable, the local Docker result is the explicit fallback.

## Verification

Record Git SHA, image tag/digest, frontend URL, API URL, smoke-test output, and rollback target in `DEPLOYMENT-CLI-MATRIX.md`.

## Troubleshooting

| Problem | Fix |
|---|---|
| Docker build fails | Run `docker version`, inspect the first failing layer |
| container exits | Run without `--rm`, inspect `docker logs` |
| Vercel rewrite fails | Check API origin and `vercel.json` |
| cloud deploy works but app fails | Run `/health` and browser smoke tests; provider success is not application success |

## Completion criteria

The learner has a reproducible image, a passing health check, and either a verified cloud URL or a documented local fallback with the missing account step identified.

## Command annotations: what and why

```powershell
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install Docker.DockerDesktop                       # Install the local container engine on Windows.
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
npm install --global vercel                                # Install the Vercel deployment CLI in the global npm prefix.
```

```bash
# What/why: Install the required developer tool through Homebrew on macOS.
brew install --cask docker                                # Install Docker Desktop on macOS.
# What/why: Install project dependencies using the selected package manager and its lockfile policy.
npm install --global vercel                                # Install the same deployment CLI on POSIX systems.
# What/why: Build the deployable container artifact from the repository and its Dockerfile.
docker build --tag launchpad-api:lab --file chapter-10-cloud-production-deployment/Dockerfile . # Build the API image from the repository context.
# What/why: Start the local container with explicit name, environment, port, and lifecycle settings.
docker run --rm --publish 3000:3000 --env ALLOWED_ORIGIN=http://localhost:5173 launchpad-api:lab # Start and expose the image, removing the container after exit.
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail http://127.0.0.1:3000/health                   # Prove the container is serving a healthy response.
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
vercel login                                               # Authenticate the deployment CLI.
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
vercel link                                                # Associate this directory with a Vercel project.
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
vercel env add VITE_API_ORIGIN production                  # Store the public API origin in the production environment.
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
vercel deploy --prod                                       # Build and publish the production frontend.
```

`docker build` creates the immutable artifact; `docker run` tests it locally before cloud cost/risk. `--rm` prevents stopped lab containers accumulating. Vercel commands authenticate, associate, configure, and publish in that order.
