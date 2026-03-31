# feedback review app

a proper interactive web app for reviewing and editing content - not a generated one-off HTML file, but a reusable tool.

## what it is

take the `feedback.html` workflow and make it a real app. open any draft, get the section-by-section review layout, enter feedback, apply edits - all in one place without the copy-paste-to-claude-code step.

## the current workflow (what it replaces)

1. run `bundle exec ruby _scripts/generate-feedback-html <file>`
2. open feedback.html in browser
3. fill in section feedback
4. hit "copy all feedback as markdown"
5. paste into claude code
6. claude applies changes

steps 4-6 are friction. the app collapses them.

## what the app does differently

- reads draft files directly (local file access or a small server)
- shows post on left, feedback panels on right (same visual language)
- apply button talks directly to claude api or applies edits in-place
- no copy-paste intermediate step

## the inline annotation idea (v2 enhancement)

when reading the post section, highlight any text - it auto-populates the feedback textarea with:

```
instead: "<selected text>" -> do: "<selected text>"
```

so you can just type the replacement inline without manually copying and reformatting. the "instead X -> do Y" pattern becomes one gesture instead of three.

## stack thoughts (undecided)

- could be a simple local ruby/sinatra server (already in the bundle)
- could be a standalone electron-like thing
- could be a claude desktop app with file access via mcp
- simplest: a local server that reads `_drafts/` and `_posts/`, serves the review ui, and has a "save changes" endpoint

## why this is different from the site

this is a personal writing tool, not published content. lives outside the jekyll pipeline. more like a dev tool for the blog than part of the blog itself.
