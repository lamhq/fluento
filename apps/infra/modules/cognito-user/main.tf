terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.0.0"
    }
  }
}

resource "random_password" "admin_temporary_password" {
  length      = 16
  lower       = true
  upper       = true
  numeric     = true
  special     = true
  min_lower   = 3
  min_upper   = 3
  min_numeric = 3
  min_special = 1
}

resource "aws_cognito_user" "admin_user" {
  user_pool_id             = var.user_pool_id
  username                 = var.admin_email
  temporary_password       = random_password.admin_temporary_password.result
  desired_delivery_mediums = ["EMAIL"]

  attributes = {
    email = var.admin_email
  }

  # Ignore changes to attributes that are managed by AWS
  lifecycle {
    ignore_changes = [attributes]
  }
}
