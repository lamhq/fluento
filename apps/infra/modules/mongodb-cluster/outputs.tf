output "connection_string" {
  description = "MongoDB connection string"
  value       = "mongodb+srv://${mongodbatlas_database_user.db_bdmin.username}:${random_password.db_password.result}@${replace(data.mongodbatlas_advanced_cluster.cluster.connection_strings.standard_srv, "mongodb+srv://", "")}/${var.db_name}"
}
