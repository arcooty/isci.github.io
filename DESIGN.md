# ArcaDe Craft Web Design

## Direction

Game imagery, a recognizable wordmark and calm editorial structure lead the site.
The home page has two primary game destinations and retains the floating live-status panel.
No decorative capsule badges, cursor glows, fabricated activity, or technical stack promotion.
Gold identifies the network; green and coral distinguish Survival and Rob's Village.
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
- Survival guides: wiki.html is the index; guides, map and rankings belong under Survival.
- Community: news, player profiles, staff and about.
- VIP: ranks explain rights, crates explain rewards, store handles purchase availability.
- Help: join guide, support routes, rules, status, appeals and applications.
- Site: sitemap, privacy and terms. order.html needs the original purchase link.
- features.html remains a legacy redirect. 404.html provides recovery routes.

site-shell.js owns the shared navigation and the section registry used by sitemap.html.
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
API failures must display an honest unavailable state without demonstration players or prices.
Never submit live forms or create paid orders during visual checks.

Run the live-status regression checks with `node tests/ui-status.test.cjs`.
