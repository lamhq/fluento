# ============================================================================
# GitHub CI/CD Configuration Module
# ============================================================================
# This module manages GitHub Actions CI/CD configuration:
# - GitHub Actions environment
# - GitHub Actions environment variables

# GitHub provider configuration
terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = ">= 6.11.0"
    }
  }
}

# ============================================================================
# GitHub Actions Environment & Variables
# ============================================================================

resource "github_repository_environment" "runtime_env" {
  environment = var.environment
  repository  = var.repository

  dynamic "deployment_branch_policy" {
    for_each = length(var.deployment_policies) > 0 ? [1] : []
    content {
      protected_branches     = false
      custom_branch_policies = true
    }
  }
}

resource "github_actions_environment_variable" "env_vars" {
  for_each = var.variables

  repository    = var.repository
  environment   = github_repository_environment.runtime_env.environment
  variable_name = each.key
  value         = each.value
}

# ============================================================================
# Deployment Policies
# ============================================================================

resource "github_repository_environment_deployment_policy" "patterns" {
  for_each = {
    for idx, pattern in var.deployment_policies : idx => pattern
  }

  repository     = var.repository
  environment    = github_repository_environment.runtime_env.environment
  branch_pattern = each.value.type == "branch" ? each.value.pattern : null
  tag_pattern    = each.value.type == "tag" ? each.value.pattern : null
}
