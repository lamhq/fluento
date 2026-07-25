terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0.0"
    }
  }
}

# ============================================================================
# GitHub OIDC Provider and Deployment Role
# ============================================================================
# This module sets up AWS infrastructure for GitHub Actions deployments:
# - IAM role for GitHub Actions to assume
# - IAM policy with deployment permissions

# ============================================================================
# OIDC Provider for GitHub Actions
# ============================================================================

# This is an AWS account-level resource that's reusable across projects.
# to create it, define the below resource block:
# resource "aws_iam_openid_connect_provider" "github_oidc_provider" {
#   url            = "https://token.actions.githubusercontent.com"
#   client_id_list = ["sts.amazonaws.com"]
#   thumbprint_list = [
#     "6938fd4d98bab03faadb97b34396831e3780aea1",
#     "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
#   ]
# }

data "aws_iam_openid_connect_provider" "github_oidc_provider" {
  url = "https://token.actions.githubusercontent.com"
}

# ============================================================================
# IAM Role for CI/CD Deployments
# ============================================================================

resource "aws_iam_role" "ci_role" {
  name = var.github_actions_role

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Principal = {
          Federated = data.aws_iam_openid_connect_provider.github_oidc_provider.arn
        },
        Action = "sts:AssumeRoleWithWebIdentity",
        Condition = {
          StringEquals = {
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com",
          },
          StringLike = {
            "token.actions.githubusercontent.com:sub" = [
              "repo:${var.github_owner}/${var.github_repo}:ref:refs/heads/*",
              "repo:${var.github_owner}/${var.github_repo}:pull_request"
            ]
          }
        }
      }
    ]
  })
}

# ============================================================================
# IAM Policy for CI/CD Deployments
# ============================================================================

resource "aws_iam_role_policy" "ci_policy" {
  name = "${var.github_actions_role}-policy"
  role = aws_iam_role.ci_role.id

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = var.github_actions_permissions
  })
}
