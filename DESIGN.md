# ArcaDe Craft Web Design

## Direction

Game imagery, a recognizable wordmark and calm editorial structure lead the site.
The home page has two primary game destinations and retains the floating live-status panel.
No decorative capsule badges, cursor glows, fabricated activity, or technical stack promotion.
The reading surface is white and cool neutral, with charcoal text and cobalt navigation.
Gold marks the play action; coral distinguishes Rob's Village. The floating status panel
retains its original dark-violet character without turning every page into a dark theme.
Existing bitmap scenes are illustrative, not represented as screenshots of the live server.

## Reference Study

- ChickenNW: strong branded artwork and image-led game discovery.
- MorukCraft: concise gameplay introduction and an immediate connection action.
- ZenitMC: prominent server identity and accessible player destinations.
- SonKral: community/news content with recognizable navigation.
- Ross Kurtis's Minecraft refresh: game-specific introductions and community content.
- MiAO World / Loonatiks: distinctive voxel identity; navigation should remain familiar here.

Sources: https://rosskurtis.com/project/minecraft_site_refresh and https://loonatiks.gr/project/miao-world/.

Reference artwork, logos and copy are not imported into this project.

## Page Ownership

- Games: servers.html, survival.html, village.html.
- Survival: ONE page, four persistent sections (overview, guide, map, rankings).
  Seven guide topics are views of survival.html, never separate page destinations.
  Guide contents remain static HTML. Hash URLs support deep links, reload and history.
  The selected topic, the guide list and a visible return to Survival stay in context.
- Community: news.html combines news and about; staff has the same section navigation.
  Player profiles return explicitly to Survival rankings.
- VIP: store.html owns the package features, capacity comparison, kits and delivery.
  Detailed crate odds belong to the Survival guide, not a second rank catalogue.
- Help: join guide, support routes, rules, status, appeals and applications.
- Site: sitemap, privacy and terms. order.html needs the original purchase link.
- Thirteen legacy pages redirect to their exact new section. Use location.replace so
  browser Back never traps the user on a redirect. Query parameters are preserved.
  These files are compatibility endpoints, not entries in the public navigation.
- 18 indexed pages, plus the private-link order view and 404 recovery page.

site-map.js owns the section registry, guide topics and legacy route mapping.
site-shell.js renders a five-destination primary menu, contextual return links and a
small footer. sitemap.html and the navigation use the same page registry.
The header search uses a public, curated index from site-map.js, with Turkish/ASCII
normalization. It never indexes private order URLs or sends queries to a backend.
Long guide topics have subsection anchors that retain their owning topic on reload.
Connection tabs retain Java/Bedrock selection in the URL. Store section navigation
stays visible and follows the section being read. Help links to delivery guidance,
not an order page that requires a private session link.
Update sitemap.xml whenever a public page is added or removed.

## Components

network.css retains compatibility with existing tools; craft.css supplies the shared visual layer.
Use unframed bands and link rows for page sections. Cards are reserved for repeated items
such as purchase packages, reward pools and player records, and the live-status tool.
Use plain contextual metadata rather than decorative badges.
Keep typography at fixed responsive breakpoints; do not use viewport-scaled font sizes.
Menu state, tabs and form labels must remain keyboard-accessible.

## Verification

Check desktop, 390px mobile and 320px narrow layouts. Inspect every public page for horizontal
overflow, failed local assets and broken links/anchors. Verify breadcrumbs, mobile menus,
game context, package links, Java/Bedrock tabs and leaderboard category selection.
Test Survival -> economy -> another topic -> Survival without a document change.
Test topic refresh, deep links, popstate and all legacy routes. The map iframe loads
only when its view is selected; ordinary guide visits must not initialize the map.
API failures must display an honest unavailable state without demonstration players or prices.
Never submit live forms or create paid orders during visual checks.

Run the live-status regression checks with `node tests/ui-status.test.cjs`.
Run navigation regression checks with `node tests/navigation.test.cjs`.
Run search and connection checks with `node tests/search.test.cjs` and `node tests/join.test.cjs`.
