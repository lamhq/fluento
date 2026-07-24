# ============================================================================
# Lambda Function contains the Backend API
# ============================================================================

data "archive_file" "api_service_code" {
  type        = "zip"
  source_file = "${path.module}/assets/api-handler.js"
  output_path = "${path.module}/assets/api-handler.zip"
}

module "api_service" {
  source = "./modules/lambda"

  name     = "${local.name_prefix}-api-handler"
  filename = data.archive_file.api_service_code.output_path
  handler  = "lambda.handler"
  memory   = 512
  timeout  = 15

  environment_variables = {
    DB_URI             = module.mongodb_cluster.connection_string
    AWS_S3_BUCKET      = module.app_storage.bucket_id
    AWS_CLOUDFRONT_URL = "https://${var.domain}"
    NO_COLOR           = "true"
  }

  iam_policy_statements = [
    # allow lambda to access s3 bucket for uploading/deleting reports
    {
      Effect = "Allow"
      Action = [
        "s3:PutObject",
        "s3:DeleteObject"
      ]
      Resource = "${module.app_storage.bucket_arn}/media/reports/*"
    }
  ]
}
