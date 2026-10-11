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

These commands fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.

```bash
curl --fail --silent --show-error https://api.example.com/health
curl --fail --silent --show-error --head https://app.example.com
```

PowerShell:

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.

```powershell
Invoke-WebRequest https://api.example.com/health -UseBasicParsing
Invoke-WebRequest https://app.example.com -Method Head -UseBasicParsing
```

Treat a successful provider command as insufficient. The release is valid only after the application behavior and rollback target have been verified.
