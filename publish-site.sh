#!/usr/bin/env bash
# Build the site and force-push the result to the `site` branch.
# Source stays on `main`; nothing else changes here.
set -euo pipefail

cd "$(dirname "$0")"

echo "→ Building…"
pnpm build

TMPDIR=$(mktemp -d)
trap 'git worktree remove "$TMPDIR" --force >/dev/null 2>&1 || true; git branch -D site-publish >/dev/null 2>&1 || true' EXIT

echo "→ Staging build output on a fresh orphan branch…"
git worktree add --orphan -b site-publish "$TMPDIR"
rsync -a --delete build/ "$TMPDIR/"

cat > "$TMPDIR/README.md" <<'EOF'
# vmcphub — built site

This branch contains only the static `pnpm build` output of the `main` branch.

To preview locally:

    git clone -b site git@github.com:Xinghan/vmcphub.git vmcphub-site
    cd vmcphub-site
    python3 -m http.server 3463
    # open http://localhost:3463

Do not edit files here directly. Source lives on `main`; this branch is
overwritten by every publish.
EOF

cd "$TMPDIR"
git add -A
git commit -m "build: static site snapshot $(date -u +%Y-%m-%dT%H:%M:%SZ)" >/dev/null
git push --force origin site-publish:site
echo "→ Published to origin/site."
