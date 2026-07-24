module "api_gateway" {
  source = "./modules/http-api"

  name                 = "${local.name_prefix}-api"
  oidc_issuer          = module.cognito.user_pool_endpoint
  oidc_client_id       = module.cognito.user_pool_client_id
  lambda_function_arn  = module.api_service.function_arn
  lambda_function_name = module.api_service.function_name
}
