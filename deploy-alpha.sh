#!/usr/bin/env bash
npm ci
npm run build:alpha
aws s3 sync dist s3://kidsloop-hub-alpha-dynamic-louse/alpha/latest
aws cloudfront create-invalidation --paths "/*" --distribution-id E15G7HP1IMB2DX #hub.alpha.kidsloop.net