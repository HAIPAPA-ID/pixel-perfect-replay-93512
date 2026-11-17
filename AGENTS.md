<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Dashboard data flows through `src/lib/data/*` query options returning `DashboardDataset` (with `source: "mock" | "live"`); components never import mock data directly, so connecting the real backend only replaces fetchers. Why: swap mock → live without UI changes.
- Temporary mock data lives only in `src/lib/mock/` and the UI must show a visible "Data contoh" notice whenever `source === "mock"`. Why: mock numbers must never look like real business figures.
- Role permissions (pages per role, outlet scope) live in `src/lib/access.ts` as pure functions covered by `src/test/access.test.ts`; sidebar, page gate and dashboard scope all read from it. Why: one source of truth for Owner/Manager/Cashier access.
- Pure dashboard calculations live in `src/lib/dashboard/metrics.ts`; business dates are `YYYY-MM-DD` keys in the business timezone (`src/lib/dates.ts`). Why: identical SSR/browser output and testable math.
- The app shell (sidebar + header + access gate) wraps `<Outlet />` in `src/routes/__root.tsx`; nav items are defined once in `src/components/layout/nav-config.ts`.
