# ============================================================================
# Cognito User Pool Configuration
# ============================================================================

module "cognito" {
  source = "./modules/cognito"

  name                 = local.name_prefix
  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret
  pre_sign_up_fn_arn   = module.pre_signup.function_arn
  pre_sign_up_fn_name  = module.pre_signup.function_name
  callback_urls = [
    "http://localhost:5601/auth/signed-in",
    "https://${var.domain}/auth/signed-in"
  ]
  logout_urls = [
    "http://localhost:5601/auth/signed-out",
    "https://${var.domain}/auth/signed-out"
  ]
}

module "cognito_user" {
  source = "./modules/cognito-user"

  user_pool_id = module.cognito.user_pool_id
  admin_email  = var.admin_email
}
