resource "aws_lambda_layer_version" "this" {
  layer_name          = var.layer_name
  description         = var.description
  compatible_runtimes = var.compatible_runtimes
  filename            = var.zip_file
}
