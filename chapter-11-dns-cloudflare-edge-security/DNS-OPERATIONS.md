# DNS Operations Runbook

## Change procedure

1. Export current records.
2. Lower TTL before migration.
3. Apply one record change.
4. Resolve from multiple networks.
5. Test HTTPS, redirects, cache headers, and API writes.
6. Restore the previous record set if verification fails.
7. Raise TTL after the change window.

Never place secrets, database addresses, or internal hostnames in public DNS. Keep Cloudflare zone exports encrypted and access-controlled.
