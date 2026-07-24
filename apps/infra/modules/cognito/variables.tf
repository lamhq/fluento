variable "name" {
  description = "Name of Cognito user pool"
  type        = string
}

variable "google_client_id" {
  type        = string
  description = "Google OAuth 2.0 Client ID"
}

variable "google_client_secret" {
  type        = string
  description = "Google OAuth 2.0 Client Secret"
  sensitive   = true
}

variable "pre_sign_up_fn_arn" {
  description = "ARN of the pre-signup Lambda function"
  type        = string
}

variable "pre_sign_up_fn_name" {
  description = "Name of the pre-signup Lambda function"
  type        = string
}

variable "callback_urls" {
  description = "List of allowed callback URLs for the user pool client"
  type        = list(string)
}

variable "logout_urls" {
  description = "List of allowed logout URLs for the user pool client"
  type        = list(string)
}
