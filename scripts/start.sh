#!/bin/sh
set -e

# Run database migration if KUDOS_MIGRATE is set to "1" or "true"
if [ "$KUDOS_MIGRATE" = "1" ] || [ "$KUDOS_MIGRATE" = "true" ]; then
    echo "Running database migrations..."
    npm run db:migrate
    echo "Database migrations completed."
fi

# Start the application
echo "Starting Kudos application..."
exec node index.js
