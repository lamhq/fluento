terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0.0"
    }
  }
}

# ============================================================================
# API Gateway Lambda Integration Module
# ============================================================================

# API Gateway REST API
resource "aws_api_gateway_rest_api" "rest_api" {
  name = var.name
  endpoint_configuration {
    types = ["EDGE"]
  }
}

# API Gateway deployment
resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id

  triggers = {
    redeployment = sha1(jsonencode({
      method_config = [
        aws_api_gateway_method.proxy_method.http_method,
        aws_api_gateway_method.proxy_method.authorization,
        aws_api_gateway_method.proxy_method.authorizer_id,
      ]
      integration_config = [
        aws_api_gateway_integration.lambda_integration.type,
        aws_api_gateway_integration.lambda_integration.uri,
      ]
      authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id,
    }))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# API Gateway stage
resource "aws_api_gateway_stage" "stage" {
  deployment_id = aws_api_gateway_deployment.deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = "v1"
}

# API Gateway resource for proxy
resource "aws_api_gateway_resource" "proxy_resource" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
  path_part   = "{proxy+}"
}

# API Gateway Cognito authorizer
resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name            = "${var.name}-authorizer"
  type            = "COGNITO_USER_POOLS"
  rest_api_id     = aws_api_gateway_rest_api.rest_api.id
  provider_arns   = [var.user_pool_arn]
  identity_source = "method.request.header.Authorization"
}

# API Gateway method
resource "aws_api_gateway_method" "proxy_method" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
  resource_id = aws_api_gateway_resource.proxy_resource.id
  http_method = "ANY"
  # authorization = "NONE"
  authorization = "COGNITO_USER_POOLS"
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

# API Gateway Lambda integration
resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.rest_api.id
  resource_id             = aws_api_gateway_resource.proxy_resource.id
  http_method             = aws_api_gateway_method.proxy_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = var.lambda_invoke_arn
}

# Lambda permission to allow API Gateway to invoke function
resource "aws_lambda_permission" "invoke_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.rest_api.execution_arn}/*/*"
}
