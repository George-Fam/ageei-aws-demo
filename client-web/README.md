# Angular

## Prettier

- We use prettier to format code

- Use `prettier-check` to validate that your code is compliant

```bash
npm run prettier-check
```

- Use `prettier-fix` to apply autofix from prettier

```bash
npm run prettier-fix
```

## Linter

- We use `ng lint` to check for errors and uncompliant code

## Azure Static Web Apps configuration

- `src/staticwebapp.config.json` is used by Azure Static Web Apps to configure app behavior.
- You can define routes and authentication/authorization rules there.

Documentation: https://learn.microsoft.com/azure/static-web-apps/configuration
