# Chapter 11: DNS, Cloudflare, and Edge Security

Use DNS records that expose only the intended public surface:

| Record | Name | Target | Proxy |
|---|---|---|---|
| A | `@` | Cloudflare-managed origin address | Proxied |
| CNAME | `www` | `@` | Proxied |
| CNAME | `api` | Backend provider hostname | Proxied |

Set SSL/TLS to Full (strict), enable HSTS only after every subdomain is HTTPS-capable, and keep origin firewalls limited to Cloudflare IP ranges. Cache immutable frontend assets aggressively; bypass cache for authenticated API responses. Deploy WAF managed rules first, then add narrow rate limits and bot challenges based on observed traffic. `cloudflare-rules.json` is a declarative review artifact; apply it through an authenticated, audited infrastructure pipeline.

