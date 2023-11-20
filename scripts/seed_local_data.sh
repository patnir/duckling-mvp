#!/bin/bash

# Log a message and exit with an error code
log_and_exit() {
  echo "Error: $1"
  exit 1
}

echo "Starting Seed Local Data..."

# Ensure environment variables are available
if [ -z "$DATABASE_URL" ]; then
    log_and_exit "DATABASE_URL not set."
fi
if [ -z "$ORG_ID" ]; then
    log_and_exit "ORG_ID not set."
fi

npx prisma generate


echo "Seeding local organization..."
ts-node ./scripts/seedLocalOrganization.ts "$DATABASE_URL" || log_and_exit "Failed to seed local organization"

echo "Loading incentives from CSV..."
ts-node ./scripts/loadIncentives.ts "$DATABASE_URL" "./scripts/sampleLocalData/incentives.csv" || log_and_exit "Failed to load incentives"

echo "Loading product catalogue from CSV..."
ts-node ./scripts/loadProductCatalogue.ts "$DATABASE_URL" "./scripts/sampleLocalData/GreenEarthProductCatalogue.csv" "$ORG_ID" || log_and_exit "Failed to load product catalogue"

echo "Seed Local Data Completed Successfully!"
