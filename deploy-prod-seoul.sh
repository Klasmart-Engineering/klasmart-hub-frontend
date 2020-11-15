#!/usr/bin/env bash
npm run build:prod
aws s3 sync dist s3://kidsloop-hub-site
aws cloudfront create-invalidation --paths "/*" --distribution-id E214L6N83MHUOL #hub.kidsloop.net