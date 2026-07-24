# ============================================================================
# Common
# ============================================================================

variable "aws_region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Project name"
  type        = string
}

variable "admin_email" {
  type        = string
  description = "Email address for the initial user"
}

# ============================================================================
# Web Application
# ============================================================================

variable "domain" {
  type        = string
  description = "Custom domain for the website"
}

# ============================================================================
# Google Authentication
# ============================================================================

variable "google_client_id" {
  type        = string
  description = "Google OAuth 2.0 Client ID"
}

variable "google_client_secret" {
  type        = string
  description = "Google OAuth 2.0 Client Secret"
}

# ============================================================================
# CI/CD
# ============================================================================

variable "github_owner" {
  type        = string
  description = "GitHub repository owner/organization"
}

variable "github_repo" {
  description = "GitHub repository name (without owner)"
  type        = string
}

# ============================================================================
# Cloudflare
# ============================================================================

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare zone ID for the domain"
}

# ============================================================================
# MongoDB Atlas
# ============================================================================

variable "mongodb_atlas_project_id" {
  type        = string
  description = "MongoDB Atlas project ID"
}


