# KidsLoop Hub

KidsLoop hub Frontend uses 3 different branches for developing, testing and deploying (`master`, `beta` and `prod`).

To push changes from `master` to `beta`, simply, create a Pull-Request with Fast-Forward merge strategy to merge from master to beta. To push on prod, same idea with `beta` to `prod`.

In `Assessment v3.pdf`, we will provide only 2~3 pages and 9~14 pages of UI.

Since the content of the `Assessment v3.pdf` is often out of date, if you have any questions, please ask to Isu and Adrien using Slack channel.

## Core design library: MUI

- Component Demo: https://mui.com/components/buttons/
- Icons: https://mui.com/components/material-icons/

## Building and Deploying

### Prerequisites

#### Installation

- Install Node.js v16.x.x (preferable v16.13.0 LTS)
- Run `npm -v` and make sure you are on the latest stable npm version - at least 8.x.x (if not run `npm install -g npm@latest`)
- Install the dependencies: `npm install`

#### Configuration

- Map `fe.alpha.kidsloop.net` to `localhost` by [editing your hosts file](https://www.howtogeek.com/howto/27350/beginner-geek-how-to-edit-your-hosts-file/)
- Configure environment variables
  - Create `.env` (which is gitignored)
  - Copy the contents of `.env.example` into `.env`, make changes as required

### Run locally

- Make sure to be on a local development branch based on `master`, e.g. `release/test`
- Run `npm start` to start a local development server
- If you want to target a local API server, follow instructions on [the user-service repo](https://github.com/KL-Engineering/user-service)

### Build for Beta

Make sure to be on `beta` and then `npm run build`

### Build for Pre-Production

Make sure to be on `prod` and then `npm run build:test`

### Build for Production

Make sure to be on `prod` and then `npm run build:prod`

### Deploying

#### Amazon S3 Buckets

If files already exist, delete all the files in the bucket before uploading a new build. You will have approximately five (5) minutes to upload a new build after the previous one has been deleted.

For steps 2-4 in the upload process, proceed with the default settings, you do not need to change anything.

[AWS S3 Beta](https://s3.console.aws.amazon.com/s3/buckets/kidsloop-beta-hub-site/?region=us-west-2&tab=overview)

[AWS S3 Pre-Production](https://s3.console.aws.amazon.com/s3/buckets/kidsloop-test-hub-site/?region=us-west-2&tab=overview)

[AWS S3 Production](https://s3.console.aws.amazon.com/s3/buckets/kidsloop-hub-site/?region=us-west-2&tab=overview)

#### Amazon Cloudfront

In the CloudFront distribution, go to the `Invalidations` tab to create a cache invalidation. After clicking `Create Invalidation`, type `/` under `Object Paths`, and then click `Invalidate`. This will ensure that new site visitors will see the newly uploaded build.

Beta ID: [E2E5VY9QII3K8T](https://console.aws.amazon.com/cloudfront/home?region=ap-northeast-2#distribution-settings:E2E5VY9QII3K8T)

Pre-Production ID: [E1B9GOHPCRYKDS](https://console.aws.amazon.com/cloudfront/home?region=ap-northeast-2#distribution-settings:E1B9GOHPCRYKDS)

Production ID: [E214L6N83MHUOL](https://console.aws.amazon.com/cloudfront/home?region=ap-northeast-2#distribution-settings:E214L6N83MHUOL)
