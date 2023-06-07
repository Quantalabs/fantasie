# Contributing guidelines

## First Steps

Before fixing any issues, first [fork](https://github.com/Quantalabs/fantasie/fork) the repo, and then clone your fork:

```bash
git clone https://github.com/[USERNAME]/fantasie.git
cd fantasie
```

Make sure you use yarn to install pacakges.

```bash
yarn install
yarn prepare # Sets up husky
```

Also run:

```bash
yarn lint:check
yarn format:check
```

before you commit. You won't be able to commit these changes if there are errors. Fix them first!

## Fixing Issues

Check out all [available issues](https://github.com/epispot/EpiJS/issues?q=is%3Aissue+is%3Aopen+label%3A%22Status%3A+Available%22). Reference the issues when you submit a PR.

## Adding features

If there's a feature request already submitted and avaliable on the [issues page](https://github.com/epispot/EpiJS/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement+label%3A%22status%3A+available%22), then work on it. If not, create one, and start working. Make sure you reference the issues in the PR.
