# Chapter 11 — DNS, Cloudflare, and Edge Security

## Outcome

You will connect the public domain to the frontend and API, enforce TLS, configure Cloudflare proxying, separate cacheable assets from private API responses, and deploy layered WAF/rate-limit rules without blocking legitimate learners.

## 1. DNS plan

| Record | Name | Target | Proxy | Purpose |
|---|---|---|---|---|
| A/AAAA | `@` | provider origin | Proxied | apex website |
| CNAME | `www` | `@` | Proxied | canonical redirect |
| CNAME | `api` | backend hostname | Proxied | API origin |
| CNAME | `staging` | staging frontend | Proxied | pre-release testing |

Use low TTL during migration, then raise it after verification. Do not publish database hosts or private service names.

## 2. TLS setup

1. Add the domain to Cloudflare.
2. Change registrar nameservers exactly as shown by Cloudflare.
3. Install a valid origin certificate.
4. Select **Full (strict)**.
5. Enable Always Use HTTPS and TLS 1.2 minimum.
6. Add HSTS only after every required subdomain works over HTTPS.
7. Verify:

```bash
curl --head --location https://example.com
curl --head --location https://api.example.com/health
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -issuer -dates
```

## 3. Cache policy

Cache hashed frontend assets with long immutable lifetimes. Bypass cache for `/api/*`, authenticated responses, cookies, and mutation methods. Never cache personalized HTML or a response containing access tokens.

## 4. WAF and bot controls

Apply managed rules in log mode first, inspect false positives, then block high-confidence exploit paths. The supplied `cloudflare-rules.json` blocks common scanner paths, challenges API writes, bypasses API caching, and adds a bounded rate limit. Tune by route, identity, and response status rather than blocking entire countries without evidence.

## 5. Origin protection

Restrict origin firewalls to Cloudflare IP ranges, validate the original host, configure trusted proxy hops, and alert on direct-origin traffic. Store Cloudflare API tokens with only Zone DNS/Edit and WAF permissions required for the deployment automation.

## 6. CLI and API setup

Install Cloudflare's CLI/API tooling through the official release channel, then verify:

```bash
cloudflared --version
cloudflared tunnel login
cloudflared tunnel list
```

Windows:

```powershell
winget install Cloudflare.cloudflared
cloudflared --version
```

Create a scoped API token in the Cloudflare dashboard. Store it as `CLOUDFLARE_API_TOKEN`; do not use a global account key for course automation.

## 7. DNS verification commands

```bash
dig +short example.com A
dig +short www.example.com CNAME
dig +short api.example.com CNAME
curl --fail --silent --show-error --resolve api.example.com:443:ORIGIN_IP https://api.example.com/health
```

Windows:

```powershell
Resolve-DnsName example.com
Resolve-DnsName api.example.com
Test-NetConnection api.example.com -Port 443
```

Have an agent generate a DNS change plan, but require a human to compare it with the intended records before applying it.

## Learn by executing

Run [`LAB.md`](LAB.md) for reversible DNS, TLS, and edge verification. Each command is annotated with the layer it proves; [`EXPLAINED.md`](EXPLAINED.md) explains proxying and cache decisions.
