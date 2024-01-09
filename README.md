# Book that space

Space rental management software for dance studios and community centers.

## Developer Setup

- install node.js, pnpm, supabase cli, docker
- read the [Style Guide](style_guide.md)
- setup local supabase; verify with `supabase status`
- create a dotenv file with the [example](bookspace/.env.example)
- `cd bookspace && pnpm dev`

### Running the supabase cli

Most commonly used commands.

```
supabase help
supabase start
supabase stop
supabase db diff
supabase migrations list
```
