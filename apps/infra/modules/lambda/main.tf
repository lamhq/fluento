terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 6.0.0"
    }
  }
}

resource "aws_iam_role" "execution_role" {
  name = "${var.name}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "function_logs" {
  name              = "/aws/lambda/${aws_lambda_function.function.function_name}"
  retention_in_days = 7
}

resource "aws_iam_role_policy" "execution_policy" {
  name = "${var.name}-policy"
  role = aws_iam_role.execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat(
      var.iam_policy_statements,
      [
        {
          Effect = "Allow"
          Action = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
          ]
          Resource = "${aws_cloudwatch_log_group.function_logs.arn}:*"
        }
      ]
    )
  })
}

resource "aws_lambda_function" "function" {
  function_name = var.name
  filename      = var.filename
  handler       = var.handler
  runtime       = "nodejs22.x"
  role          = aws_iam_role.execution_role.arn
  # source_code_hash intentionally omitted; code updates via CI/CD pipeline

  architectures = ["arm64"]
  memory_size   = var.memory
  timeout       = var.timeout

  layers = var.layers

  environment {
    variables = merge(
      {
        NODE_OPTIONS = "--enable-source-maps"
      },
      var.environment_variables
    )
  }
}
