# GitHub Repository Module

## Introduction

Create a GitHub repository with branch protection, merge strategies, GitHub Actions secrets and variables.

Since repository creation is a one-time operation, this module is intended to be used only once to create the repository. After that, you can remove the module from your Terraform configuration and manage the repository manually or with other tools.

## How it works

This module creates the following GitHub resources:

- **`github_repository`** - Creates a GitHub repository with configured pull request settings:
  - Merge commits and rebase merges are disabled to maintain a clean commit history.
  - Allow squash merging with PR title as commit message
  - Always suggest updating pull request branches
  - Allow auto-merge
  - Automatically delete head branches after merge
  - Suggest updating PR when new changes in the base branch
- **`github_branch_default`** - Sets the default branch for the repository
- **`github_repository_ruleset`** - Creates a branch protection ruleset that enforces:
  - **Restrict deletions**: Prevents deletion of the default branch
  - **Linear History**: Requires a linear commit history (prevents merge commits)
  - **Pull Request Required**: All changes must go through a pull request
  - **Status Checks Required**:
    - `lint` - Code linting checks must pass
    - `unit-test` - Unit tests must pass
    - `build` - Build must succeed
  - **Require code scanning results**: Ensures code scanning results are required before merging
  - **Auto-merge Enabled**: Allows automatic merging when all status checks pass
- **`github_actions_secret`** (optional) - Creates repository secrets for GitHub Actions
- **`github_actions_variable`** (optional) - Creates repository variables for GitHub Actions

## Example Usage

How to create the repository for this project:

```hcl
module "github_repo" {
  source = "./modules/github-repo"

  name            = "notebook"
  description     = "Notebook repository"
  default_branch  = "main"
  private         = false

  secrets = [
    {
      name  = "RELEASE_ACTION_TOKEN"
      value = var.github_release_token
    }
  ]

  variables = [
  ]
}
```

## Command Line Alternative

### Repository Creation

```bash
# Create repo (if not already created)
gh repo create <OWNER>/<REPO> --private --description "My repo" --enable-issues --enable-wiki=false
```

### Repository Settings

Update merge settings:

```bash
gh repo edit <OWNER>/<REPO> \
  --allow-squash-merge=true \
  --allow-merge-commit=false \
  --allow-rebase-merge=false \
  --delete-branch-on-merge=true
```

Set default branch:

```bash
gh api -X PATCH repos/<OWNER>/<REPO> -f default_branch=main
```

### Branch Protection Rules

```bash
# Protect main branch
gh api -X PUT repos/<OWNER>/<REPO>/branches/main/protection \
  -f required_linear_history=true \
  -f enforce_admins=true \
  -F required_status_checks.strict=true \
  -F required_status_checks.contexts[]=lint \
  -F required_status_checks.contexts[]=unit-test \
  -F required_status_checks.contexts[]=build \
  -F required_pull_request_reviews.required_approving_review_count=0
```

👉 Note: Code scanning enforcement (like CodeQL) isn’t exposed directly in `gh` yet; you configure that via GitHub’s security settings or workflows.

### Repository Secrets

```bash
gh secret set MY_SECRET --repo <OWNER>/<REPO> --body "secret-value"
```

### Repository Variables

```bash
gh variable set MY_VAR --repo <OWNER>/<REPO> --body "variable-value"
```
