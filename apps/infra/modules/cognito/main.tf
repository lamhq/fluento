terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0.0"
    }
  }
}

# ============================================================================
# Cognito User Pool
# ============================================================================

resource "aws_cognito_user_pool" "user_pool" {
  name = var.name

  admin_create_user_config {
    # disable user self registration
    allow_admin_create_user_only = true
  }

  lambda_config {
    pre_sign_up = var.pre_sign_up_fn_arn
  }
}

# ============================================================================
# Cognito Google Identity Provider
# ============================================================================

resource "aws_cognito_identity_provider" "google_provider" {
  user_pool_id  = aws_cognito_user_pool.user_pool.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id                     = var.google_client_id
    client_secret                 = var.google_client_secret
    authorize_scopes              = "openid email profile"
    attributes_url_add_attributes = true
    attributes_url                = "https://people.googleapis.com/v1/people/me?personFields="
    authorize_url                 = "https://accounts.google.com/o/oauth2/v2/auth"
    oidc_issuer                   = "https://accounts.google.com"
    token_url                     = "https://www.googleapis.com/oauth2/v4/token"
    token_request_method          = "POST"
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
  }
}

# ============================================================================
# Cognito User Pool Client
# ============================================================================

resource "aws_cognito_user_pool_client" "public_client" {
  name                         = "${var.name}-public-client"
  user_pool_id                 = aws_cognito_user_pool.user_pool.id
  supported_identity_providers = ["Google"]
  generate_secret              = false
  callback_urls                = var.callback_urls
  logout_urls                  = var.logout_urls

  allowed_oauth_flows_user_pool_client = true
  explicit_auth_flows                  = ["ALLOW_REFRESH_TOKEN_AUTH"]
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid", "profile"]

  depends_on = [aws_cognito_identity_provider.google_provider]
}

# ============================================================================
# Cognito User Pool Domain
# ============================================================================

resource "aws_cognito_user_pool_domain" "pool_domain" {
  domain       = var.name
  user_pool_id = aws_cognito_user_pool.user_pool.id
}

# ============================================================================
# Lambda Permission for Pre-Sign-Up Trigger
# ============================================================================

resource "aws_lambda_permission" "presignup_permission" {
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.pre_sign_up_fn_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.user_pool.arn
}
