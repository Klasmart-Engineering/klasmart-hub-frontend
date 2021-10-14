#!/usr/bin/env bash
npm ci
mv ./.env ./.env.temp
cp deploy/config/internal/.env.alpha ./.env
npm run build
mv ./.env.temp ./.env
aws s3 sync dist s3://kidsloop-hub-alpha-dynamic-louse/alpha/latest
aws cloudfront create-invalidation --paths "/*" --distribution-id E15G7HP1IMB2DX #hub.alpha.kidsloop.net