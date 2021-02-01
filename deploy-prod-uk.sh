#!/usr/bin/env bash
npm i
npm run build:prod-uk
aws s3 sync dist s3://kidsloop-hub-prod-feasible-scorpion --region eu-west-2 --dryrun
echo "Waiting 60s before deploying to production in eu-west-2"
sleep 60
aws s3 sync dist s3://kidsloop-hub-prod-feasible-scorpion --region eu-west-2
aws cloudfront create-invalidation --region eu-west-2 --paths "/*" --distribution-id EU1USZ6CGXNL1 #hub.kidsloop.cn