output "user_pool_arn" {
  description = "Cognito User Pool ARN"
  value       = aws_cognito_user_pool.user_pool.arn
}

output "user_pool_endpoint" {
  description = "Cognito User Pool Endpoint"
  value       = "https://${aws_cognito_user_pool.user_pool.endpoint}"
}

output "user_pool_client_id" {
  description = "Cognito User Pool Client ID"
  value       = aws_cognito_user_pool_client.web_client.id
}

output "user_pool_id" {
  description = "Cognito User Pool ID"
  value       = aws_cognito_user_pool.user_pool.id
}
