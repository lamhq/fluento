terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0.0"
    }
  }
}

# ============================================================================
# HTTP API Gateway Module
# ============================================================================

# HTTP API
resource "aws_apigatewayv2_api" "http_api" {
  name          = var.name
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    allow_headers     = ["*"]
    expose_headers    = ["*"]
    max_age           = 300
    allow_credentials = false
  }
}

# Authorization for HTTP API using JWT from Cognito
resource "aws_apigatewayv2_authorizer" "jwt_authorizer" {
  api_id           = aws_apigatewayv2_api.http_api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "${var.name}-jwt-authorizer"
  jwt_configuration {
    audience = [var.oidc_client_id]
    issuer   = var.oidc_issuer
  }
}

# Default authorization scope (for all routes)
# In most cases, the authorizer will validate the JWT and attach it to the request context

# HTTP API Integration with Lambda
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"
  integration_uri        = var.lambda_function_arn

  request_parameters = {
    "overwrite:header.x-user-id" = "$context.authorizer.claims.sub"
    "overwrite:header.x-user-email"   = "$context.authorizer.claims.email"
  }
}

# Default routes (catch-all for all HTTP methods and paths)
resource "aws_apigatewayv2_route" "default_route" {
  api_id             = aws_apigatewayv2_api.http_api.id
  route_key          = "$default"
  target             = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.jwt_authorizer.id
}

# Default Stage (HTTP API uses 'default' stage by default)
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

# Lambda permission for API Gateway to invoke the function
resource "aws_lambda_permission" "http_invoke_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}
