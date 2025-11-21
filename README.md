# Kudos

<div align="center">
    <img width="150" src="res/kudo-monster.svg" alt="Kudo Monster">
</div>

👏 **Kudos** is a versatile and interactive web application, meticulously crafted to revolutionize the way you appreciate and celebrate your colleagues in the workplace. Kudos allows you not only to send tailor-made "Kudo" cards, but also to enhance them with your personal touch.

Transform your workplace culture by celebrating individual and team accomplishments, fostering positive reinforcement, and promoting an atmosphere of genuine appreciation with Kudos!

## 🌟 Features

📝 **Personalized Text**: Add heartfelt messages to let your colleagues know how much they mean to you.

🎴 **Multiple Templates**: Choose from a variety of templates to suit the occasion.

🎨 **Drawing Functionality**: Unleash your creativity by drawing directly on the card for that extra personal touch.

💾 **Download Cards**: Save individual Kudo cards as high-quality PNG images to share outside the application or keep as mementos.

🎉 **Presentation Mode**:
Planning to showcase the Kudos in a team meeting or special occasion? Switch to Presentation Mode, where you can shuffle through all received cards and celebrate together as a team.

🗂 **Archiving**:
Keep track of all the positive vibes by utilizing our archiving functionality. Save cherished moments and revisit them any time you need a morale boost.

## Developing

To get you up and running you need to run the following steps:

1. Install [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and install the required NodeJS version with `nvm install`
2. Make sure you run the correct NodeJS version with `nvm use`
3. Install dependencies with `pnpm install`
4. Copy `.env.example` to `.env` and configure database connection: `DATABASE_URL="postgres://kudos:secret@localhost:5432/kudos"`
5. Start database with `docker compose up -d`
6. Run database migrations with `pnpm run db:migrate`
7. Start local dev server with `pnpm run dev`

The application will be available at `http://localhost:5173`

## Building

To create a production version of your app:

```bash
pnpm run build
```

You can preview the production build with `pnpm run preview`.

## Environment Variables

The following environment variables can be configured:

- `DATABASE_URL`: PostgreSQL connection string (required)
- `ORIGIN`: The origin URL for the application (required for production)
- `KUDOS_MIGRATE`: Set to `"1"` or `"true"` to run database migrations on startup (optional)

Example:
```bash
DATABASE_URL="postgresql://kudos:secret@localhost:5432/kudos"
ORIGIN="https://your-domain.com"
KUDOS_MIGRATE="1"
```

## Deployment

### Database Setup

**Important**: Starting with Helm Chart v2.0.0, Kudos requires an external PostgreSQL database. The application no longer manages database infrastructure.

📖 **See [DATABASE_SETUP.md](DATABASE_SETUP.md)** for comprehensive instructions on setting up PostgreSQL for Kudos, including:
- Cloud database services (AWS RDS, Google Cloud SQL, Azure Database)
- Self-managed PostgreSQL with operators (CloudNative-PG, Zalando)
- Security best practices and connection configuration
- Migration guidance from embedded database setups

### Docker

The application can be deployed using the provided Docker image:

```bash
docker run -e DATABASE_URL="your-db-url" -e ORIGIN="your-origin" -p 3000:3000 ghcr.io/synyx/kudos:main
```

### Docker Compose

For a complete setup including the database, you can use Docker Compose. This will start both the PostgreSQL database and the Kudos application:

```bash
# Start the application and database
docker compose up -d

# View logs
docker compose logs -f

# Stop the services
docker compose down
```

The application will be available at `http://localhost:3000`. The Docker Compose configuration automatically handles database migrations through the `KUDOS_MIGRATE` environment variable.

### Helm Chart

A Helm chart is available for Kubernetes deployment. **You must set up an external PostgreSQL database before installing** (see [DATABASE_SETUP.md](DATABASE_SETUP.md)).

The chart uses an init container to handle database migrations automatically, so the `KUDOS_MIGRATE` environment variable is not needed in the main application container.

#### Install via Helm

```sh
# add repo
helm repo add synyx https://synyx.github.io/kudos/docs/helm
helm repo update

# inspect defaults
helm show values synyx/kudos > values.yaml
# edit as needed - CONFIGURE POSTGRESQL CONNECTION

# install or upgrade
helm upgrade --install kudos synyx/kudos \
  --version <CHART VERSION> \
  -f values.yaml
```

#### Migrating from v1.x to v2.0.0

**Important**: Kudos Helm Chart v2.0.0 introduces breaking changes by removing database management. If you're upgrading from an earlier version, please follow the [Migration Guide](MIGRATION.md) for step-by-step instructions.

## Releasing

### Creating a New Release

To create a new release, follow these steps:

1. **Update version numbers:**
   - Update `version` in `package.json` (e.g., `1.2.1` → `1.3.0`)
   - Update `appVersion` in `helm/kudos/Chart.yaml` to match the package.json version
   - If the Helm chart itself has changes, also update `version` in `helm/kudos/Chart.yaml` (e.g., `2.0.0` → `2.1.0`)

2. **Commit the version changes:**
   ```bash
   git add package.json helm/kudos/Chart.yaml
   git commit -m "chore: bump version to v1.3.0"
   git push origin main
   ```

3. **Create and push a git tag:**
   ```bash
   git tag v1.3.0
   git push origin v1.3.0
   ```

### What Happens Automatically

Once you push the tag, GitHub Actions will automatically:

- **Docker Image**: Build and publish multi-architecture (amd64/arm64) Docker images to GitHub Container Registry:
  - `ghcr.io/synyx/kudos:v1.3.0` (versioned tag)
  - `ghcr.io/synyx/kudos:main` (also updated from main branch pushes)

- **Helm Chart**: When changes are pushed to the `helm/` directory, the chart is automatically packaged and published to GitHub Pages:
  - Packaged chart: `docs/helm/kudos-2.1.0.tgz`
  - Repository index: `docs/helm/index.yaml`

### GitHub Release

After the automated builds complete, manually create a GitHub Release:

1. Go to the repository's [Releases page](https://github.com/synyx/kudos/releases)
2. Click "Create a new release"
3. Select the tag you just created (e.g., `v1.3.0`)
4. Add release notes describing changes, new features, and bug fixes
5. Publish the release

### Version Strategy

- **Application version** (`package.json` and `Chart.yaml` `appVersion`): Follow [Semantic Versioning](https://semver.org/)
  - MAJOR: Breaking changes
  - MINOR: New features (backward compatible)
  - PATCH: Bug fixes (backward compatible)

- **Helm chart version** (`Chart.yaml` `version`): Increment when chart configuration changes
  - Update even if only app version changes
  - Use separate versioning from application version
