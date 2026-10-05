---
name: Cosmic Cones refresh behavior
description: User requirement for manual refresh and the Replit preview HMR configuration decision.
---

The Cosmic Cones storefront should not automatically reload. Keep a manual pull-to-refresh gesture as the only full-page reload path, and keep seasonal collection visibility reactive to local calendar dates without periodic polling.

**Why:** The user repeated that the site was still auto-refreshing and asked to stop it. Vite's dev client reloads after WebSocket disconnects, which recurred in the Replit preview; serving the built static site removes that reconnect path.

**How to apply:** Keep the editor preview on a build-then-static-serve workflow unless the user asks to restore hot updates. Rebuild/restart after source changes. Only the deliberate pull gesture should reload the page; seasonal windows update at local midnight and when the page becomes visible.
