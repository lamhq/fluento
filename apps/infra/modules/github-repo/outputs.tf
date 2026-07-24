# ============================================================================
# GitHub Repository Module - Outputs
# ============================================================================

output "name" {
  description = "The name of the repository"
  value       = github_repository.repo.name
}

output "repo_id" {
  description = "GitHub ID for the repository"
  value       = github_repository.repo.repo_id
}

output "html_url" {
  description = "The URL of the repository"
  value       = github_repository.repo.html_url
}

output "ssh_clone_url" {
  description = "The SSH clone URL of the repository"
  value       = github_repository.repo.ssh_clone_url
}
