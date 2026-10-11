# Chapter 10 Deployment Walkthrough

The Docker build creates a dependency stage, copies production dependencies into a smaller runtime, creates a non-root user, exposes port `3000`, defines a health check, and starts the server. `docker build` produces the artifact; `docker run --publish` maps a host port; `curl /health` proves the process is alive.

`vercel login` authenticates the CLI, `vercel link` associates the directory with a project, `vercel env add` stores a deployment variable, and `vercel deploy --prod` publishes the build. The release record must include a Git SHA, image digest, URLs, smoke test, and rollback target.

