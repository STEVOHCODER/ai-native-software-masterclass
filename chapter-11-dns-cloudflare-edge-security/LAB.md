# Practical Lab 11 — Connect and Verify a Domain at the Edge

## Starting point

Complete Lab 10 and own a domain or use the local-only verification path. Do not change a production zone without a backup and rollback plan.

## Installation


Run these commands in PowerShell to verify that WinGet is available and install the Windows development tools used in the course.

```powershell
winget install Cloudflare.cloudflared
```


Run these commands in the macOS shell to configure Homebrew and install the runtimes and utilities required by the course.

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


Run these commands to make the network request, fail visibly on HTTP errors, and inspect the returned service or deployment response.

```bash
cloudflared tunnel login
cloudflared tunnel list
dig +short example.com
dig +short api.example.com
curl --fail --silent --show-error https://api.example.com/health
```

Windows:


Run these commands to inspect DNS, TLS, or network connectivity directly and compare the observed result with the intended configuration.

```powershell
Resolve-DnsName example.com
Resolve-DnsName api.example.com
Test-NetConnection api.example.com -Port 443
```

## Expected result

DNS resolves to the intended proxied services, certificates are valid, HTTPS redirects work, and the API health endpoint is reachable through the public hostname.

## Verification


Run these commands to make the network request, fail visibly on HTTP errors, and inspect the returned service or deployment response.

```bash
curl --head --location https://example.com
openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates
```

## Troubleshooting

Check nameservers, proxy mode, origin certificate, stale TTL, and host headers. If direct-origin testing works but proxied traffic fails, inspect Cloudflare firewall/WAF events before changing application code.

## Completion criteria

The learner can export current DNS, make one reversible change, verify DNS/TLS/HTTP behavior, and restore the prior record set if required.

## Command annotations: what and why


Run these commands in PowerShell to verify that WinGet is available and install the Windows development tools used in the course.

```powershell
winget install Cloudflare.cloudflared                       # Install Cloudflare's tunnel/DNS diagnostic CLI.
Resolve-DnsName example.com                                 # Ask Windows DNS resolution for the public record.
Resolve-DnsName api.example.com                             # Verify the API hostname separately from the frontend.
Test-NetConnection api.example.com -Port 443               # Confirm TCP reachability to the HTTPS port.
```


Run these commands in the macOS shell to configure Homebrew and install the runtimes and utilities required by the course.

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
