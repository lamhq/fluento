# ============================================================================
# Cognito Pre-Sign-Up Trigger Lambda
# ============================================================================

data "archive_file" "pre_signup_archive" {
  type        = "zip"
  source_file = "${path.module}/assets/pre-signup-trigger.mjs"
  output_path = "${path.module}/assets/pre-signup-trigger.zip"
}

module "pre_signup" {
  source = "./modules/lambda"

  name     = "${local.name_prefix}-pre-signup-trigger"
  filename = data.archive_file.pre_signup_archive.output_path
  handler  = "pre-signup-trigger.handler"

  environment_variables = {} # Only NODE_OPTIONS (auto-added in module)
  iam_policy_statements = [
    {
      Effect = "Allow"
      Action = [
        "cognito-idp:AdminGetUser",
        "cognito-idp:AdminLinkProviderForUser"
      ]
      Resource = module.cognito.user_pool_arn
    }
  ]
}
