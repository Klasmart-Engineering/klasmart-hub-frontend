#!/usr/bin/env bash
npm run build:test
aws s3 sync dist s3://kidsloop-test-hub-site
aws cloudfront create-invalidation --paths "/*" --distribution-id E1B9GOHPCRYKDS #test-hub.kidsloop.net