#!/usr/bin/env bash
# deployment for kidsloop.co.uk
# make sure you run git lfs install && git lfs pull

npm ci
cp deploy/config/uk/.env.prod ./.env
npm run build
aws s3 sync s3://kluk-prod-hub/latest s3://kluk-prod-hub/$(date "+%Y%m%d")
aws s3 sync dist s3://kluk-prod-hub/latest --delete
dist_id=$(aws cloudfront list-distributions --region eu-west-2 | jq -c '.DistributionList.Items[] | select(.Aliases.Items[0] | contains("hub")) | .Id')
aws cloudfront create-invalidation --paths "/*" --distribution-id ${dist_id}
