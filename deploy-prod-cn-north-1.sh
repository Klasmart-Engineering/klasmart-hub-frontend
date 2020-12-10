#!/usr/bin/env bash
npm i
npm run build:prod-cn
aws s3 sync dist s3://kidsloop-auth-cn-north-1-prod --region cn-north-1 --dryrun
echo "Waiting 60s before deploying to production in cn-north-1"
sleep 60
aws s3 sync dist s3://kidsloop-auth-cn-north-1-prod --region cn-north-1
aws cloudfront create-invalidation --region cn-north-1 --paths "/*" --distribution-id E3ABTCBR75Z6GO #hub.kidsloop.cn