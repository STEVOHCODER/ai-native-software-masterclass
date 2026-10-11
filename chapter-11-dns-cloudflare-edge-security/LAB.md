# Practical Lab 11 — Connect and Verify a Domain at the Edge

## Starting point

Complete Lab 10 and own a domain or use the local-only verification path. Do not change a production zone without a backup and rollback plan.

## Installation

```powershell
winget install Cloudflare.cloudflared
```

```bash
brew install cloudflared
```

## Configuration

Create the intended records in the Cloudflare dashboard or API:

```text
@       A/AAAA   frontend origin       Proxied
www     CNAME    @                    Proxied
api     CNAME    backend provider      Proxied
```

Set SSL/TLS to **Full (strict)**, enable HTTPS redirects, and keep API caching bypassed.

## Execution

```bash
cloudflared tunnel login
cloudflared tunnel list
dig +short example.com
dig +short api.example.com
curl --fail --silent --show-error https://api.example.com/health
```

Windows:

```powershell
Resolve-DnsName example.com
Resolve-DnsName api.example.com
Test-NetConnection api.example.com -Port 443
```

## Expected result

DNS resolves to the intended proxied services, certificates are valid, HTTPS redirects work, and the API health endpoint is reachable through the public hostname.

## Verification

```bash
curl --head --location https://example.com
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates
```

## Troubleshooting

Check nameservers, proxy mode, origin certificate, stale TTL, and host headers. If direct-origin testing works but proxied traffic fails, inspect Cloudflare firewall/WAF events before changing application code.

## Completion criteria

The learner can export current DNS, make one reversible change, verify DNS/TLS/HTTP behavior, and restore the prior record set if required.

