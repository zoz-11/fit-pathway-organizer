# Fit Pathway Organizer: Regression & Cross-Language QA Checklist

This checklist ensures core features work reliably across supported languages and platforms. Use it for pre-release regression, PR validation, and after dependency or configuration changes.

## Scope

- Platforms: Web (desktop + responsive mobile viewport)
- Browsers: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Locales/Languages: at minimum English + one RTL or non-Latin script (e.g., Arabic), plus any others supported by the app
- Environments: Production, Staging/Preview (Netlify/Vercel/GitHub Pages as applicable)

## Test Data Prereqs

- Seed user profile with/without avatar and banner
- Sample datasets/files for upload: PNG/JPG (banner), CSV/XLSX/JSON for pathway data (valid/invalid), >10MB large file, special characters in filename
- Credentials or mock auth; if SSO, test both fresh and returning sessions
- Feature flags documented and toggled as needed

---

## A. Cross-Language End-to-End Flows

Perform these suites in each supported language.

1. First-time user onboarding

- Open app → detect default language from browser
- Language selector visible and working
- Accept cookies/consent (if present) — text localized
- Empty state copy and CTAs localized, no truncation/overflow

2. Create and organize a pathway

- Create new pathway → add sections → add items/cards
- Drag-and-drop reorder works with keyboard and mouse
- Autosave or explicit save shows localized toasts
- Undo/redo (if available) works; icons mirrored in RTL

3. Share/Export

- Share link copied with localized confirmation
- Export (PDF/CSV/JSON) has localized filenames and headers
- Permissions (public/unlisted/private) labels localized

4. Session persistence

- Refresh page: state persists as expected
- Reopen app: last language selection persists

5. Error/empty states

- Network loss → retry banner localized
- Validation errors show correct localized messages

Accessibility in all languages

- Landmarks, headings, labels read by screen reader
- Focus order logical; no keyboard traps
- Contrast and min target sizes upheld

---

## B. Profile

- View and edit profile name, bio, and contact links
- Special characters and RTL input render correctly
- Client/server validation for max length and URL format
- Save confirmation toast; optimistic UI reconciles with server

## C. Banner & Avatar

- Upload, crop, and save avatar and banner images
- Supported formats: PNG/JPG/WebP; invalid format rejected with message
- Large images downscaled; aspect ratio preserved; no distortion
- Delete/replace works; cache busting updates UI immediately
- Banner responsive behavior: desktop, tablet, mobile
- Alt text and aria-labels present and localized

## D. Uploads & Imports

- Upload valid CSV/XLSX/JSON → data mapped to pathway
- Invalid schema triggers clear, localized error with line/field
- Progress indicator for large files; cancel resumes gracefully
- Duplicate detection and conflict resolution messaging
- Filenames with spaces, unicode, emoji handled
- Drag-drop and file picker both functional

## E. Navigation

- Header nav: Home, Pathways, Profile, Settings visible and focusable
- Breadcrumbs accurate; back/forward browser history works
- Deep-link routes load directly (no blank screens)
- 404/403 routes localized; provide recovery actions

## F. Settings & Language Switch

- Switch language → instant UI update without reload if designed; otherwise soft reload preserves route
- Persist preference to local storage/server
- Date/time/number formats localized; RTL layout flips correctly
- Reset to system default works

## G. UI/UX Quality

- No layout shifts (CLS) on load; skeletons where needed
- No clipped/truncated text at common breakpoints
- Buttons/links have visible focus states
- Tooltips, dialogs, and toasts localized and dismissible
- Loading/error/empty states consistent across pages
- Dark mode (if supported) correct in all states

## H. Security & Permissions

- Auth flows: login/logout, token refresh, 401/403 handling
- CSRF on mutating requests; CORS configured correctly
- File type/size validation client + server
- Do not expose PII in URLs or logs

## I. Performance Smoke

- First load under target (e.g., <3s on 4G) on key pages
- Lazy-load heavy bundles; images optimized
- No severe console errors; warnings triaged

---

## Test Execution Steps (per PR)

1. Build/preview link opens without errors
2. Run language suite in EN, then in secondary language (e.g., AR)
3. Execute flows A–I; note defects with screenshots, locale, browser, viewport
4. Verify no regressions against last release notes
5. Sanity on mobile viewport (iPhone 12/Android Pixel) in Chrome/Firefox
6. If backend changes, validate with seeded and edge-case data
7. Run automated e2e smoke locally or in CI and attach artifacts

Acceptance criteria

- All critical paths pass in both languages
- No Sev-1/2 defects open; known issues documented with workarounds

---

## Starter E2E Script Templates

### Cypress (cypress/e2e/regression.cy.ts)

```ts
describe("Fit Pathway Organizer - Regression Smoke", () => {
  const langs = ["en", "ar"]; // extend with supported locales

  langs.forEach((lang) => {
    context(`locale: ${lang}`, () => {
      beforeEach(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.visit(`/?lang=${lang}`);
      });

      it("loads home and switches language", () => {
        cy.findByRole("navigation").should("exist");
        cy.findByRole("button", { name: /language/i }).click();
        cy.findByRole("menuitem", { name: new RegExp(lang, "i") }).click();
        cy.url().should("include", `lang=${lang}`);
      });

      it("creates a pathway and saves", () => {
        cy.findByRole("button", { name: /new pathway/i }).click();
        cy.findByPlaceholderText(/untitled/i).type("Smoke Pathway");
        cy.findByRole("button", { name: /add section/i }).click();
        cy.findAllByRole("textbox").first().type("Section 1");
        cy.findByRole("button", { name: /save/i }).click();
        cy.findByText(/saved/i, { timeout: 10000 }).should("be.visible");
      });

      it("uploads a banner image", () => {
        cy.findByRole("link", { name: /profile/i }).click();
        cy.findByRole("button", { name: /change banner/i }).selectFile(
          "cypress/fixtures/banner.jpg",
          { force: true },
        );
        cy.findByRole("button", { name: /save/i }).click();
        cy.findByRole("img", { name: /banner/i }).should("be.visible");
      });
    });
  });
});
```

### Playwright (tests/regression.spec.ts)

```ts
import { test, expect } from "@playwright/test";

const langs = ["en", "ar"];

for (const lang of langs) {
  test.describe(`locale: ${lang}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
      await page.goto(`/?lang=${lang}`);
    });

    test("loads and switches language", async ({ page }) => {
      await expect(page.getByRole("navigation")).toBeVisible();
      await page.getByRole("button", { name: /language/i }).click();
      await page.getByRole("menuitem", { name: new RegExp(lang, "i") }).click();
      await expect(page).toHaveURL(new RegExp(`lang=${lang}`));
    });

    test("create pathway and save", async ({ page }) => {
      await page.getByRole("button", { name: /new pathway/i }).click();
      await page.getByPlaceholder(/untitled/i).fill("Smoke Pathway");
      await page.getByRole("button", { name: /add section/i }).click();
      await page.getByRole("button", { name: /save/i }).click();
      await expect(page.getByText(/saved/i)).toBeVisible({ timeout: 10000 });
    });

    test("upload banner", async ({ page }) => {
      await page.getByRole("link", { name: /profile/i }).click();
      await page
        .getByRole("button", { name: /change banner/i })
        .setInputFiles("tests/fixtures/banner.jpg");
      await page.getByRole("button", { name: /save/i }).click();
      await expect(page.getByRole("img", { name: /banner/i })).toBeVisible();
    });
  });
}
```

Notes

- Replace role/label text with actual app labels
- Add data-testid attributes where roles are ambiguous
- Wire into CI to run on PRs with artifacts and video
