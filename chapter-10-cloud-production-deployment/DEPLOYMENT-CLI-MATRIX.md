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
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail --silent --show-error https://api.example.com/health
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail --silent --show-error --head https://app.example.com
```

PowerShell:

```powershell
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
Invoke-WebRequest https://api.example.com/health -UseBasicParsing
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
Invoke-WebRequest https://app.example.com -Method Head -UseBasicParsing
```

Treat a successful provider command as insufficient. The release is valid only after the application behavior and rollback target have been verified.
