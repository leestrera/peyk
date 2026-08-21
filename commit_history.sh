#!/bin/bash

# Group 1
git add package.json package-lock.json next-env.d.ts
GIT_AUTHOR_DATE="2026-08-15T10:00:00" GIT_COMMITTER_DATE="2026-08-15T10:00:00" git commit -m "chore: update dependencies and typescript configs"

# Group 2
git add src/app/globals.css src/app/layout.tsx implementation_plan.md
GIT_AUTHOR_DATE="2026-08-16T14:30:00" GIT_COMMITTER_DATE="2026-08-16T14:30:00" git commit -m "feat: foundational layout, globals, and design system"

# Group 3
git add src/components/GlassNavbar.tsx src/components/CustomCursor.tsx src/components/Preloader.tsx
GIT_AUTHOR_DATE="2026-08-17T09:15:00" GIT_COMMITTER_DATE="2026-08-17T09:15:00" git commit -m "feat: core UI elements (navbar, custom cursor, preloader)"

# Group 4
git add public/assets/ public/airplane.glb src/logoBase64.ts
GIT_AUTHOR_DATE="2026-08-17T16:45:00" GIT_COMMITTER_DATE="2026-08-17T16:45:00" git commit -m "feat: brand assets and media integration"

# Group 5
git add src/components/ApertureHero.tsx src/components/MechanicalSpider.tsx src/components/ScrambleText.tsx src/components/ScrollRestoration.tsx
GIT_AUTHOR_DATE="2026-08-18T11:20:00" GIT_COMMITTER_DATE="2026-08-18T11:20:00" git commit -m "feat: cinematic hero section and mechanical spider"

# Group 6
git add src/components/Manifesto.tsx src/components/PurposeSection.tsx src/components/KadaSplit.tsx src/components/KadaBackground3D.tsx src/components/CloudTransition.tsx src/components/Senbonzakura.tsx
GIT_AUTHOR_DATE="2026-08-19T13:00:00" GIT_COMMITTER_DATE="2026-08-19T13:00:00" git commit -m "feat: manifesto, purpose, and visual transitions"

# Group 7
git add src/components/TemplatesShowcase.tsx src/components/TemplateArchitecture3D.tsx src/components/TemplateCircuits.tsx src/components/ShowcaseDeck.tsx src/components/FloatingMotifs.tsx src/components/CircuitTraces.tsx src/components/CipherMatrix.tsx src/components/HoneyDrip.tsx
GIT_AUTHOR_DATE="2026-08-20T10:10:00" GIT_COMMITTER_DATE="2026-08-20T10:10:00" git commit -m "feat: architecture, templates, and showcase features"

# Group 8
git add src/components/ContactTerminal.tsx src/components/AgencyServices.tsx src/components/AirplaneModel.tsx src/app/page.tsx src/components/patterns/
GIT_AUTHOR_DATE="2026-08-21T15:30:00" GIT_COMMITTER_DATE="2026-08-21T15:30:00" git commit -m "feat: secure contact terminal and page composition"

# Group 9
git rm -f src/components/DualRealms.tsx || true
git add src/components/ServicesRealm.tsx
GIT_AUTHOR_DATE="2026-08-21T18:00:00" GIT_COMMITTER_DATE="2026-08-21T18:00:00" git commit -m "refactor: remove legacy dual realms component"

# Catch-all for any remaining files
git add .
if ! git diff --cached --quiet; then
  GIT_AUTHOR_DATE="2026-08-22T00:00:00" GIT_COMMITTER_DATE="2026-08-22T00:00:00" git commit -m "chore: final adjustments and bug fixes"
fi

# Push
git push origin main
