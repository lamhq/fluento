# ============================================================================
# GitHub OIDC Provider and Deployment Role
# ============================================================================

module "github_oidc" {
  source = "./modules/github_idp"

  github_owner = var.github_owner
  github_repo  = var.github_repo

  github_actions_role = "${local.name_prefix}-ci-role"
  github_actions_permissions = [
    # S3 artifact management
    {
      Effect = "Allow"
      Action = [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ]
      Resource = [
        module.app_storage.bucket_arn,
        "${module.app_storage.bucket_arn}/*"
      ]
    },
    # CloudFront invalidation
    {
      Effect   = "Allow"
      Action   = ["cloudfront:CreateInvalidation"]
      Resource = [module.cloudfront.distribution_arn]
    },
    # Lambda function code updates
    {
      Effect = "Allow"
      Action = [
        "lambda:UpdateFunctionCode",
        "lambda:GetFunction",
        "lambda:GetFunctionConfiguration"
      ]
      Resource = ["${join(":", slice(split(":", module.api_service.function_arn), 0, 6))}:${local.name_prefix}-*"]
    }
  ]
}

# ============================================================================
# GitHub CI/CD Configuration
# ============================================================================

locals {
  # .env file content for building the web app
  web_env_vars = "VITE_OIDC_AUTHORITY=${module.cognito.user_pool_endpoint}\nVITE_OIDC_CLIENT_ID=${module.cognito.user_pool_client_id}"

  # Deployment patterns for environment restrictions
  deployment_policies = local.env == "prod" ? [
    {
      pattern = "main"
      type    = "branch"
    },
    {
      pattern = "api-v*"
      type    = "tag"
    },
    {
      pattern = "web-v*"
      type    = "tag"
    }
  ] : []
}

module "github_env" {
  source = "./modules/github-env"

  repository          = var.github_repo
  environment         = local.env
  deployment_policies = local.deployment_policies

  variables = {
    AWS_REGION          = var.aws_region
    DEPLOYMENT_ROLE_ARN = module.github_oidc.ci_role_arn
    API_HANDLER_LAMBDA  = module.api_service.function_name
    APP_BUCKET          = module.app_storage.bucket_name
    CF_DIST_ID          = module.cloudfront.distribution_id
    WEB_ENV_VARS        = local.web_env_vars
  }
}


