resource "null_resource" "build_api_layer" {
  provisioner "local-exec" {
    command = "bash ${path.module}/assets/build-api-layer.sh"
  }

  # Re-run if script changes
  triggers = {
    script_sha = sha1(file("${path.module}/assets/build-api-layer.sh"))
  }
}

module "api_layer" {
  source              = "./modules/lambda-layer"
  layer_name          = "${local.name_prefix}-api-layer"
  description         = "Dependencies for API service"
  zip_file            = "${path.module}/assets/api-layer.zip"
  compatible_runtimes = ["nodejs22.x"]

  depends_on = [null_resource.build_api_layer]
}
