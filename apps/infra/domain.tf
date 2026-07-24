module "domain" {
  source = "./modules/domain"

  domain             = var.domain
  cloudflare_zone_id = var.cloudflare_zone_id
  cloudfront_domain  = module.cloudfront.distribution_domain
}
