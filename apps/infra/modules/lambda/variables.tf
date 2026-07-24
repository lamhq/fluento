variable "name" {
  description = "Lambda function name"
  type        = string
}

variable "filename" {
  description = "Path to the function's deployment package within the local filesystem"
  type        = string
}

variable "handler" {
  description = "Function entry point in your code (e.g., index.handler)"
  type        = string
}

variable "environment_variables" {
  description = "Environment variables for the Lambda function"
  type        = map(string)
  default     = {}
}

variable "iam_policy_statements" {
  description = "List of IAM policy statements for the Lambda execution role"
  type = list(object({
    Effect   = string
    Action   = list(string)
    Resource = string
  }))
}

variable "layers" {
  description = "List of Lambda layer ARNs to attach to the function"
  type        = list(string)
  default     = []
}

variable "memory" {
  description = "Amount of memory available to the Lambda function (in MB)"
  type        = number
  default     = 256
}

variable "timeout" {
  description = "The amount of time that Lambda allows a function to run before stopping it (in seconds)"
  type        = number
  default     = 10
}
