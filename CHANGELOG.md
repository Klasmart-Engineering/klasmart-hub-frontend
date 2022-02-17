# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.31.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.31.0%0D2.30.1) (2022-02-17)


### 🐛 Bug Fixes

* **dashboard-toggle:** created recoilFamily state to resolve multiple users individual local storage dashboard preference ([6aee986](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/6aee986d4eb612346e214ab5b56a88640100d325))
* enable language switch for the all day label ([90c4505](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/90c4505dd7dc9fbd2e3e5bf7551e49ce5f159db1)), closes [fix/DT-599](https://calmisland.atlassian.net/browse/DT-599)
* teachers images added using git lfs ([7fd6772](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/7fd67721b39df5d1a9cd52136c3378001d1c2418))


### 📦 Refactor

* migrate to use classNode ([3b1287c](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/3b1287c68889ecefef2b91442265e9f21275d358))
* **school:** migrated to use schoolsConnection ([9a4b169](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/9a4b1698f8df5b10cbb854495047bb02153c504c)), closes [AD-2023-school-admin-create-users-v2](https://calmisland.atlassian.net/browse/AD-2023-school-admin-create-users-v2) [AD-2023](https://calmisland.atlassian.net/browse/AD-2023)


### ✨ Features

* dynamically show sections in side panel ([76ed447](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/76ed447b6b25f6f85550c820fe0e29a695bda154)), closes [AD-1794](https://calmisland.atlassian.net/browse/AD-1794)
* enable teacher scaffolding for  .id,.vn, .co.uk, .pk, .lk, .th ([b79cd66](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/b79cd6644994cabfc0a8f03cbac02ff036900210)), closes [feature/DT-590](https://calmisland.atlassian.net/browse/DT-590)
* handle new ERR_INVALID_USERNAME error code ([580ddb6](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/580ddb6b83822f10b17ca9e94efe717559c7a1dd))
* new scaffold student next class widget ([d023a61](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/d023a6144b0e81e0630cf9a64ba070f0c2b2f592))
* removing general section from side panel ([9c4e743](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/9c4e743d22763abf6dbd273d74725566c5a55c35)), closes [AD-2016](https://calmisland.atlassian.net/browse/AD-2016)
* **widget:** achievement widget ([45f0534](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/45f0534c94df538fa010659d1ab699266baed381)), closes [DT-548](https://calmisland.atlassian.net/browse/DT-548) [DT-548](https://calmisland.atlassian.net/browse/DT-548) [DT-548](https://calmisland.atlassian.net/browse/DT-548) [DT-548](https://calmisland.atlassian.net/browse/DT-548) [DT-548](https://calmisland.atlassian.net/browse/DT-548) [DT-548](https://calmisland.atlassian.net/browse/DT-548) [DT-548](https://calmisland.atlassian.net/browse/DT-548) [DT-548](https://calmisland.atlassian.net/browse/DT-548) [DT-548](https://calmisland.atlassian.net/browse/DT-548)
* **widget:** student completion widget ([c4382aa](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/c4382aa9e7151bf65dc13c372340d682c059bf1c)), closes [DT-549](https://calmisland.atlassian.net/browse/DT-549) [DT-549](https://calmisland.atlassian.net/browse/DT-549) [DT-549](https://calmisland.atlassian.net/browse/DT-549) [DT-549](https://calmisland.atlassian.net/browse/DT-549)
* **widget:** teacher feedback widget ([e7483be](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/e7483be35d8b0817531335c9280f80deefabad84)), closes [DT-544](https://calmisland.atlassian.net/browse/DT-544) [DT-544](https://calmisland.atlassian.net/browse/DT-544) [DT-544](https://calmisland.atlassian.net/browse/DT-544) [DT-544](https://calmisland.atlassian.net/browse/DT-544)

### [2.30.1](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.30.1%0D2.30.0) (2022-02-07)

## [2.30.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.30.0%0D2.29.0) (2022-02-07)


### 🐛 Bug Fixes

* added labels to memo call to update translations ([11a3714](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/11a3714ddfbef91810887d66b811a8636f982d97)), closes [fix/DT-593](https://calmisland.atlassian.net/browse/DT-593)
* replace schedule i18n key ([3784e37](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/3784e3737859580f70603a612f71cb08c49534c1)), closes [feat/DT-398](https://calmisland.atlassian.net/browse/DT-398)
* **reports:** fix bug on token access refresh for api ([d64091f](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/d64091f32d9fd54ad72b2d21c6af7a4d6b8686cf))


### ✨ Features

* dashboard toggle for mock data users ([25f6339](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/25f6339fbe0f67ac12445b1fecabcbd79866df53))
* **DT-515:** added mock data interceptor ([c158732](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/c158732753cfdd704cec096286412fe086ca9c37)), closes [DT-515](https://calmisland.atlassian.net/browse/DT-515) [DT-515](https://calmisland.atlassian.net/browse/DT-515) [DT-515](https://calmisland.atlassian.net/browse/DT-515)
* **DT-515:** enabling dummy data toggle ([85b7f23](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/85b7f23cc2abf592f3f5b7063cae71e10e2b2b10)), closes [DT-515](https://calmisland.atlassian.net/browse/DT-515) [DT-515](https://calmisland.atlassian.net/browse/DT-515) [DT-515](https://calmisland.atlassian.net/browse/DT-515) [DT-515](https://calmisland.atlassian.net/browse/DT-515) [DT-515](https://calmisland.atlassian.net/browse/DT-515) [DT-515](https://calmisland.atlassian.net/browse/DT-515)

## [2.29.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.29.0%0D2.28.2) (2022-02-01)


### ✨ Features

* replace hard coded english with translations ([c7f323e](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/c7f323e296ac2eef369f210882558c83576067a9)), closes [feat/DT-398](https://calmisland.atlassian.net/browse/DT-398) [feat/DT-398](https://calmisland.atlassian.net/browse/DT-398) [feat/DT-398](https://calmisland.atlassian.net/browse/DT-398)

### [2.28.2](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.28.2%0D2.28.1) (2022-01-28)


### 🐛 Bug Fixes

* teacher load upcoming classes time range (7 days include today) ([807689b](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/807689bd2f5fd5303137de98d38cc0ac78da499c)), closes [fix/DT-540](https://calmisland.atlassian.net/browse/DT-540)

### [2.28.1](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.28.1%0D2.28.0) (2022-01-28)


### 🐛 Bug Fixes

* **localization:** change translation plural variable name ([34387a9](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/34387a907903e7e105aaeaaaf6779712694a6575))


### 📦 Refactor

* **school:** migrate from deprecated school query ([cfd090a](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/cfd090a193b4d80acea5542a5182c06fc4b0c48b)), closes [hotfix/AD-1219](https://calmisland.atlassian.net/browse/AD-1219) [AD-1219](https://calmisland.atlassian.net/browse/AD-1219) [hotfix/AD-1219](https://calmisland.atlassian.net/browse/AD-1219) [hotfix/AD-1219](https://calmisland.atlassian.net/browse/AD-1219)

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
