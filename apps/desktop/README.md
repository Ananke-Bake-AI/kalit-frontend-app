# @kalit/desktop

Desktop app shell for Kalit Studio (Mac / Windows / Linux).

**Status:** not yet scaffolded. This directory is a placeholder reserved in the
monorepo. The Studio UI has already been extracted to `@kalit/studio-ui` so
this app can consume the exact same components the web version uses.

## Planned shape

- **Shell:** Tauri 2 (Rust core + system webview). Smaller bundle and lower
  memory than Electron, and the Rust side gives us a clean place for native
  concerns like auto-update, deep links, and OS keychain access for broker
  tokens.
- **UI:** Next.js or Vite + React 19 rendering `@kalit/studio-ui`. No taskforce
  bundled locally — every build still routes through the Kalit broker.
- **Auth:** OAuth/device-code flow → short-lived JWT stored in the OS keychain.
  Wire `setStudioBrokerClient` with a `getToken` that reads from the keychain
  and a `baseUrl` pointing at the production broker.
- **Host context:** provide `StudioHostProvider` with `user` from the
  authenticated session and a `navigate` that uses the router of whichever
  framework (Next/Vite) ends up wrapping the UI.

## Integration contract (already in place)

The shared `@kalit/studio-ui` package exposes two wiring points the desktop
app must satisfy before rendering Studio components:

```ts
import { setStudioBrokerClient, StudioHostProvider } from "@kalit/studio-ui"
import { createBrokerClient } from "@kalit/broker-client"

const client = createBrokerClient({
  baseUrl: "https://kalit.ai",
  getToken: async () => keychain.read("kalit-broker-token"),
})
setStudioBrokerClient(client)

// then render:
<StudioHostProvider value={{ user, navigate, getSearchParam }}>
  <Studio />
</StudioHostProvider>
```

## Next steps

1. `pnpm create tauri-app` inside this directory (or pick Electron if the team
   prefers).
2. Add a thin Next.js/Vite renderer that imports `@kalit/studio-ui` and
   `@kalit/i18n`, mirroring the wiring in `apps/landing/app/[locale]/(studio)/studio-shell.tsx`.
3. Implement OAuth + keychain token storage in Rust (or Electron main).
4. CI: add macOS notarization + Windows code signing once we have distribution
   certs.
