# Migration Guide to Kudos Helm Chart v2.0.0

This guide helps you migrate from previous versions of the Kudos Helm chart to v2.0.0, which introduces a **major architectural change**: Kudos no longer manages PostgreSQL infrastructure.

## ⚠️ Breaking Changes

- **PostgreSQL management removed**: Kudos no longer deploys or manages PostgreSQL
- **External database required**: You must provide your own PostgreSQL database
- **Configuration structure changed**: Database connection settings are completely different
- **No backward compatibility**: Complete migration required

## Pre-Migration Requirements

1. **Set up an external PostgreSQL database** (see [DATABASE_SETUP.md](../DATABASE_SETUP.md))
2. **Backup your existing data** if migrating from an older Kudos installation
3. **Prepare database credentials** as Kubernetes secrets

## Migration Steps

### 1. Backup Your Existing Database

If you're migrating from a previous Kudos installation with embedded database:

```bash
# Method 1: Using kubectl exec
kubectl exec -it deployment/kudos -- sh
pg_dump $DATABASE_URL > /tmp/kudos_backup.sql
exit

# Copy backup from pod
kubectl cp kudos-pod:/tmp/kudos_backup.sql ./kudos_backup.sql

# Method 2: Using the provided scripts
# Check kudos-gitlab/scripts/ for automated backup tools
./kudos-gitlab/scripts/db-export.sh
```

### 2. Set Up External PostgreSQL Database

Follow the comprehensive [DATABASE_SETUP.md](../DATABASE_SETUP.md) guide to:
- Choose a database hosting option (cloud services, operators, self-managed)
- Set up your PostgreSQL instance
- Configure network connectivity
- Create the `kudos` database and user

### 3. Create Database Credentials Secret

Create a Kubernetes secret with your database credentials:

```bash
# Replace with your actual database credentials
kubectl create secret generic kudos-db-credentials \
  --from-literal=username=kudos \
  --from-literal=password=YOUR_SECURE_PASSWORD \
  --namespace=your-kudos-namespace
```

### 4. Update Your values.yaml

Replace your existing values.yaml with the new configuration structure:

```yaml
# New v2.0.0 configuration structure
postgresql:
  # REQUIRED: Your external PostgreSQL host
  host: "your-database-host.com"  # Replace with your database host
  port: 5432
  database: "kudos"
  sslMode: "require"  # recommended for production
  
  # Authentication using existing secret
  auth:
    existingSecret: "kudos-db-credentials"
    usernameKey: "username"
    passwordKey: "password"

# Remove all postgres.* configuration from previous versions
# The following are NO LONGER SUPPORTED:
# postgres:
#   mode: "..."
#   zalando: {...}
#   cnpg: {...}
#   selfcontained: {...}
```

### 5. Remove Old Kudos Installation

```bash
# Uninstall the old kudos release
helm uninstall kudos -n your-namespace

# Clean up any remaining database resources
kubectl get pvc,pods,services -l app.kubernetes.io/name=kudos -n your-namespace

# Remove old database PVCs if they exist (after confirming backup)
kubectl delete pvc data-kudos-postgresql-0 -n your-namespace  # if exists
```

### 6. Install New Kudos Chart

```bash
# Add/update the Helm repository
helm repo add synyx https://synyx.github.io/kudos/docs/helm
helm repo update

# Install the new chart version
helm upgrade --install kudos synyx/kudos \
  --version 2.0.0 \
  -f values.yaml \
  -n your-namespace
```

### 7. Restore Your Database (if migrating data)

Import your backup to the new external database:

```bash
# Method 1: Direct restore
psql "postgresql://username:password@your-host:5432/kudos" < kudos_backup.sql

# Method 2: Using the provided scripts
./kudos-gitlab/scripts/db-import.sh kudos_backup.sql

# Method 3: Via kubectl port-forward (if database is in cluster)
kubectl port-forward service/your-postgres-service 5432:5432
psql "postgresql://username:password@localhost:5432/kudos" < kudos_backup.sql
```

### 8. Verify the Migration

1. **Check pod status**:
   ```bash
   kubectl get pods -n your-namespace
   ```

2. **Verify database connectivity**:
   ```bash
   kubectl logs deployment/kudos -n your-namespace
   ```

3. **Test application functionality**:
   - Access your Kudos application
   - Verify existing data is present
   - Test creating new kudos

## Configuration Mapping

### Old vs New Configuration

| Old Configuration | New Configuration | Notes |
|------------------|-------------------|-------|
| `postgres.mode: "selfcontained"` | **REMOVED** | Use external database |
| `postgres.mode: "zalando"` | **REMOVED** | Set up Zalando cluster separately |
| `postgres.mode: "cnpg"` | **REMOVED** | Set up CNPG cluster separately |
| `app.db.host` | `postgresql.host` | Now required |
| `app.db.port` | `postgresql.port` | Default: 5432 |
| `app.db.name` | `postgresql.database` | Default: "kudos" |
| `app.db.ssl.mode` | `postgresql.sslMode` | Default: "disable" |
| `app.db.existingSecret` | `postgresql.auth.existingSecret` | Secret name |
| `app.db.existingSecret.keys.*` | `postgresql.auth.*Key` | Key names in secret |

### New Secret Creation Option

v2.0.0 adds the ability to create secrets via Helm:

```yaml
postgresql:
  auth:
    # Option 1: Use existing secret (recommended)
    existingSecret: "kudos-db-credentials"
    
    # Option 2: Create new secret via Helm
    createSecret: true
    username: "kudos"
    password: "your-secure-password"  # Required if createSecret: true
```

## Troubleshooting

### Common Issues

1. **"postgresql.host is required" error**:
   - Ensure you've set `postgresql.host` in your values.yaml

2. **"Cannot create and use existing secret" error**:
   - Don't set both `createSecret: true` and `existingSecret`
   - Choose one authentication method

3. **Database connection failures**:
   - Verify database is accessible from Kubernetes cluster
   - Check credentials in the secret
   - Verify SSL configuration matches database setup

4. **Migration stuck**:
   - Check init container logs: `kubectl logs deployment/kudos -c migrate`
   - Verify database permissions for the kudos user

### Rollback Plan

If you need to rollback to a previous version:

1. **Backup your current database state**
2. **Reinstall previous chart version**:
   ```bash
   helm upgrade --install kudos synyx/kudos \
     --version 1.x.x \  # Your previous version
     -f old-values.yaml
   ```
3. **Restore previous database configuration**

**Note**: Rollback is complex due to the architectural changes. Plan carefully.

## Database Management Going Forward

With v2.0.0, you're responsible for:

- **Database backups**: Set up automated backups
- **Database updates**: Manage PostgreSQL version updates  
- **Scaling**: Handle database scaling needs
- **Monitoring**: Monitor database performance
- **Security**: Manage database security and access

See [DATABASE_SETUP.md](../DATABASE_SETUP.md) for comprehensive guidance on database management best practices.

## Need Help?

- **Database setup**: Check [DATABASE_SETUP.md](../DATABASE_SETUP.md)
- **Migration scripts**: Use `kudos-gitlab/scripts/db-export.sh` and `db-import.sh`
- **Issues**: Report problems in the Kudos GitHub repository
- **Community**: Join the Kudos community for migration support

Remember: This change makes Kudos more production-ready by following industry best practices of separating application and database concerns!
