module "cloudfront" {
  source = "./modules/cloudfront"

  name             = local.name_prefix
  domain           = var.domain
  certificate_arn  = module.domain.certificate_arn
  s3_bucket_domain = module.app_storage.bucket_domain
  s3_bucket_id     = module.app_storage.bucket_id
  s3_bucket_arn    = module.app_storage.bucket_arn
  s3_web_path      = "web"
  s3_media_path    = "media"
  api_domain       = replace(module.api_gateway.api_endpoint, "/^https?://([^/]*).*/", "$1")
}
