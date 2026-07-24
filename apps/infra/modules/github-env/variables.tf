variable "repository" {
  description = "GitHub repository name"
  type        = string
}

variable "environment" {
  description = "GitHub Actions environment name (e.g., 'dev', 'staging', 'prod')"
  type        = string
}

variable "variables" {
  description = "GitHub Actions environment variables"
  type        = map(string)
}

variable "deployment_policies" {
  description = "Deployment branch and tag patterns for environment restrictions"
  type = list(object({
    pattern = string
    type    = string # "branch" or "tag"
  }))
  default = []
}
