# Deployment CLI Matrix

## Release evidence

```text
Git SHA:
Image digest:
Frontend deployment URL:
API deployment URL:
Database migration:
Smoke test:
Rollback target:
Approver:
```

## Smoke tests


Run these commands to make the network request, fail visibly on HTTP errors, and inspect the returned service or deployment response.

```bash
curl --fail --silent --show-error https://api.example.com/health
curl --fail --silent --show-error --head https://app.example.com
```

PowerShell:


Run these commands to complete the Invoke-WebRequest step and verify its result before continuing.

```powershell
Invoke-WebRequest https://api.example.com/health -UseBasicParsing
Invoke-WebRequest https://app.example.com -Method Head -UseBasicParsing
```

Treat a successful provider command as insufficient. The release is valid only after the application behavior and rollback target have been verified.
