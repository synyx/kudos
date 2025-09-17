# Kudos Helm Chart

A Helm chart for deploying Kudos, a simple social recognition platform for teams.

## Overview

Kudos is a lightweight application that enables team members to give and receive recognition.

**⚠️ External Database Required**: Starting with v2.0.0, this chart requires an external PostgreSQL database. The chart no longer manages database infrastructure to follow production best practices and maintain simplicity.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- **External PostgreSQL database** (see [DATABASE_SETUP.md](../../DATABASE_SETUP.md))

## Installation

### Quick Start

1. **Set up your PostgreSQL database** (see [DATABASE_SETUP.md](../../DATABASE_SETUP.md))

2. **Create database credentials secret**:
   ```bash
   kubectl create secret generic kudos-db-credentials \
     --from-literal=username=kudos \
     --from-literal=password=YOUR_SECURE_PASSWORD
   ```

3. **Install the chart**:
   ```bash
   helm install kudos oci://ghcr.io/synyx/kudos-helm \
     --set postgresql.host=your-database-host.com \
     --set postgresql.auth.existingSecret=kudos-db-credentials
   ```

### Advanced Configuration

Create a `values.yaml` file:

```yaml
# Application configuration
app:
  origin: https://kudos.yourcompany.com

# External PostgreSQL configuration
postgresql:
  host: "your-database-host.com"
  port: 5432
  database: "kudos"
  sslMode: "require"  # recommended for production
  
  auth:
    existingSecret: "kudos-db-credentials"
    usernameKey: "username"
    passwordKey: "password"

# Ingress configuration
ingress:
  enabled: true
  hosts:
    - host: kudos.yourcompany.com
      paths:
        - path: /
          pathType: Prefix
```

Install with custom configuration:
```bash
helm install kudos oci://ghcr.io/synyx/kudos-helm -f values.yaml
```

## Configuration

### Application Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of application replicas | `1` |
| `image.repository` | Container image repository | `ghcr.io/synyx/kudos` |
| `image.tag` | Container image tag | `main` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `app.origin` | Public URL where app is accessible | `https://localhost` |

### PostgreSQL Configuration

**Required**: You must configure an external PostgreSQL database.

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| `postgresql.host` | PostgreSQL server hostname | `""` | ✅ Yes |
| `postgresql.port` | PostgreSQL server port | `5432` | No |
| `postgresql.database` | Database name | `"kudos"` | No |
| `postgresql.sslMode` | SSL connection mode | `"disable"` | No |

**SSL Mode Options**: `disable`, `allow`, `prefer`, `require`, `verify-ca`, `verify-full`

### Authentication Configuration

Choose one of the following authentication methods:

#### Option 1: Existing Secret (Recommended)

| Parameter | Description | Default |
|-----------|-------------|---------|
| `postgresql.auth.existingSecret` | Name of existing secret | `""` |
| `postgresql.auth.usernameKey` | Key for username in secret | `"username"` |
| `postgresql.auth.passwordKey` | Key for password in secret | `"password"` |

#### Option 2: Create Secret via Helm

| Parameter | Description | Default |
|-----------|-------------|---------|
| `postgresql.auth.createSecret` | Create secret via Helm | `false` |
| `postgresql.auth.username` | Username for new secret | `"kudos"` |
| `postgresql.auth.password` | Password for new secret | `""` |

**Important**: You cannot use both methods simultaneously. The chart will fail with a validation error if both `existingSecret` and `createSecret` are configured.

### Service Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `service.type` | Kubernetes service type | `ClusterIP` |
| `service.port` | Service port | `80` |

### Ingress Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `ingress.enabled` | Enable ingress | `false` |
| `ingress.className` | Ingress class name | `""` |
| `ingress.annotations` | Ingress annotations | `{}` |
| `ingress.hosts` | Ingress hosts configuration | See values.yaml |
| `ingress.tls` | TLS configuration | `[]` |

### Resource Management

| Parameter | Description | Default |
|-----------|-------------|---------|
| `resources.limits.cpu` | CPU limit | `500m` |
| `resources.limits.memory` | Memory limit | `512Mi` |
| `resources.requests.cpu` | CPU request | `100m` |
| `resources.requests.memory` | Memory request | `128Mi` |

## Database Setup

This chart requires an external PostgreSQL database. See [DATABASE_SETUP.md](../../DATABASE_SETUP.md) for comprehensive setup instructions including:

- **Cloud Services**: AWS RDS, Google Cloud SQL, Azure Database for PostgreSQL
- **Self-Managed**: Using PostgreSQL operators (CloudNative-PG, Zalando)
- **Security**: SSL configuration, network security, credential management
- **Migration**: Moving from embedded database setups

## Migration from Previous Versions

If you're upgrading from chart versions < 2.0.0, see [MIGRATION.md](../../MIGRATION.md) for step-by-step migration instructions.

**Breaking Changes in v2.0.0**:
- Database management removed
- External PostgreSQL required
- Configuration structure changed
- No backward compatibility

## License

This project is licensed under the MIT License - see the LICENSE file for details.
