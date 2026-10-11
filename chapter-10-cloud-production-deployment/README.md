# Chapter 10: Cloud Production Deployment

Vercel serves the compiled frontend and proxies `/api/*` to the backend. Render and Railway can build the Docker image below from the repository root. SnapDeploy should invoke the same immutable image or frontend build artifact rather than rebuilding from an unpinned working tree.

Before release, set environment variables through the provider secret store, configure health checks at `/health`, restrict CORS to the production frontend origin, and verify rollback using the previous image digest.

