# Auth Service

## Introduction

The auth service is responsible for handling authentication and authorization for the application. It uses Keycloak as the identity provider and provides OAuth2 and OpenID Connect support.

This folder contains the Keycloak realm configuration for local development.

## Contents

- `app-realm.json` - Keycloak realm definition with users and clients

## How It Works

When the Keycloak container starts with the `--import-realm` flag, it automatically imports the realm configuration from this directory.

This sets up the following:

1. **Realm**: `app`
2. **Admin User**: `admin` / `admin`
3. **Test User**: `test` / `123`
4. **OAuth Client**: `web-client`

## Realm Configuration

### Client

The client is configured for local development with:

- **Client ID**: `web-client`
- **Client Secret**: `web-client-secret` (use for server-side auth flows)
- **Protocol**: OpenID Connect
- **Client Type**: Confidential (requires client secret)
- **Redirect URIs**: `http://localhost:5601/*` (Web server)
- **Web Origins**: `http://localhost:5601`
- **Flows**: Standard, Implicit, and Direct Access Grant flows enabled

### Test User

- **Username**: `test`
- **Password**: `123`

## Accessing Keycloak

- **Admin Console**: `http://localhost:8080/admin`
- **Realm**: `http://localhost:8080/realms/app`

## Modifying Configuration

To change the realm configuration, edit `app-realm.json` and restart the container:

```bash
docker-compose down -v
docker-compose up -d
```

The `-v` flag removes volumes to ensure a fresh import of the realm configuration.
