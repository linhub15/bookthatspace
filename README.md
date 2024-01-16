# Book that space

Space rental management software for dance studios and community centers.

## Developer Setup

- install node.js, pnpm, supabase cli, docker, deno
- add VSCode plugins eslint, deno, tailwindcss
- read the [Style Guide](style_guide.md)

### Supabase db

- `supabase start`; verify with `supabase status`

### Supabase functions

- create a dotenv file. [Example](supabase/functions/.env.example)
- `deno task functions`

### Frontend

- create a dotenv file. [Example](bookspace/.env.example)
- `deno task frontend` or `cd bookspace && pnpm dev`

### Running the supabase cli

Login and link to the remote project in order to diff and make changes. Most
commonly used commands.

```
supabase help
supabase start
supabase stop
supabase db diff
supabase migrations list
```
