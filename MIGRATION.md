# Migration Guide to Kudos Helm Chart v1.0.0

This guide helps you migrate from the old Bitnami PostgreSQL-based Helm chart to the new v1.0.0 chart with simplified PostgreSQL modes.

## ⚠️ Important Notes

- This is a **breaking change** migration
- **Downtime is required** during the migration process
- **Always backup your database** before starting the migration

## Step-by-Step Migration

### 1. Backup Your Database

First, create a backup of your existing PostgreSQL database. Follow the official PostgreSQL documentation for creating backups:

- [PostgreSQL Backup and Restore Documentation](https://www.postgresql.org/docs/15/backup.html)

### 2. Uninstall the Old Kudos Release

```bash
# Uninstall the old kudos release (this will remove the application and PostgreSQL)
helm uninstall kudos -n <your-namespace>
```

**Note**: This will remove both your Kudos application and the Bitnami PostgreSQL deployment since it was included as a chart dependency. However, the PostgreSQL data volume (PVC) may remain in your cluster.

### 3. Check for Remaining PostgreSQL Resources

After uninstalling, check if any PostgreSQL persistent volume claims remain:

```bash
# Check for remaining PVCs
kubectl get pvc -n <your-namespace>

# If PostgreSQL PVCs exist, you may want to remove them after confirming your backup
# kubectl delete pvc data-kudos-postgresql-0 -n <your-namespace>
```

### 4. Choose Your PostgreSQL Mode

The new chart offers two PostgreSQL modes:

#### Option A: Operator Mode (Recommended for Production)

**Prerequisite**: The Zalando Postgres Operator must be installed in your cluster before using this mode.

Create your values file (`values.yaml`):

```yaml
postgres:
  mode: "operator"
  operator:
    clusterName: "kudos-postgres"
    teamId: "my-team"
```

#### Option B: Self-contained Mode (Simple Deployments)

Create your values file (`values.yaml`):

```yaml
postgres:
  mode: "selfcontained"
  selfcontained:
    storage:
      size: "1Gi"  # Adjust based on your needs
```

### 5. Install the New Kudos Chart

```bash
# Add the updated Helm repository
helm repo add synyx https://synyx.github.io/kudos/docs/helm
helm repo update

# Install the new chart version
helm upgrade --install kudos synyx/kudos \
  --version 1.0.0 \
  -f values.yaml \
  -n <your-namespace>
```

### 6. Restore Your Database

#### For Operator Mode

Wait for the PostgreSQL cluster to be ready:

```bash
kubectl get postgresql kudos-postgres -n <your-namespace>
```

Connect to the PostgreSQL cluster and restore your backup:

```bash
# Get the PostgreSQL service endpoint
kubectl get service kudos-postgres -n <your-namespace>

# Restore your backup using pg_restore or psql
# Follow PostgreSQL documentation for restore procedures
```

#### For Self-contained Mode

Wait for the PostgreSQL pod to be ready:

```bash
kubectl get pods -l app.kubernetes.io/name=kudos -n <your-namespace>
```

Connect to the PostgreSQL pod and restore your backup:

```bash
# Port forward to access PostgreSQL
kubectl port-forward service/kudos-postgresql 5432:5432 -n <your-namespace>

# In another terminal, restore your backup
# Follow PostgreSQL documentation for restore procedures
```

### 7. Verify the Migration

1. Check that all pods are running:

   ```bash
   kubectl get pods -n <your-namespace>
   ```

2. Check application logs:

   ```bash
   kubectl logs deployment/kudos -n <your-namespace>
   ```

3. Access your Kudos application and verify it's working correctly

## Configuration Changes

The new chart uses different configuration structure. Key changes:

### Database Connection

- **Operator Mode**: SSL encryption enabled by default (`sslmode=require`)
- **Self-contained Mode**: No SSL encryption (`sslmode=disable`)
