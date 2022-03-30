# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.41.1](https://github.com/KL-Engineering/kidsloop-hub-frontend/branches/compare/v2.41.1%0Dv2.41.0) (2022-03-30)


### 🐛 Bug Fixes

* use migrated organization and user object (#12) ([545f80c](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/545f80cadeb4b92849d08034b6c63b5fa3562315))

## [2.41.0](https://github.com/KL-Engineering/kidsloop-hub-frontend/branches/compare/v2.41.0%0Dv2.40.7) (2022-03-30)


### ✨ Features

* **widgets:** enabled learning outcome summary widget (#13) ([bd7b7ad](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/bd7b7ad568f95eb0af3d9dc4a5fefdb58181e0b3))

### [2.40.7](https://github.com/KL-Engineering/kidsloop-hub-frontend/branches/compare/v2.40.7%0Dv2.40.6) (2022-03-30)


### ♻️ Chores

* remove url from confirmation step ([7a80403](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/7a80403ae56968200917657e6a6fcbcbb7f8d59f))


### 🐛 Bug Fixes

* added msg on no widget, fixed not saved popup and height issue (#6) ([ec82aeb](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/ec82aeb2592f9f56ddaa3027ef1c43ae20892dcd))
* build with git lfs pulled assets ([7036be2](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/7036be2dd2f8ab2d3953f67720aeb44949ff2eaf))
* retryHandler was used wrongly (#9) ([e898c9f](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/e898c9f371d0d7501d913df25be19aa408429c61))

### [2.40.6](https://github.com/KL-Engineering/kidsloop-hub-frontend/branches/compare/v2.40.6%0Dv2.40.5) (2022-03-30)


### ♻️ Chores

* **localization:** No teacher feedback keys and English (#10) ([f6a3cc2](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/f6a3cc2d9e2592f593900ebf5b172e9abd8ec76b))
* migrate to github ([3bb4e47](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/3bb4e47f649624a7fd1df59a65e472175f7cebea))
* remove removal of v in git tags ([94c4cf5](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/94c4cf5dd1dccaeb372ff5dfd116dbdb1e503382))


### 🐛 Bug Fixes

* missing migration of kidsloop-px in tests ([04eebcd](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/04eebcd69095ad63e8dcb40a3edea787f0c7d55f))


### 📦 Refactor

* remove redux and unused dependencies (#11) ([cdc9066](https://github.com/KL-Engineering/kidsloop-hub-frontend/commits/cdc90668889bf5029350c3cb1b93a470538d0c2b))

### [2.40.5](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.40.5%0D2.40.4) (2022-03-25)

### [2.40.4](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.40.4%0D2.40.3) (2022-03-25)

### [2.40.3](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.40.3%0D2.40.2) (2022-03-23)

### [2.40.2](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.40.2%0D2.40.1) (2022-03-23)


### 🐛 Bug Fixes

* only promote authentication errors ([bec434d](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/bec434d852a059bf98192a255881596e47f9b6d2))

### [2.40.1](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.40.1%0D2.40.0) (2022-03-21)


### 🐛 Bug Fixes

* altered orgId property to correctly pass in orgid for program form dropdowns ([3451ef3](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/3451ef3506e54de8d93224b278bf8df1fb6c3a21))
* missing reports endpoint ([a41fbdd](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/a41fbdd8838168416260ef3e51e76553e44de8ac))

## [2.40.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.40.0%0D2.39.1-hotfix.0) (2022-03-18)


### 📦 Refactor

* migrate to myUser resolver and optimize fetched data on site load ([91c8c95](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/91c8c95b2031307b441524f1340879ae0d1ee12e))


### 🐛 Bug Fixes

* don't allow npm publish on standard version ([23a765d](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/23a765dc14b1fa87f494c78eee453f1e7e09842b))
* use logout feature flag in `redirectToAuth` ([ff0cec1](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/ff0cec16fb99f7b677eaf3fef97118954e99105f))


### ✨ Features

* **AD-2225:** added age range and subject columns to class csv templates ([6babf97](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/6babf9770ff84d552f850de4f87afde244890470)), closes [AD-2225](https://calmisland.atlassian.net/browse/AD-2225)
* **AD-2228:** add username to the user CSV template ([cba8a21](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/cba8a2108d52f7cfbf6be716ba56404d28fe0414)), closes [AD-2228](https://calmisland.atlassian.net/browse/AD-2228)
* delete user in organization ([07e801f](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/07e801fadafb85f1cc65b1b5529bf803e9c9f176)), closes [AD-1156](https://calmisland.atlassian.net/browse/AD-1156) [AD-1156](https://calmisland.atlassian.net/browse/AD-1156)
* reenable persisted queries ([e1dde56](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/e1dde564793fe0c7cb8d85d2c4089a5c61d42cec))

### [2.39.1-hotfix.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.39.1-hotfix.0%0D2.39.0) (2022-03-14)


### 🐛 Bug Fixes

* add AUTH_LOGOUT_ROUTE_ENABLED feature flag ([d2f9eb4](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/d2f9eb4ba9ef6407ef9c9bed39b3e97e3374bd0f))

## [2.39.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.39.0%0D2.38.1) (2022-03-09)


### ✨ Features

* **AD-2147:** add school and class csv templates ([8ee9c45](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/8ee9c4531f97752c0cf0de155d4f7b110a74e4f8)), closes [AD-2147](https://calmisland.atlassian.net/browse/AD-2147)

### [2.38.1](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.38.1%0D2.38.0) (2022-03-08)


### 📦 Refactor

* rename folders so we don't have mixing upper and lower cases on student ([ec0623e](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/ec0623ea3d3066f8342bf905f95af16fa76ea523))


### 🐛 Bug Fixes

* added missing translation key to ClassRoster table ([effc14e](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/effc14eb9f3c67f706293796a5b43faf1a4006e1))
* lock ([6403341](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/6403341824fb8e8887b4f739b2d38613c891a0e8))
* wrong dropdown values in program edit/create fixed ([c8b8d96](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/c8b8d96cfd16fa8ac70097021fc24e4973d25bdd)), closes [fix/AD-2194](https://calmisland.atlassian.net/browse/AD-2194) [Fix/AD-2194](https://calmisland.atlassian.net/browse/AD-2194)

## [2.38.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.38.0%0D2.37.0) (2022-03-04)


### ✨ Features

* add adaptive learning student widget ([432caf1](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/432caf135c4f563aed9e536f594da06bb6b58915)), closes [DT-546](https://calmisland.atlassian.net/browse/DT-546)

## [2.37.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.37.0%0D2.36.0) (2022-03-04)


### 🐛 Bug Fixes

* editing org branding showing current org values ([78c4ebd](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/78c4ebd9e802705a029e239b88873cb445265e36)), closes [AD-2180](https://calmisland.atlassian.net/browse/AD-2180)


### ✨ Features

* **lokalise:** add classes_classCreatedMessage ([d6a353b](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/d6a353bd9d1f2893491e729553718ad3c42df9d6))

## [2.36.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.36.0%0D2.35.4) (2022-03-03)


### ✨ Features

* remove age ranges filters from age ranges table ([4f16996](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/4f16996591691399a9fbddccd924c484bb3d60b0)), closes [AD-1885](https://calmisland.atlassian.net/browse/AD-1885)


### 🐛 Bug Fixes

* wrong homepage being loaded ([3cac6e3](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/3cac6e34dad1dc3a3da625560c4aab160483a3e9)), closes [fix/DT-711](https://calmisland.atlassian.net/browse/DT-711) [Fix/DT-711](https://calmisland.atlassian.net/browse/DT-711)

### [2.35.4](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.35.4%0D2.35.3) (2022-03-02)

### [2.35.3](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.35.3%0D2.35.2) (2022-03-02)

### [2.35.2](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.35.2%0D2.35.1) (2022-03-01)

### [2.35.1](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.35.1%0D2.35.0) (2022-02-25)


### 🐛 Bug Fixes

* comment out the marked as inactive and reactivate buttons ([d863e80](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/d863e80345d7313ed46a316fe0f647922f214777))

## [2.35.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.35.0%0D2.34.1) (2022-02-25)


### ✨ Features

* adding school validation if non org admin ([73e88f2](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/73e88f248b4822d2d31b6747350abe461f32423a)), closes [AD-2023](https://calmisland.atlassian.net/browse/AD-2023)
* family name as persistent column in class roster ([8dc2209](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/8dc22094b7c35d6b5a008e43c45c8a2a784cce9f)), closes [AD-1627](https://calmisland.atlassian.net/browse/AD-1627)


### 📦 Refactor

* change program edit flow, required some refactors ([a017fa1](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/a017fa118a1b77bb6ec7c185cbe2228a40e65525)), closes [feature/AD-2041](https://calmisland.atlassian.net/browse/AD-2041) [Feature/AD-2041](https://calmisland.atlassian.net/browse/AD-2041)


### 🐛 Bug Fixes

* **mobile:** move appbar behind navigation drawer ([ba89c87](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/ba89c873699be650cf73b4e83ec57930c5be5c26))
* organization tables name column blocked ([60b55f1](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/60b55f158d9d2c6696952aa472828bf5bf62792a)), closes [AD-1629](https://calmisland.atlassian.net/browse/AD-1629) [AD-1629](https://calmisland.atlassian.net/browse/AD-1629) [AD-1629](https://calmisland.atlassian.net/browse/AD-1629)

### [2.34.1](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.34.1%0D2.34.0) (2022-02-24)


### 🐛 Bug Fixes

* student attendance widget size (mobile) ([d4ad55d](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/d4ad55d07949140a28501d05b01962b814629cfd)), closes [fix/DT-699](https://calmisland.atlassian.net/browse/DT-699)

## [2.34.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.34.0%0D2.33.0) (2022-02-23)


### 📦 Refactor

* replacing query in subjects filter ([11fba96](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/11fba96333f582bd24a7e03f2eeff2cab3a82787)), closes [AD-1660](https://calmisland.atlassian.net/browse/AD-1660)


### 🐛 Bug Fixes

* align percentage in student completion widget ([df542dd](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/df542dd49c7d32f719aa3904da1eb79c7aee15d2)), closes [fix/DT-684](https://calmisland.atlassian.net/browse/DT-684)
* remove wrong and unneeded format from student next class widget ([77863e2](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/77863e2c225ea3b5ac101fc9e9c34a4aab73693c))


### ✨ Features

* reusable functionality implemented for optional suffix on translating ([e92d8be](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/e92d8be7ed962b4fe05783c1519e5737f9a2aced))
* set school edit to first step, fixed bug that appeared with required field ([8b92bdc](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/8b92bdc4ce90ca6cb9d353ca0369237ce028590e)), closes [feature/AD-2040](https://calmisland.atlassian.net/browse/AD-2040)

## [2.33.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.33.0%0D2.32.0) (2022-02-22)


### 🐛 Bug Fixes

* add percentage sign inside brakets ([c0d0be3](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/c0d0be392ce8c2b1220253a5331a77d25da73cb7)), closes [fix/DT-666](https://calmisland.atlassian.net/browse/DT-666)
* make all translations fit join now button ([6333a35](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/6333a35597d0671e811731255b3bb2bfc1bfe075))
* student widget expand/collapse sidebar resize ([433e284](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/433e28480ac54283e55d1dad5122aeb3e6abb6f1)), closes [fix/DT-655](https://calmisland.atlassian.net/browse/DT-655) [fix/DT-655](https://calmisland.atlassian.net/browse/DT-655) [fix/DT-655](https://calmisland.atlassian.net/browse/DT-655)
* use translation key in student schedule ([c3e979e](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/c3e979e214a8be389443caabffbbc269bb389dc6))
* **widgets:** teacher feedback names switched to intl keys ([86a569d](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/86a569d2971c81f4a5a0c0d4868a8ad7990a86da))


### ✨ Features

* separated permission checks for new envs to manage student and teacher views separately ([e07e6ef](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/e07e6effe21793179a17e4e33d83ccb8709324f1))

## [2.32.0](https://bitbucket.org/calmisland/kidsloop-hub-frontend/branches/compare/2.32.0%0D2.31.0) (2022-02-18)


### 🐛 Bug Fixes

* fix planSelection autocomplete. Remove the autocompletes as they are unused ([709f5ff](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/709f5ffd0597f2b443920e4cee54f5b396eef4c6))
* **widgets:** updated urls for achievement and attendance widgets ([866afe8](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/866afe80bb97e2a3aedc1628378cecbaeef288b4))


### ✨ Features

* added student schedule component ([4dbc93e](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/4dbc93ebb3da019bfd540a7f900a4f02699b9908))
* lock name column in schools table ([58b874a](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/58b874a8f6b168e6b3ee21748bf7773c843c2d36)), closes [AD-1628](https://calmisland.atlassian.net/browse/AD-1628)
* migrated get roles query to rolesConnection ([7c07794](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/7c077943746f4d310ca8280ea809aa1fce54109a)), closes [AD-1921](https://calmisland.atlassian.net/browse/AD-1921) [AD-1921](https://calmisland.atlassian.net/browse/AD-1921)
* migrated get roles query to rolesConnection ([d4cfb05](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/d4cfb052ad6d89a0a37348fd413d121bc964db7f)), closes [AD-1921](https://calmisland.atlassian.net/browse/AD-1921) [AD-1921](https://calmisland.atlassian.net/browse/AD-1921)
* show mock last updated date for mock student view ([20cae68](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/20cae68f92005cca721e3e02ad16c0f3bceafbed)), closes [feature/DT-516](https://calmisland.atlassian.net/browse/DT-516)
* **student-widgets:** added student permissions and widgets ([5df705b](https://bitbucket.org/calmisland/kidsloop-hub-frontend/commits/5df705b2b7110d8c02dcfe6c75f172df2524fd16)), closes [DT-517](https://calmisland.atlassian.net/browse/DT-517) [DT-517](https://calmisland.atlassian.net/browse/DT-517)

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
