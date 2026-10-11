# Practical Lab 11 — Connect and Verify a Domain at the Edge

## Starting point

Complete Lab 10 and own a domain or use the local-only verification path. Do not change a production zone without a backup and rollback plan.

## Installation

These commands install the selected Windows package so the required tool is available to later labs.

```powershell
winget install Cloudflare.cloudflared
```

These commands install the required developer tool through Homebrew on macOS.

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

These commands execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also inspect dns or tls evidence at the network boundary rather than assuming it is correct. They also fetch the requested https resource or exercise the http endpoint while failing visibly on errors.

```bash
cloudflared tunnel login
cloudflared tunnel list
dig +short example.com
dig +short api.example.com
curl --fail --silent --show-error https://api.example.com/health
```

Windows:

These commands inspect or prepare the local machine so the next operation has a known path and state.

```powershell
Resolve-DnsName example.com
Resolve-DnsName api.example.com
Test-NetConnection api.example.com -Port 443
```

## Expected result

DNS resolves to the intended proxied services, certificates are valid, HTTPS redirects work, and the API health endpoint is reachable through the public hostname.

## Verification

These commands fetch the requested https resource or exercise the http endpoint while failing visibly on errors. They also inspect dns or tls evidence at the network boundary rather than assuming it is correct.

```bash
curl --head --location https://example.com
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates
```

## Troubleshooting

Check nameservers, proxy mode, origin certificate, stale TTL, and host headers. If direct-origin testing works but proxied traffic fails, inspect Cloudflare firewall/WAF events before changing application code.

## Completion criteria

The learner can export current DNS, make one reversible change, verify DNS/TLS/HTTP behavior, and restore the prior record set if required.

## Command annotations: what and why

These commands install the selected windows package so the required tool is available to later labs. They also inspect or prepare the local machine so the next operation has a known path and state.

```powershell
winget install Cloudflare.cloudflared                       # Install Cloudflare's tunnel/DNS diagnostic CLI.
Resolve-DnsName example.com                                 # Ask Windows DNS resolution for the public record.
Resolve-DnsName api.example.com                             # Verify the API hostname separately from the frontend.
Test-NetConnection api.example.com -Port 443               # Confirm TCP reachability to the HTTPS port.
```

These commands install the required developer tool through homebrew on macos. They also execute this lab step; the surrounding explanation defines its expected result and reason for inclusion. They also inspect dns or tls evidence at the network boundary rather than assuming it is correct. They also fetch the requested https resource or exercise the http endpoint while failing visibly on errors.

```bash
brew install cloudflared                                   # Install the Cloudflare CLI through Homebrew.
cloudflared tunnel login                                   # Open the authenticated Cloudflare browser flow.
cloudflared tunnel list                                    # Prove the CLI can read the account's tunnel inventory.
dig +short example.com                                     # Print only the resolved apex address.
dig +short api.example.com                                 # Print only the API hostname target.
curl --fail --silent --show-error https://api.example.com/health # Prove the public edge route reaches the API.
curl --head --location https://example.com                  # Inspect redirects and response headers without downloading the body.
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates # Read certificate validity dates from the negotiated TLS connection.
```

The DNS commands prove name resolution, the network command proves port reachability, and the HTTPS commands prove the edge/origin chain. These are separate checks because a DNS record can resolve while TLS or the application still fails.
