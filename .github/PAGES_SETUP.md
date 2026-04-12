# GitHub Pages — one-time setup

The `.github/workflows/pages.yml` workflow handles builds and deploys
automatically. A human needs to flip one switch first.

## 1. Enable Pages with GitHub Actions as the source

1. Open the repo on GitHub.
2. Go to **Settings -> Pages**.
3. Under **Build and deployment -> Source**, select **GitHub Actions**.
   (No branch/folder selection is needed — the workflow provides the artifact.)

## 2. Trigger the first deploy

Either:

- Push any commit to `main`, **or**
- Go to **Actions -> Deploy docs to GitHub Pages -> Run workflow** and run it
  manually against `main`.

## 3. Expected URL

Once the `deploy` job is green, the site is live at:

```
https://<user-or-org>.github.io/<repo>/
```

The exact URL is printed in the `deploy` job summary (and on the
`github-pages` environment page under **Settings -> Environments**).

## Re-running a failed deploy

- Go to **Actions**, click the failed run, then **Re-run all jobs** (or
  **Re-run failed jobs**).
- For a fresh attempt, use **Run workflow** on the workflow page.
- Concurrency group is `pages` with `cancel-in-progress: false`, so an
  in-flight deploy will not be killed by a new push — the newer run will
  queue behind it.
