variable "user_pool_id" {
  description = "ID of the Cognito user pool where the admin user will be created"
  type        = string
}

variable "admin_email" {
  description = "Email address for the initial user"
  type        = string
}
