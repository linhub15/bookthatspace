# Developer Style Guide

Follow these conventions for consistency.

- use `undefined` over `null` https://github.com/supabase/supabase-js/issues/244
  - exception: database `null` value
- avoid premature abstraction unless there is explicit need
- pass arguments as objects
  - exception: only 1 argument
- pass optional arguments as `options` object as second parameter
- files names are `snake_case` lowercase and use underscores
  - exception: `app/routes` uses file based routing so `-` and camel cased
    variables are permitted
- all variable names are `pascalCased`
  - exception: search parameters use `snake_case`
  - exception: url routes use `snake_case`

### Hooks

- hooks are `camelCased`
- hooks are prefixed with `use`
- hooks are passsed `args`
- mutations must always throw `error` so consumers can handle handle them
  `onError`

### Components

- functional components are `PascalCased`
- functional components are passed `props` with a type `Prop` that is not
  exported
- use type props as `ComponentProps<"div">` when passing native HTML attributes
  to component
