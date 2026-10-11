# Practical Lab 11 — Connect and Verify a Domain at the Edge

## Starting point

Complete Lab 10 and own a domain or use the local-only verification path. Do not change a production zone without a backup and rollback plan.

## Installation

```powershell
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install Cloudflare.cloudflared
```

```bash
# What/why: Install the required developer tool through Homebrew on macOS.
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
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
cloudflared tunnel login
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
cloudflared tunnel list
# What/why: Inspect DNS or TLS evidence at the network boundary rather than assuming it is correct.
dig +short example.com
# What/why: Inspect DNS or TLS evidence at the network boundary rather than assuming it is correct.
dig +short api.example.com
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail --silent --show-error https://api.example.com/health
```

Windows:

```powershell
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Resolve-DnsName example.com
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Resolve-DnsName api.example.com
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Test-NetConnection api.example.com -Port 443
```

## Expected result

DNS resolves to the intended proxied services, certificates are valid, HTTPS redirects work, and the API health endpoint is reachable through the public hostname.

## Verification

```bash
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --head --location https://example.com
# What/why: Inspect DNS or TLS evidence at the network boundary rather than assuming it is correct.
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates
```

## Troubleshooting

Check nameservers, proxy mode, origin certificate, stale TTL, and host headers. If direct-origin testing works but proxied traffic fails, inspect Cloudflare firewall/WAF events before changing application code.

## Completion criteria

The learner can export current DNS, make one reversible change, verify DNS/TLS/HTTP behavior, and restore the prior record set if required.

## Command annotations: what and why

```powershell
# What/why: Install the selected Windows package so the required tool is available to later labs.
winget install Cloudflare.cloudflared                       # Install Cloudflare's tunnel/DNS diagnostic CLI.
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Resolve-DnsName example.com                                 # Ask Windows DNS resolution for the public record.
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Resolve-DnsName api.example.com                             # Verify the API hostname separately from the frontend.
# What/why: Inspect or prepare the local machine so the next operation has a known path and state.
Test-NetConnection api.example.com -Port 443               # Confirm TCP reachability to the HTTPS port.
```

```bash
# What/why: Install the required developer tool through Homebrew on macOS.
brew install cloudflared                                   # Install the Cloudflare CLI through Homebrew.
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
cloudflared tunnel login                                   # Open the authenticated Cloudflare browser flow.
# What/why: Execute this lab step; the surrounding explanation defines its expected result and reason for inclusion.
cloudflared tunnel list                                    # Prove the CLI can read the account's tunnel inventory.
# What/why: Inspect DNS or TLS evidence at the network boundary rather than assuming it is correct.
dig +short example.com                                     # Print only the resolved apex address.
# What/why: Inspect DNS or TLS evidence at the network boundary rather than assuming it is correct.
dig +short api.example.com                                 # Print only the API hostname target.
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --fail --silent --show-error https://api.example.com/health # Prove the public edge route reaches the API.
# What/why: Fetch the requested HTTPS resource or exercise the HTTP endpoint while failing visibly on errors.
curl --head --location https://example.com                  # Inspect redirects and response headers without downloading the body.
# What/why: Inspect DNS or TLS evidence at the network boundary rather than assuming it is correct.
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates # Read certificate validity dates from the negotiated TLS connection.
```

The DNS commands prove name resolution, the network command proves port reachability, and the HTTPS commands prove the edge/origin chain. These are separate checks because a DNS record can resolve while TLS or the application still fails.
