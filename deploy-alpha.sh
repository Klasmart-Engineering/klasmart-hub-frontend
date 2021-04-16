#!/usr/bin/env bash

STAGE="prod" \
CN_CMS_ENDPOINT="https://cms.alpha.kidsloop.net/" \
API_ENDPOINT="https://api.alpha.kidsloop.net/" \
AUTH_ENDPOINT="https://auth.alpha.kidsloop.net/" \
LIVE_ENDPOINT="https://live.alpha.kidsloop.net/" \
COOKIE_DOMAIN="alpha.kidsloop.net" \
npm run build:alpha
aws s3 sync dist s3://kidsloop-hub-alpha-dynamic-louse/alpha/latest
aws cloudfront create-invalidation --paths "/*" --distribution-id E15G7HP1IMB2DX #hub.alpha.kidsloop.net