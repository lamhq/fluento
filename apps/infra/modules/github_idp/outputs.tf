output "ci_role_arn" {
  description = "ARN of the GitHub Actions IAM role"
  value       = aws_iam_role.ci_role.arn
}
