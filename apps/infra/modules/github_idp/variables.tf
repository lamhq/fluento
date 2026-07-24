variable "github_owner" {
  description = "GitHub repository owner"
  type        = string
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
}

variable "github_actions_role" {
  description = "Name of the IAM role for GitHub Actions to assume"
  type        = string
}

variable "github_actions_permissions" {
  description = "Permissions that allow IAM role to access AWS resources"
  type        = list(any)
}
