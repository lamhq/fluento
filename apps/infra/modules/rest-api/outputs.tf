output "api_id" {
  description = "API ID"
  value       = aws_api_gateway_rest_api.rest_api.id
}

output "invoke_url" {
  description = "API invoke URL"
  value       = aws_api_gateway_stage.stage.invoke_url
}
