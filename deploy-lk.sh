#!/usr/bin/env bash
# deployment for kidsloop.lk
# make sure you run git lfs install && git lfs pull

npm ci
cp deploy/config/lk/.env.prod ./.env
npm run build
aws s3 sync s3://kllk-prod-hub/latest s3://kllk-prod-hub/$(date "+%Y%m%d")
aws s3 sync dist s3://kllk-prod-hub/latest --delete
dist_id=$(aws cloudfront list-distributions --region ap-southest-1 | jq -c '.DistributionList.Items[] | select(.Aliases.Items[0] | contains("hub")) | .Id')
aws cloudfront create-invalidation --paths "/*" --distribution-id ${dist_id}
