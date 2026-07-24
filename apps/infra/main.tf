terraform {
  # stores the state as a given key in a given bucket on Amazon S3
  # other arguments are defined in separate backend configuration files (e.g., `config/s3.tfbackend`) that are not included in version control
  # see https://developer.hashicorp.com/terraform/language/backend#partial-configuration
  backend "s3" {
    encrypt = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.21.0"
    }

    # provides a data source that can create archives from individual files or collections of files
    # useful for packaging code files to be deployed
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4.2"
    }

    # provide resources to generate random values
    # useful for creating unique resource identifiers
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6.0"
    }

    # GitHub provider for managing repository settings and CI/CD configurations
    github = {
      source  = "integrations/github"
      version = "~> 6.11.1"
    }

    # MongoDB Atlas provider for managing MongoDB clusters and database users
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "~> 2.10.0"
    }

    # Cloudflare provider for managing DNS records and domain configuration
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project = "${var.project}-${local.env}"
    }
  }
}

provider "mongodbatlas" {
  # Credentials are read from environment variables for security
}

provider "github" {
  owner = var.github_owner
  # Token is read from GITHUB_TOKEN environment variable
}

provider "cloudflare" {
  # API token is read from CLOUDFLARE_API_TOKEN environment variable
}

# User-defined values used in Terraform code
locals {
  env         = terraform.workspace
  name_prefix = "${var.project}-${local.env}"
}
