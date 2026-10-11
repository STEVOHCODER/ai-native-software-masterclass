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

```bash
curl --fail --silent --show-error https://api.example.com/health
curl --fail --silent --show-error --head https://app.example.com
```

PowerShell:

```powershell
Invoke-WebRequest https://api.example.com/health -UseBasicParsing
Invoke-WebRequest https://app.example.com -Method Head -UseBasicParsing
```

Treat a successful provider command as insufficient. The release is valid only after the application behavior and rollback target have been verified.
