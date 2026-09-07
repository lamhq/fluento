# Infrastructure

## Introduction

This repository contains Terraform code that defines the project's infrastructure.

It provisions AWS, Cloudflare, MongoDB Atlas, and GitHub resources required to deploy and operate the application environment.

## Prerequisites

- macOS or Linux (for development and deployment)
- Terraform v1.14.4 or later
- An AWS account with valid credentials configured locally
- A Cloudflare account and domain for DNS management
- A MongoDB Atlas account and API credentials
- GitHub access with the required tokens for Terraform and release automation

## Preparation

Set up the required external services before creating infrastructure:

### AWS

- Configure AWS credentials on your machine to deploy the infrastructure.
- Create a GitHub OIDC provider for GitHub Actions (see `modules/github_idp`).
- Create an S3 bucket to store the Terraform state. Fill in the bucket name in `apps/infra/config/s3.tfbackend`.

### GitHub

Create two GitHub personal access tokens:

- `RELEASE_ACTION_TOKEN`:
  - Purpose: enable [release-please-action](https://github.com/googleapis/release-please-action) to automatically create releases and pull requests for version bumps
  - Repository access: the current repository
  - Permissions: Contents (read and write), Pull requests (read and write), Metadata (read), Issues (read and write)
  - Create the `RELEASE_ACTION_TOKEN` GitHub repository secret with this token

- `GITHUB_TOKEN`:
  - Purpose: enable Terraform to create and manage GitHub resources (repositories, environments, secrets, etc.)
  - Repository access: all repositories
  - Permissions: Actions, Administration, Contents, Environments, Metadata, Secrets, Variables
  - Set the `GITHUB_TOKEN` environment variable with this token

Create a GitHub repository to host the source code (see `modules/github-repo/README.md`).

### Google Cloud

Purpose: enable Google login for the application.

1. Create a Google Cloud project
2. Create an OAuth 2.0 client ID with:
   - Type: `Web application`
   - Name: `<project>-<env>`
3. Copy the client ID and client secret
4. Fill them in `apps/infra/config/<env>.tfvars`

### Cloudflare

Purpose: use Cloudflare to manage DNS records for the domain.

1. Purchase a domain
2. Transfer the domain to Cloudflare registrar (optional)
3. Generate an [API token](https://dash.cloudflare.com/profile/api-tokens) with:
   - Permissions: `Zone: DNS: Edit`
   - Zone resources: `Include: Specific zone` and select your domain
4. Set the `CLOUDFLARE_API_TOKEN` environment variable with this token

### MongoDB Atlas

Purpose: the cloud service that hosts the application database.

1. Create a MongoDB Atlas account with Free plan
2. Create an API key by:
   - Going to MongoDB Atlas dashboard
   - Under "Security" → "Project Identity & Access" → "Applications" tab
   - Click "Create Application", then "API Key"
   - In "Project Permissions", select: Project Cluster Creator, Project Network Access Manager, Project Owner, Project Cluster Manager, Project Database Access Admin
3. Set `MONGODB_ATLAS_PUBLIC_KEY` and `MONGODB_ATLAS_PRIVATE_KEY` environment variables with the generated key pair

## Installation

Create a backend configuration file (if it does not already exist):

```bash
cd apps/infra
cp config/s3.tfbackend.example config/s3.tfbackend
```

Create an environment variable file for the runtime environment (`dev`, `prod`, etc.):

```bash
cp config/tfvars.example config/dev.tfvars
```

Initialize the Terraform backend (one time only):

```bash
terraform init -backend-config=config/s3.tfbackend
```

Set the required environment variables in your terminal:

```bash title="~/.zshrc"
export GITHUB_TOKEN="used by Terraform to create and manage GitHub resources"
export CLOUDFLARE_API_TOKEN="..."
export MONGODB_ATLAS_PUBLIC_KEY="..."
export MONGODB_ATLAS_PRIVATE_KEY="..."
```

:::note
All commands should be executed in the `apps/infra` directory.
:::

## Deploy

Select the workspace for the environment you want to deploy:

```bash
terraform workspace select -or-create <env>
```

Review the planned changes before applying them:

```bash
terraform plan -var-file=config/<env>.tfvars
```

Apply infrastructure changes (create or update):

```bash
terraform apply -var-file=config/<env>.tfvars -auto-approve
```

:::caution
Always review output of `terraform plan` before running `terraform apply` to avoid unintended consequences.
:::

## Post Environment Creation

After creating the environment (`terraform apply`), follow these steps to finish OIDC setup for Google login:

### Update OAuth Client

1. In **Google Auth Platform** → **Clients**, select a client from the list
2. Set **Authorized JavaScript origins** to `https://<cognito-domain>`
3. Set **Authorized redirect URIs** to `https://<cognito-domain>/oauth2/idpresponse`

:::note
`<cognito-domain>` is in the format `<project>-<env>.auth.<region>.amazoncognito.com`
:::

### Update GCP Branding

1. In **Google Auth Platform** → **Branding**
2. Add the Cognito domain to the **Authorized domains** list
3. Set **App name** to the project name
4. Set **App logo**, **App domain**, **User support email**, and **Developer contact information**

## Project Structure

```
infra/
├── main.tf                    # Backend config, providers, locals
├── variables.tf               # Input variables, values from `config/*.tfvars`
├── outputs.tf                 # Outputs for external use
├── api-gateway.tf             # API Gateway resources
├── api-service.tf             # Lambda function for API service
├── cdn.tf                     # CDN/CloudFront resources
├── storage.tf                 # S3 bucket
├── database.tf                # MongoDB Atlas cluster
├── domain.tf                  # Cloudflare domain and DNS records
├── identity-provider.tf       # Cognito user pool and identity provider
├── cicd.tf                    # GitHub resources and integration with AWS
├── pre-signup-trigger.tf      # Lambda function for Cognito pre-signup trigger
├── README.md                  # Explain the repository
├── config/                    # Input variables and backend configuration
│   ├── tfvars.example         # Template for variable definition file
│   ├── tfbackend.example      # Template for backend configuration file
│   ├── dev.tfvars             # Variables for dev environment
│   ├── prod.tfvars            # Variables for production environment
│   └── s3.tfbackend           # S3 backend configuration
├── assets/                    # Lambda function code and static assets
│   ├── api-handler.js         # Initial lambda handler for the API service
│   ├── pre-signup-trigger.mjs # Code for Cognito pre-signup trigger
│   └── index.html             # Initial HTML page for the web application
└── modules/                   # Reusable Terraform modules
    ├── cloudfront/            # CloudFront distribution module
    ├── cognito/               # Cognito user pool module
    ├── cognito-user/          # Cognito user module
    ├── domain/                # Domain & certificate module
    ├── github-env/            # GitHub environment module
    ├── github-repo/           # GitHub repository module
    ├── github_idp/            # GitHub OIDC identity provider module
    ├── http-api/              # HTTP API Gateway module
    ├── rest-api/              # REST API Gateway module (legacy)
    ├── lambda/                # Lambda function module
    ├── mongodb-cluster/       # MongoDB Atlas cluster module
    └── s3/                    # S3 bucket module
```

## Tech Stack

| Technology         | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| Terraform          | Infrastructure as Code for the whole platform     |
| AWS Lambda         | Runs the API handler and Cognito pre-sign-up hook |
| Amazon API Gateway | Exposes the backend HTTP API securely             |
| Amazon CloudFront  | CDN and edge delivery for the web app             |
| Amazon S3          | Hosts static web assets and application storage   |
| Amazon Cognito     | User authentication and OAuth/OIDC flows          |
| MongoDB Atlas      | Managed database for application data             |
| Cloudflare         | DNS and domain/certificate management             |
| GitHub             | Repository hosting, and CI/CD platform            |
| Google OAuth       | External identity provider for Cognito login      |
