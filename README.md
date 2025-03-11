# Book that space

Facility booking software for halls and multi-purpose rooms.

## Quick Start

- Prerequisites `node.js`, `pnpm`
- create your `.env` file entries. [Example](.env.example)
- push database schema `pnpm drizzle push`
- read the [Style Guide](docs/style_guide.md)

```sh
pnpm install && pnpm dev
```

### Configure Google OAuth Client

[Create Google OAuth 2.0 Client](https://console.cloud.google.com/auth/clients)

```
Application type: Web application
name: localhost
Authorized JavaScript origigns: http://localhost:3000
Authorized redirect URIs: http://localhost:3000/api/auth/callback/google
```
