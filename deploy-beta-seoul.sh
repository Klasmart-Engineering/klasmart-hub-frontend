#!/usr/bin/env bash
npm run build:beta
aws s3 sync dist s3://kidsloop-beta-hub-site
aws cloudfront create-invalidation --paths "/*" --distribution-id E2E5VY9QII3K8T #beta-hub.kidsloop.net