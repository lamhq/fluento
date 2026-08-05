# Database

## Introduction

This folder contains database helper files for the project. It is used to initialize the local MongoDB replica set for development and testing.

## Installation

Start the MongoDB container using Docker Compose:

```bash
docker-compose up -d db-service
```

Run the initialization script **once** after the container is created:

```bash
docker exec -it fluento-db-service-1 mongo /docker-entrypoint-initdb.d/init-rs.js
```

## Directory Structure

```text
apps/db/
└── init-rs.js    # Script to initialize MongoDB replica set
```
