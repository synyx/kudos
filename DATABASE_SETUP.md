# Database Setup Guide

This guide provides instructions for setting up an external PostgreSQL database for Kudos. Starting with Helm Chart v2.0.0, Kudos requires users to manage their own database infrastructure.

## Why External Database?

- **Separation of Concerns**: Database administration is distinct from application deployment
- **Production Ready**: External databases offer better reliability, backup, and scaling options
- **Flexibility**: Choose your preferred database hosting solution

## Database Requirements

Kudos requires:

- **PostgreSQL 14 or higher** (recommended: PostgreSQL 15+)
- **SSL support** (recommended for production)
- **Network connectivity** from your Kubernetes cluster

## Setup Options

Kudos needs a PostgreSQL database - it doesn't matter how you provide it. Here are some common approaches:

### Managed Database Services

Use your preferred database provider's managed PostgreSQL service. These typically offer automated backups, scaling, security, and maintenance.

### PostgreSQL Operators

If you're running on Kubernetes, you can use PostgreSQL operators to manage database clusters:

- **[CloudNative-PG](https://cloudnative-pg.io/)**: Modern PostgreSQL operator with comprehensive lifecycle management ([GitHub](https://github.com/cloudnative-pg/cloudnative-pg))
- **[Zalando PostgreSQL Operator](https://github.com/zalando/postgres-operator)**: Production-grade operator with high availability support

These operators handle cluster management, backups, and failover automatically within your Kubernetes environment.

### Self-Managed PostgreSQL

Run PostgreSQL directly in your infrastructure using standard deployment methods, containers, or virtual machines.

## Connection Configuration

Configure Kudos to connect to your database using the Helm values. See the [values.yaml](kudos.oss/helm/kudos/values.yaml) file for all available PostgreSQL configuration options including:

- Database connection settings (host, port, database name, SSL mode)
- Authentication configuration (existing secret reference)
- Secret key mapping for username and password

Create your own `values.yaml` file based on the chart defaults and install with:

```bash
helm install kudos oci://ghcr.io/synyx/kudos-helm -f values.yaml
```

## Data Migration

If you're migrating from an existing Kudos installation with embedded database, see [MIGRATION.md](MIGRATION.md) for comprehensive migration instructions including data export and import procedures.
