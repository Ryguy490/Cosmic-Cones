---
name: Cosmic Cones refresh behavior
description: User requirement for manual refresh and the Replit preview HMR configuration decision.
---

The Cosmic Cones storefront should not automatically reload. Keep a manual pull-to-refresh gesture as the only full-page reload path, and keep seasonal collection visibility reactive to local calendar dates without periodic polling.

**Why:** The user repeated that the site was still auto-refreshing and asked to stop it. Replit preview logs showed recurring Vite WebSocket reconnects; forcing HMR to client port 443 failed in the local preview, so HMR was disabled.

**How to apply:** Preserve `server.hmr: false` unless the user asks to restore automatic code updates. Do not add a reload interval. Seasonal windows should update at the next local midnight and when the page becomes visible.
