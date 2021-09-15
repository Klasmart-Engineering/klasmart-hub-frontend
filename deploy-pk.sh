#!/usr/bin/env bash
# deployment for kidsloop.pk
# make sure you run git lfs install && git lfs pull

npm ci
mv deploy/config/pk/.env.prod ./.env.bitbucket
npm run build:bitbucket
rm -rf ./.env.bitbucket
aws s3 sync s3://klpk-prod-hub/latest s3://klpk-prod-hub/$(date "+%Y%m%d")
aws s3 sync dist s3://klpk-prod-hub/latest --delete
dist_id=$(aws cloudfront list-distributions --region me-south-1 | jq -c '.DistributionList.Items[] | select(.Aliases.Items[0] | contains("hub")) | .Id')
aws cloudfront create-invalidation --paths "/*" --distribution-id ${dist_id}
