# ============================================================================
# S3 Bucket for API Artifacts and Web Application
# ============================================================================

module "app_storage" {
  source = "./modules/s3"

  name_prefix = local.name_prefix
}
