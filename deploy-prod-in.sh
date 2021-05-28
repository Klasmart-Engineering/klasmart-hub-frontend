#!/usr/bin/env bash
npm ci --no-progress
npm audit fix
npm run build:prod-in
aws s3 sync dist s3://klindia-prod-hub/latest
aws s3 sync dist s3://klindia-prod-hub/latest --delete
aws cloudfront create-invalidation --paths "/*" --distribution-id E1VSI2XC8592JJ #hub-prod.kidsloop.in
