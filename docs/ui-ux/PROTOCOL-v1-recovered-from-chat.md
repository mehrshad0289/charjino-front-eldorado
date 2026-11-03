# PROTOCOL v1 — Recovered from shared chat

Source: https://chat.z.ai/s/cdf45798-773e-41af-a404-793d8578e71e
Recovered: 2026-11-03, via chat.z.ai share API (`/api/v1/chats/share/<id>`).

The shared chat contains exactly two messages:

1. User message (below, verbatim, 7581 chars) — the original incremental
   development protocol.
2. Assistant message — **empty (0 chars)**. No code, files, or progress was
   produced inside that chat session. There is nothing else to recover from it.

---

# MANDATORY INCREMENTAL DEVELOPMENT AND VISUAL MATCHING PROTOCOL

## 1. LIVE REFERENCE AND DEPLOYMENT

Original Eldorado website:

https://www.eldorado.gg/

Charjino Vercel deployment:

https://charjino-front-eldorado.vercel.app/

GitHub repository:

git@github.com:mehrshad0289/charjino-front-eldorado.git

Primary design reference:

ui ux/www_eldorado_gg_1920w_390w_1536w_default_light_dark_home.make

The original Eldorado website is the visual reference.

The Charjino Vercel deployment is the implementation being validated.

The GitHub repository is the source of truth for code and progress.

You MUST compare the original Eldorado website against the Charjino implementation throughout development.

Do not use the existing Charjino design as the reference for future changes.

---

## 2. DEVELOP ONE SMALL SECTION AT A TIME

Do NOT wait until the entire Home Page is completed before committing or pushing.

The Home Page must be developed incrementally, section by section, component by component.

Each meaningful section is an independent development unit.

For example:

1. Design tokens.
2. Typography.
3. Buttons.
4. Inputs.
5. Header.
6. Navigation.
7. Hero section.
8. Search component.
9. Category section.
10. Product card.
11. Product grid.
12. Remaining Home Page sections.
13. Responsive refinements.
14. Interaction refinements.

The exact order must be determined by inspecting the actual reference.

Do not assume that the examples above represent the complete page.

### Required workflow for EVERY section

STEP 1: Inspect the relevant section in the original Eldorado website.

STEP 2: Inspect the corresponding section in the supplied reference file.

STEP 3: Inspect the current Charjino implementation.

STEP 4: Identify the exact visual differences.

STEP 5: Implement ONLY the current section and its required dependencies.

STEP 6: Run the relevant technical checks.

STEP 7: Open the original Eldorado website and the Charjino implementation at matching viewport dimensions.

STEP 8: Compare their rendered appearance.

STEP 9: Fix the visual differences.

STEP 10: Repeat the comparison until the section meets the acceptance criteria.

STEP 11: Update the persistent progress document.

STEP 12: Create a descriptive Git commit.

STEP 13: Push the commit to GitHub.

STEP 14: Verify that the push succeeded.

STEP 15: Proceed to the next section.

Do not skip these steps.

Do not implement multiple unrelated sections before validating the current one.

---

## 3. VISUAL MATCHING IS THE ACCEPTANCE CRITERION

The current section is not complete merely because:

- The code compiles.
- The component renders.
- The page looks modern.
- The layout is approximately similar.
- The developer believes it is correct.

The section is complete only after comparing the actual rendered result against the original Eldorado reference.

The comparison must include:

- Dimensions.
- Positioning.
- Spacing.
- Typography.
- Colors.
- Images.
- Borders.
- Shadows.
- Responsive behavior.
- Interactive states.
- Animations, when applicable.

If a visual difference exists, fix it before marking the section as verified.

If exact matching is blocked by missing assets, inaccessible reference behavior, or unavailable browser tooling, document the limitation explicitly.

Never falsely report a successful comparison.

---

## 4. COMMIT AND PUSH AFTER EACH VERIFIED SECTION

Every completed and verified section must be committed and pushed before proceeding to the next section.

Example:

feat(ui): implement Eldorado header

fix(ui): align header dimensions with Eldorado

feat(ui): implement Eldorado hero section

fix(ui): match hero spacing and typography

feat(ui): implement reusable Eldorado search component

fix(ui): refine search input interaction states

Do not create a single massive commit containing the entire Home Page.

Do not postpone Git operations until the entire page is completed.

The Git history must clearly demonstrate incremental development.

Each commit must represent a meaningful and verified unit of work.

Before committing:

- Inspect Git status.
- Review the diff.
- Ensure unrelated changes are excluded.
- Run the appropriate checks.
- Update the progress document.

After pushing:

- Verify the remote branch.
- Verify the pushed commit.
- Record the commit hash.
- Record the completed section.
- Record the next section.

If the push fails, do not claim success.

---

## 5. VERCEL DEPLOYMENT VERIFICATION

After pushing a meaningful section, check the Charjino Vercel deployment:

https://charjino-front-eldorado.vercel.app/

Verify:

- The deployment corresponds to the pushed commit.
- The page loads successfully.
- The implemented section renders correctly.
- No obvious visual regressions occurred.
- The relevant responsive viewport works.

Do not assume that a successful Git push automatically means that the Vercel deployment succeeded.

If Vercel has not deployed the commit yet, record the deployment as pending.

If the deployment fails, investigate the failure before proceeding when it affects the current implementation.

The production preview must be treated as a verification target, not merely a URL included in documentation.

---

## 6. DISCONNECTION RECOVERY

The AI may disconnect during development.

The next session MUST recover from the latest verified checkpoint.

Read:

docs/ui-ux/ELDORADO-HOME-IMPLEMENTATION.md

Then inspect:

- Git branch.
- Git status.
- Latest commit.
- Latest pushed commit.
- Current implementation.
- Reference file.
- Latest Vercel deployment, when accessible.

Determine:

1. Which sections are genuinely complete?
2. Which sections have been visually verified?
3. Which sections have been committed?
4. Which commits have been pushed?
5. Which deployment corresponds to the latest commit?
6. What is the next incomplete section?

Continue from the first incomplete section.

Do not start the Home Page from scratch after every disconnection.

Do not trust previous AI claims without checking the actual repository.

Do not repeat completed work unnecessarily.

Do not skip unfinished visual corrections.

---

## 7. PERSISTENT CHECKPOINT FORMAT

After every verified section, update:

docs/ui-ux/ELDORADO-HOME-IMPLEMENTATION.md

Use this format:

### Current Checkpoint

- Current page: Home
- Current section:
- Reference file:
- Implementation status:
- Visual comparison status:
- Viewports verified:
- Technical checks:
- Files modified:
- Git branch:
- Commit hash:
- Push status:
- Vercel deployment status:
- Known visual differences:
- Remaining work:
- Next exact action:

The next session must be able to continue using this document without requiring the user to explain the project again.

---

## 8. IMMEDIATE EXECUTION

Begin by inspecting the repository and the exact Home Page reference file.

Inspect the current Charjino implementation and compare it against Eldorado.

Do not assume that previously implemented sections are correct.

Identify the first section that requires implementation or correction.

Implement that section.

Visually compare it against the original Eldorado website.

Correct the differences.

Run the relevant checks.

Update the persistent checkpoint.

Commit and push the verified section.

Then immediately proceed to the next incomplete section.

The Home Page does NOT need to be completed in one session.

The objective is to develop the page incrementally, with every section independently verified, committed, and pushed.

Do not stop after writing a plan.

Start working on the actual implementation.
