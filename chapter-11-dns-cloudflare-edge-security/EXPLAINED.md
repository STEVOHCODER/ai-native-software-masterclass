# Chapter 11 DNS and Edge Walkthrough

The DNS table maps the apex, `www`, and `api` names to public services. Proxying hides the origin and enables Cloudflare controls. Full (strict) TLS validates the origin certificate. `dig`/`Resolve-DnsName` query records; `curl` tests HTTPS behavior; `openssl s_client` prints certificate dates. `cloudflared tunnel login` authenticates the local CLI and `tunnel list` proves the account can be queried.

The WAF rules are intentionally applied after export and review. Cache bypass for API paths prevents personalized or authenticated responses from being served to another user.

