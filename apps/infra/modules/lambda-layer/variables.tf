variable "layer_name" {
  type        = string
  description = "Name of the Lambda layer"
}

variable "description" {
  type        = string
  description = "Description of the Lambda layer"
  default     = ""
}

variable "zip_file" {
  type        = string
  description = "Path to the zip file containing the Lambda layer contents"
}

variable "compatible_runtimes" {
  type        = list(string)
  description = "List of compatible runtimes for the Lambda layer"
  default     = ["nodejs22.x"]
}
