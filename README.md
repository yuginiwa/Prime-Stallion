# Prime Stallion Company Profile

Next.js company profile for Prime Stallion Construction and Development Inc. Public routes cover BUILD, RENOVATE and DEVELOP, four case studies, and a Messenger inquiry handoff. No visitor data is collected by the site.

## Local development (Node.js 22)

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. Business contact links are in `src/content/site.ts`; case studies are in `src/content/projects.ts`. No phone number, email address, licensing claim, or custom domain has been inferred from placeholder content.

## Local portfolio review

The five candidate projects from the local Materials for Posting library can be reviewed at `/projects#project-review`. Start the dev server on loopback with `LOCAL_PROJECT_REVIEW=true npm run dev -- --hostname 127.0.0.1`. This requires the local thumbnails in `public/local-project-review/`, which is Git-ignored; do not copy that directory to any deployment. The review section is disabled on Vercel. Move only cleared photos and verified project facts into the public portfolio.

## Verify

```sh
npm run lint
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright starts its own local server; with `CI=1` it uses the production build. Treat axe as a baseline, not proof of complete accessibility.

## GitHub → Vercel

- Before uploading to the **public** GitHub repo, get owner approval for the project photos, logo use, case study copy and locations. Photos in `public/` are externally reachable if deployed, even on pages that do not link to them. Confirm Messenger is monitored and test the handoff on a phone. Never add originals, inquiry records, rates, or quote data to this repo.
- After approval, import `yuginiwa/Prime-Stallion` with the Next.js preset, repository root, Node.js 22 and `main` as the production branch. Use a Vercel plan that permits commercial use. Review an authorized Preview before going live.
- For the final Production environment, set `SITE_URL` to the confirmed HTTPS origin and set `SITE_INDEXABLE=true` only when ready to index. Do not set the latter for Preview. The default build applies `noindex`; this is not access protection. Use deployment protection if the preview needs to be private.
- Verify the production commit, redirects, HTTPS, portfolio images, Messenger link, and sitemap. After launch, record the last good deployment and restore it from the Vercel deployments view if needed.

The NFC card is a separate project. A future estimate/quotation workspace requires authentication and private data storage; it is not part of this repository today.
