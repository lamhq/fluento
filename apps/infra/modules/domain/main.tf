terraform {
  required_providers {
    cloudflare = {
      source = "cloudflare/cloudflare"
    }
  }
}

# ACM Certificate for domain
resource "aws_acm_certificate" "domain_cert" {
  domain_name       = var.domain
  validation_method = "DNS"
  region            = "us-east-1"

  lifecycle {
    create_before_destroy = true
  }
}

# Cloudflare CNAME record pointing domain to CloudFront
resource "cloudflare_dns_record" "domain" {
  zone_id = var.cloudflare_zone_id
  name    = var.domain
  type    = "CNAME"
  content = var.cloudfront_domain
  ttl     = 1 # automatic
  comment = "Point ${var.domain} to CloudFront distribution. Do not modify, it's managed by Terraform."
}

# Cloudflare CNAME record for SSL certificate validation
resource "cloudflare_dns_record" "acm_validation" {
  zone_id = var.cloudflare_zone_id
  type    = "CNAME"
  # Strip trailing dots to prevent unnecessary Terraform updates
  # since AWS returns values with trailing dots but Cloudflare automatically removes them
  name    = trimsuffix(one(aws_acm_certificate.domain_cert.domain_validation_options[*].resource_record_name), ".")
  content = trimsuffix(one(aws_acm_certificate.domain_cert.domain_validation_options[*].resource_record_value), ".")
  ttl     = 1 # automatic
  comment = "Validate the certificate for ${var.domain}. Do not modify, it's managed by Terraform."
}
