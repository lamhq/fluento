terraform {
  required_providers {
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = ">= 2.10.0"
    }
  }
}

# Reference existing MongoDB Atlas cluster (read-only data source)
# This maps to an existing cluster without making any changes to it
data "mongodbatlas_advanced_cluster" "cluster" {
  project_id = var.project_id
  name       = "default"
}

# Auto-generate database password
resource "random_password" "db_password" {
  length  = 12
  special = false
}

# Database user for application with auto-generated password
resource "mongodbatlas_database_user" "db_bdmin" {
  project_id         = var.project_id
  username           = "${var.db_name}-admin"
  password           = random_password.db_password.result
  auth_database_name = "admin"

  roles {
    database_name = var.db_name
    role_name     = "readWrite"
  }

  scopes {
    name = "default"
    type = "CLUSTER"
  }
}
