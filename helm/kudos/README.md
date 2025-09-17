# Kudos Helm Chart

A Helm chart for deploying Kudos, a simple social recognition platform for teams.

## Overview

Kudos is a lightweight application that enables team members to give and receive recognition. This Helm chart supports three PostgreSQL deployment modes to fit different infrastructure needs.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- One of the following (depending on chosen PostgreSQL mode):
  - For `cnpg` mode: [CloudNativePG Operator](https://cloudnative-pg.io/)
  - For `zalando` mode: [Zalando Postgres Operator](https://github.com/zalando/postgres-operator)
  - For `selfcontained` mode: No additional requirements

## Installation

### Quick Start (Self-contained)

```bash
helm install kudos oci://ghcr.io/synyx/kudos-helm
```

### With CloudNativePG

```bash
helm install kudos oci://ghcr.io/synyx/kudos-helm \
  --set postgres.mode=cnpg \
  --set postgres.cnpg.clusterName=my-kudos-db
```

### With Zalando Postgres Operator

```bash
helm install kudos oci://ghcr.io/synyx/kudos-helm \
  --set postgres.mode=zalando \
  --set postgres.zalando.teamId=my-team
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

### Common Database Configuration

These settings are shared across all PostgreSQL deployment modes:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `app.db.user` | Database username | `kudos` |
| `app.db.host` | Database host (auto-configured for operator modes) | `""` |
| `app.db.port` | Database port | `5432` |
| `app.db.name` | Database name | `kudos` |
| `app.db.ssl.mode` | SSL mode (`disable`, `require`, etc.) | `disable` |

### PostgreSQL Deployment Modes

#### 1. Self-contained Mode (`postgres.mode: "selfcontained"`)

Simple embedded PostgreSQL pod. Best for development and small deployments.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `postgres.selfcontained.storage.size` | Persistent volume size | `10Gi` |
| `postgres.selfcontained.storage.storageClass` | Storage class name | `""` |
| `postgres.selfcontained.resources.limits.memory` | Memory limit | `1Gi` |
| `postgres.selfcontained.resources.limits.cpu` | CPU limit | `500m` |
| `postgres.selfcontained.resources.requests.memory` | Memory request | `256Mi` |
| `postgres.selfcontained.resources.requests.cpu` | CPU request | `100m` |

**Secret Management**: The chart automatically generates a PostgreSQL secret for the database credentials. For advanced use cases, you can configure existing secrets:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `app.db.passwordSecret` | Name of existing secret containing the password (uses `password` key) | `""` |
| `app.db.existingSecret.name` | Name of existing secret with custom key mapping | `""` |
| `app.db.existingSecret.keys.username` | Key for username in existing secret | `"username"` |
| `app.db.existingSecret.keys.password` | Key for password in existing secret | `"password"` |

#### 2. CloudNativePG Mode (`postgres.mode: "cnpg"`)

Infrastructure-as-code PostgreSQL management. Best for production with full control.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `postgres.cnpg.clusterName` | PostgreSQL cluster name | `kudos-postgres` |
| `postgres.cnpg.instances` | Number of PostgreSQL instances | `1` |
| `postgres.cnpg.volume.size` | Storage size per instance | `10Gi` |
| `postgres.cnpg.volume.storageClass` | Storage class | `""` |
| `postgres.cnpg.resources.limits.memory` | Memory limit per instance | `1Gi` |
| `postgres.cnpg.resources.limits.cpu` | CPU limit per instance | `500m` |
| `postgres.cnpg.resources.requests.memory` | Memory request per instance | `256Mi` |
| `postgres.cnpg.resources.requests.cpu` | CPU request per instance | `100m` |
| `postgres.cnpg.ssl.mode` | SSL connection mode | `require` |

**Secret Management**: The chart supports three approaches:
1. **Auto-generated secrets** (default): When `app.db.passwordSecret` and `app.db.existingSecret.name` are empty, a secret is auto-generated
2. **Legacy secret reference**: Set `app.db.passwordSecret` to reference an existing secret with a `password` key
3. **Advanced existing secret**: Use `app.db.existingSecret` for full control over secret name and key mapping

#### 3. Zalando Mode (`postgres.mode: "zalando"`)

Fully managed PostgreSQL-as-a-Service. Best for production with minimal operational overhead.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `postgres.zalando.clusterName` | PostgreSQL cluster name | `kudos-postgres` |
| `postgres.zalando.teamId` | Team identifier for the cluster | `kudos` |
| `postgres.zalando.namespace` | Namespace for the cluster (defaults to release namespace) | `""` |
| `postgres.zalando.numberOfInstances` | Number of PostgreSQL instances | `2` |
| `postgres.zalando.storage.size` | Storage size | `10Gi` |
| `postgres.zalando.resources.limits.memory` | Memory limit per instance | `1Gi` |
| `postgres.zalando.resources.limits.cpu` | CPU limit per instance | `500m` |
| `postgres.zalando.resources.requests.memory` | Memory request per instance | `256Mi` |
| `postgres.zalando.resources.requests.cpu` | CPU request per instance | `100m` |
| `postgres.zalando.ssl.mode` | SSL connection mode | `require` |

**Secret Management**: The Zalando operator automatically creates and manages secrets. The `app.db.passwordSecret` field is ignored.

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
| `ingress.hosts` | Ingress hosts configuration (array of host objects with paths) | `[{host: localhost, paths: [{path: /, pathType: ImplementationSpecific}]}]` |
| `ingress.tls` | TLS configuration | `[]` |

### Resource Management

| Parameter | Description | Default |
|-----------|-------------|---------|
| `resources.limits.cpu` | CPU limit | `500m` |
| `resources.limits.memory` | Memory limit | `512Mi` |
| `resources.requests.cpu` | CPU request | `100m` |
| `resources.requests.memory` | Memory request | `128Mi` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with all PostgreSQL modes
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.