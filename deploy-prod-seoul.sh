#!/usr/bin/env bash
npm run build:prod
aws s3 sync s3://kidsloop-hub-prod/ backup
aws s3 sync dist s3://kidsloop-hub-prod
aws cloudfront create-invalidation --paths "/*" --distribution-id E1VK57W60MLYQ5 #hub.kidsloop.net