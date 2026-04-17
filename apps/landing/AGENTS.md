# Instructions pour agents (IA ou humains)

Ce dépôt suit des conventions précises. **Lire d’abord** :

- **`.cursor/rules/kalit-stack.mdc`** — règle Cursor `alwaysApply` : structure `app/(home)`, `(auth)`, `(dashboard)`, Sass modules uniquement, pas Tailwind, `TextField`, composants `@/components/*`.
- **`.cursorrules`** — principes TS/React/Next, formatage, Icon, Link, env `@/env`.

En résumé :

| Sujet        | À faire                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------- |
| Routes       | Landing → `(home)` ; auth → `(auth)` ; app connectée → `(dashboard)`                                |
| CSS          | Un `.module.scss` par composant/page concerné ; mixin `glass-panel` dans `@/styles/_app-glass.scss` |
| Inputs       | Toujours `@/components/text-field`                                                                  |
| Nav / icônes | `Link` et `Icon` depuis `@/components`                                                              |
| Tailwind     | **Interdit** — retiré du projet                                                                     |

Les PR ou changements qui contreviennent à `kalit-stack.mdc` devront être corrigés avant merge.
