# vmcphub — built site

This branch contains only the static `pnpm build` output of the `main` branch.

To preview locally:

    git clone -b site git@github.com:Xinghan/vmcphub.git vmcphub-site
    cd vmcphub-site
    python3 -m http.server 3463
    # open http://localhost:3463

Do not edit files here directly. Source lives on `main`; this branch is
overwritten by every publish.
