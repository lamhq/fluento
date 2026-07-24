# ============================================================================
# GitHub Repository Module - Variables
# ============================================================================

variable "name" {
  description = "The name of the repository"
  type        = string
}

variable "description" {
  description = "A description of the repository"
  type        = string
  default     = ""
}

variable "default_branch" {
  description = "The name of the default branch"
  type        = string
  default     = "main"
}

variable "private" {
  description = "Set to true to create a private repository"
  type        = bool
  default     = false
}

variable "secrets" {
  description = "A list of secrets to be created in the repository"
  type = list(object({
    name  = string
    value = string
  }))
  default   = []
  sensitive = true
}

variable "variables" {
  description = "A list of GitHub Actions variables to be created in the repository"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}
