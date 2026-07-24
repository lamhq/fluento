variable "name" {
  description = "API Gateway name"
  type        = string
}

variable "oidc_client_id" {
  description = "OIDC Client ID"
  type        = string
}

variable "oidc_issuer" {
  description = "OIDC issuer (format: https://{user-pool-domain}.auth.{region}.amazoncognito.com)"
  type        = string
}

variable "lambda_function_arn" {
  description = "Lambda function ARN"
  type        = string
}

variable "lambda_function_name" {
  description = "Lambda function name"
  type        = string
}
