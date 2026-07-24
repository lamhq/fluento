output "environment" {
  description = "Runtime environment (e.g., dev, prod)"
  value       = local.env
}

output "api_url" {
  description = "API endpoint URL"
  value       = module.api_gateway.api_endpoint
}

output "database_connection_string" {
  description = "Database connection string for the application"
  value       = nonsensitive(module.mongodb_cluster.connection_string)
}
