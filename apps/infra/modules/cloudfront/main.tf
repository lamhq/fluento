terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0.0"
    }
  }
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "s3_oac" {
  name                              = "${var.name}-s3-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront function to rewrite SPA routes
resource "aws_cloudfront_function" "rewrite_function" {
  name    = "${var.name}-rewrite-spa-uri"
  runtime = "cloudfront-js-2.0"
  comment = "Rewrite any requests that do not include a file extension to `/index.html`"
  publish = true
  code    = <<EOF
function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (!uri.includes('.')) {
    request.uri = '/index.html';
  }

  return request;
}
EOF
}

# CloudFront function to remove API prefix
resource "aws_cloudfront_function" "remove_prefix_function" {
  name    = "${var.name}-remove-api-prefix"
  runtime = "cloudfront-js-2.0"
  comment = "Remove /api prefix from requests"
  publish = true
  code    = <<EOF
function handler(event) {
  var request = event.request;
  var uri = request.uri;
 
  // Check if the URI starts with 'api/'
  if (uri.startsWith('/api')) {
    // Remove /api
    request.uri = uri.replace(/^\/api/, '');
  }
 
  return request;
}
EOF
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "cdn_distribution" {
  comment             = var.name
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_200"
  aliases             = [var.domain]

  viewer_certificate {
    acm_certificate_arn      = var.certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
      locations        = []
    }
  }

  # S3 origin for serving web files
  origin {
    origin_id                = "${var.name}-web-origin"
    origin_path              = "/${var.s3_web_path}"
    domain_name              = var.s3_bucket_domain
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
  }

  # API Gateway origin (HTTP API)
  origin {
    origin_id   = "${var.name}-api-origin"
    domain_name = var.api_domain
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  # S3 origin for serving media files
  origin {
    origin_id                = "${var.name}-media-origin"
    domain_name              = var.s3_bucket_domain
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
  }

  # Default cache behavior for web files
  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "${var.name}-web-origin"
    compress               = true
    viewer_protocol_policy = "allow-all"
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite_function.arn
    }
  }

  # Cached behavior for API requests
  ordered_cache_behavior {
    path_pattern             = "/api/*"
    allowed_methods          = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods           = ["HEAD", "GET"]
    target_origin_id         = "${var.name}-api-origin"
    compress                 = true
    viewer_protocol_policy   = "https-only"
    cache_policy_id          = "4135ea2d-6df8-44a3-9df3-4b5a84be39ad" # CachingDisabled
    origin_request_policy_id = "b689b0a8-53d0-40ab-baf2-68738e2966ac" # AllViewerExceptHostHeader

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.remove_prefix_function.arn
    }
  }

  # Cached behavior for media files
  ordered_cache_behavior {
    path_pattern           = "/media/*"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["HEAD", "GET"]
    target_origin_id       = "${var.name}-media-origin"
    compress               = true
    viewer_protocol_policy = "https-only"
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6" # CachingOptimized
  }
}

# Upload sample index.html to S3
resource "aws_s3_object" "index_file" {
  bucket       = var.s3_bucket_id
  key          = "${var.s3_web_path}/index.html"
  source       = "assets/index.html"
  content_type = "text/html"

  lifecycle {
    ignore_changes = [source, tags_all]
  }
}

# S3 bucket policy to allow CloudFront access
resource "aws_s3_bucket_policy" "access_policy" {
  bucket = var.s3_bucket_id

  policy = jsonencode({
    Version = "2008-10-17",
    Id      = "PolicyForCloudFrontPrivateContent",
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal",
        Effect = "Allow",
        Principal = {
          Service = "cloudfront.amazonaws.com"
        },
        Action = "s3:GetObject",
        Resource = [
          "${var.s3_bucket_arn}/${var.s3_web_path}/*",
          "${var.s3_bucket_arn}/${var.s3_media_path}/*"
        ],
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.cdn_distribution.arn
          }
        }
      }
    ]
  })
}
