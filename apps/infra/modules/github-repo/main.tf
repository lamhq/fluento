# ============================================================================
# GitHub Repository Module
# ============================================================================
# This module manages GitHub repository creation and configuration:
# - Repository with pull request settings
# - Default branch configuration
# - Repository branch protection ruleset
# - Repository secrets and variables

terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = ">= 6.11.0"
    }
  }
}

# ============================================================================
# GitHub Repository
# ============================================================================

resource "github_repository" "repo" {
  name        = var.name
  description = var.description != "" ? var.description : null
  visibility  = var.private ? "private" : "public"
  auto_init   = true

  # Pull request settings
  allow_merge_commit        = false
  allow_squash_merge        = true
  squash_merge_commit_title = "PR_TITLE"
  allow_rebase_merge        = false
  allow_auto_merge          = true
  delete_branch_on_merge    = true
  allow_update_branch       = true
}

# ============================================================================
# GitHub Default Branch
# ============================================================================

resource "github_branch_default" "default" {
  repository = github_repository.repo.name
  branch     = var.default_branch
}

# ============================================================================
# GitHub Repository Ruleset - Branch Protection
# ============================================================================

resource "github_repository_ruleset" "main" {
  name        = "Enforce branch protection"
  repository  = github_repository.repo.name
  target      = "branch"
  enforcement = "active"

  # Define which branches this ruleset applies to
  conditions {
    ref_name {
      include = ["refs/heads/${var.default_branch}"]
      exclude = []
    }
  }

  # Define the rules
  rules {
    # Prevent deletions of matching branches
    deletion = true

    # Require linear history (prevent merge commits)
    required_linear_history = true

    # Require pull request before merging
    pull_request {
      dismiss_stale_reviews_on_push     = false
      require_code_owner_review         = false
      require_last_push_approval        = false
      required_approving_review_count   = 0
      required_review_thread_resolution = false
    }

    # Require status checks to pass before merging
    required_status_checks {
      strict_required_status_checks_policy = true
      do_not_enforce_on_create             = true

      required_check {
        context = "lint"
      }

      required_check {
        context = "unit-test"
      }

      required_check {
        context = "build"
      }
    }

    # Require code scanning results
    required_code_scanning {
      required_code_scanning_tool {
        tool                      = "CodeQL"
        alerts_threshold          = "errors"
        security_alerts_threshold = "high_or_higher"
      }
    }
  }
}

# ============================================================================
# GitHub Repository Secrets
# ============================================================================

resource "github_actions_secret" "secret" {
  for_each = nonsensitive({
    for secret in var.secrets : secret.name => secret
  })

  repository      = github_repository.repo.name
  secret_name     = each.key
  plaintext_value = each.value.value
}

# ============================================================================
# GitHub Repository Variables
# ============================================================================

resource "github_actions_variable" "variable" {
  for_each = {
    for variable in var.variables : variable.name => variable
  }

  repository    = github_repository.repo.name
  variable_name = each.key
  value         = each.value.value
}
