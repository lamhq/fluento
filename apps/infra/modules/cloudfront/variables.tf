variable "name" {
  description = "Prefix for resource names"
  type        = string
}

variable "domain" {
  description = "Custom domain name for the website"
  type        = string
}

variable "certificate_arn" {
  description = "ACM certificate ARN for the domain"
  type        = string
}

variable "s3_bucket_domain" {
  description = "S3 bucket regional domain name"
  type        = string
}

variable "s3_bucket_id" {
  description = "S3 bucket ID"
  type        = string
}

variable "s3_bucket_arn" {
  description = "S3 bucket ARN"
  type        = string
}

variable "s3_web_path" {
  description = "S3 path that stores web assets"
  type        = string
}

variable "s3_media_path" {
  description = "S3 path that stores public files"
  type        = string
}

variable "api_domain" {
  description = "API Gateway domain name (e.g., xxx.execute-api.region.amazonaws.com)"
  type        = string
}
