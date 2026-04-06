---
description: Add a site-wide property test from a description of what should be true. Use when marshall notices something browsing the site that should hold across all pages (or a specific page), and wants to encode it as an automated check.
argument-hint: <what should be true, e.g. "every page should have a footer link to /tags/">
---

Add a new property test to `tests/site-properties.spec.js` based on: `$ARGUMENTS`

## Steps

1. Read `tests/site-properties.spec.js` to understand the current test structure and existing properties.

2. Determine what kind of assertion this is:
   - **Cross-page property** (most common): add a new `test()` block inside the existing `for (const path of urls)` loop. This runs the check against every themed page automatically.
   - **Single-page assertion**: if the expectation only applies to one page (e.g. "the home page should show all posts"), add it as a standalone test outside the loop targeting that specific URL.

3. Write the test using Playwright's `expect` API. Match the style of existing tests — concise, one assertion per test, descriptive test name. Use selectors that are specific enough to be meaningful but general enough to survive minor HTML changes.

4. Run the tests:
   ```
   npx playwright test tests/site-properties.spec.js
   ```

5. If tests fail:
   - If the failure reveals a **real bug** (the site doesn't match the expectation): tell marshall what's wrong and where to fix it. Don't fix the site code — this skill is about encoding the expectation, not implementing the fix.
   - If the failure is a **test issue** (wrong selector, bad assertion logic): fix the test and rerun.

6. Report what was added: the test name, what it checks, and how many pages it covers.
