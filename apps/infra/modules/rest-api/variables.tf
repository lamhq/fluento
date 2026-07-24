variable "name" {
  description = "API Gateway name"
  type        = string
}

variable "user_pool_arn" {
  description = "Cognito user pool ARN"
  type        = string
}

variable "lambda_invoke_arn" {
  description = "Lambda invoke ARN"
  type        = string
}

variable "lambda_function_name" {
  description = "Lambda function name"
  type        = string
}
