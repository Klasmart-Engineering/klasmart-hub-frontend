// cn.ts
const messages: Record<string, string> = {
    ERROR_ACCOUNT_BANNED: `账号已被禁用`,
    ERROR_ALREADY_VERIFIED: `账号已通过验证`,
    ERROR_INPUT_INVALID_FORMAT: `格式不正确`,
    ERROR_INPUT_TOO_LONG: `太长`,
    ERROR_INPUT_TOO_SHORT: `太短`,
    ERROR_INVALID_LOGIN: `无效登录`,
    ERROR_INVALID_PASSWORD: `无效的密码`,
    ERROR_INVALID_VERIFICATION_CODE: `无效的验证码`,
    ERROR_MOCK: `Rest API 模拟数据错误`,
    ERROR_UNKOWN: `发生未知错误`,
    ERROR_VERIFICATION_NOT_FOUND: `验证码未找到`,
    ERROR_FUNCTION_NOT_FOUND: `未知请求`,

    auth_successPrompt: `登录成功`,
    auth_failedPrompt: `登录失败`,

    signup_signupPrompt: `注册`,
    signup_signedUpAlready: `已有账号？`,
    signup_signupButton: `注册`,
    signupInvite_signupPrompt: `欢迎加入{organization}，{name}`,
    signupInvite_mistake: `如果你认为这是一个误发的邀请`,
    signupInvite_click: `点击这里`,

    password_forgotPrompt: `恢复账号`,
    password_forgotRecover: `恢复`,
    password_forgotBack: `返回`,
    password_restorePrompt: `重置密码`,
    password_confirmRestore: `设置新密码`,
    password_changePrompt: `更改密码`,
    password_confirmChange: `确认密码`,
    password_changedPrompt: `密码更改成功`,
    password_changedConfirm: `前往数据面板`,

    verify_emailPrompt: `验证邮箱`,
    verify_emailDirections: `验证码已发送至邮箱，请查看`,
    verify_emailCode: `输入验证码`,
    verify_emailSuccess: `邮箱已通过验证`,

    verify_invitePrompt: `是否已有邀请码？`,
    verify_inviteDirections: `如有，请输入相应邀请码`,
    verify_inviteCode: `输入邀请码`,
    verify_inviteSkip: `没有邀请码`,

    verify_phonePrompt: `验证手机号`,
    verify_phoneDirections: `验证码已发送至手机，请查看`,
    verify_phoneCode: `输入验证码`,

    classSettings_classroomSettings: `班级设置`,

    component_switchDark: `深色`,
    component_switchLight: `浅色`,

    button_create: `新建`,
    button_continue: `继续`,
    button_continueSignUp: `继续注册`,

    form_emailLabel: `邮箱或手机`,
    form_nameLabel: `姓名`,
    form_passwordLabel: `密码`,
    form_passwordConfirmLabel: `确认密码`,
    form_newPasswordLabel: `新密码`,
    form_newPasswordConfirmLabel: `确认新密码`,
    form_passwordForgotEmailLabel: `输入你的密码或手机号`,
    form_newPasswordCodeLabel: `验证码`,
    form_currentPasswordLabel: `当前密码`,

    invited_successPrompt: `你已成功加入{organization}.`,
    invited_failedPrompt: `抱歉，出错了！`,

    locale_select: `选择语言`,
    locale_tooltip: `更换语言`,

    login_createAccount: `创建账号`,
    login_forgotPassword: `忘记密码？`,
    login_loginButton: `登录`,
    login_loginPrompt: `登录`,

    navMenu_adminConsoleLabel: `控制台`,
    navMenu_assessmentsLabel: `评估`,
    navMenu_scheduleLabel: `课表`,
    navMenu_libraryLabel: `内容`,
    navMenu_homeLabel: `首页`,
    navMenu_peopleLabel: `人员`,
    navMenu_reportLabel: `报表`,

    userSettings_profile: `个人档案`,
    userSettings_myAccount: `我的账号`,
    userSettings_signout: `退出登录`,

    privacy_helpLink: `帮助`,
    privacy_privacyLink: `隐私`,
    privacy_termsLink: `条款`,

    live_welcome: `欢迎来到KidsLoop！`,
    live_lessonPlanLabel: `教学计划`,
    live_lessonPlanSelect: `选择教学计划`,
    live_liveButton: `去上课`,
    live_featuredContent: `推荐内容`,

    header_viewOrg: `查看组织`,
    header_viewUsers: `查看用户`,
    header_viewGroups: `查看用户组`,
    header_viewSchools: `查看学校`,
    header_classes: `班级`,
    header_programs: `课程`,
    header_grades: `年级`,
    users_suffix: `Suffix`,
    users_firstName: `名`,
    users_lastName: `姓`,
    users_middleName: `Middle name`,
    users_birthDate: `生日`,
    users_groups: `用户组`,
    users_school: `学校`,
    users_avatar: `头像`,
    users_contactInfo: `联系方式`,
    users_createDate: `创建日期`,
    users_updateDate: `更新日期`,
    users_sendInvite: `邀请`,
    users_noRecords: `没有记录`,
    users_labelDisplayedRows: ``,
    users_labelRowsSelect: `行`,
    users_nextTooltip: `下一页`,
    users_previousTooltip: `上一页`,
    users_firstTooltip: `第一页`,
    users_lastTooltip: `最后一页`,
    users_exportTooltip: `导出`,
    users_uploadTooltip: `上传`,
    users_addTooltip: `添加`,
    users_searchPlaceholder: `搜索`,
    users_searchTooltip: `搜索`,
    users_exportCSVName: `导出CSV`,
    users_exportPDFName: `导出PDF`,
    users_firstNameRequiredValidation: `名是必填项`,
    users_firstNameInvalidValidation: `无效的名`,
    users_firstNameMaxValidation: `名最多支持10个字`,
    users_firstNameMinValidation: `名至少需要3个字`,
    users_middleNameInvalidValidation: `N/A`,
    users_middleNameMaxValidation: `N/A`,
    users_middleNameMinValidation: `N/A`,
    users_lastNameRequiredValidation: `姓是必填项`,
    users_lastNameInvalidValidation: `无效的姓`,
    users_lastNameMaxValidation: `姓最多支持10个字`,
    users_lastNameMinValidation: `姓至少需要3个字`,
    users_groupRequiredValidation: `用户组是必填项`,
    users_initialSchoolValue: `没有学校`,
    users_allSchoolsValue: `全部学校`,
    users_emailMaxValidation: `电子邮箱最多可输入30个字`,
    users_emailInvalidValidation: `无效的电子邮箱`,
    users_resendInviteButton: `重新邀请`,
    users_studentGroupOver18: `按此确认，此邮箱将被分配到18岁以上的学生组别`,
    users_okButton: `确定`,
    users_cancelButton: `取消`,
    users_invitationSent: `邀请已发送`,
    users_actionsDeleteTooltip: `删除选择的用户`,
    users_errorDisplay: `用户显示错误`,
    users_organizationRoles: `用户的组织角色`,
    allOrganization_myOrganizations: `我的组织`,
    allOrganization_organizationName: `组织名称`,
    allOrganization_roles: `角色`,
    allOrganization_phone: `手机号`,
    allOrganization_email: `电子邮箱`,
    allOrganization_actionsDeleteTooltip: `删除选择的组织`,
    allOrganization_actionsAddTooltip: `添加组织`,
    allOrganization_actionsEditTooltip: `编辑`,
    allOrganization_deleteRowTooltip: `删除`,
    allOrganization_changePasswordButton: `修改密码`,
    allOrganization_changeOwner: `修改管理员`,
    allOrganization_changeOwnerText: `请选择一个用户作为组织管理员`,
    allOrganization_searchPlaceholder: `搜索`,
    allOrganization_searchTooltip: `搜索`,
    allOrganization_joinedOrganizations: `加入的组织`,
    allOrganization_role: `角色`,
    allOrganization_noRecords: `没有记录`,
    allOrganization_labelDisplayedRows: `of`,
    allOrganization_labelRowsSelect: `行`,
    allOrganization_nextTooltip: `下一页`,
    allOrganization_previousTooltip: `上一页`,
    allOrganization_firstTooltip: `第一页`,
    allOrganization_lastTooltip: `最后一页`,
    allOrganization_nameRequiredValidation: `名称是必填行`,
    allOrganization_groupRequiredValidation: `用户组是必填项`,
    allOrganization_emailInvalidValidation: `无效的电子邮箱`,
    allOrganization_leaveOrganizationButton: `离开组织`,
    allOrganization_leaveOrganizationConfirm: `确定要离开组织吗？`,
    allOrganization_okButton: `确定`,
    allOrganization_cancelButton: `取消`,
    allOrganization_userLabel: `用户`,
    allOrganization_leftOrganizationMessage: `您已经离开了组织`,
    joinedOrganization_email: `组织所有者邮箱`,
    joinedOrganization_role: `你的角色`,
    addOrganization_errorDisplay: `显示组织错误`,
    addOrganization_nameOfOrganizationLabel: `组织名称`,
    addOrganization_addressLabel: `地址`,
    addOrganization_phoneNumberLabel: `手机号`,
    addOrganization_emailAddressLabel: `电子邮箱`,
    addOrganization_primaryContactLabel: `主要联系方式`,
    addOrganization_organizationShortCodeLabel: `组织短代码`,
    addOrganization_addOrganizationLogoLabel: `添加组织徽标`,
    addOrganization_organizationColorLabel: `组织颜色`,
    addOrganization_saveButtonLabel: `保存`,
    addOrganization_cancelButtonLabel: `取消`,
    addOrganization_nameOfOrganizationPlaceholder: `组织正式名称`,
    addOrganization_addressPlaceholder: `组织地址`,
    addOrganization_emailAddressPlaceholder: `组织电子邮箱`,
    addOrganization_organizationShortCodePlaceholder: `组织短代码`,
    addOrganization_organizationNameRequiredValidation: `组织名称是必填项`,
    addOrganization_organizationNameInvalidValidation: `无效的组织名称`,
    addOrganization_organizationNameMaxValidation: `组织名称最多支持30个字`,
    addOrganization_organizationNameMinValidation: `组织名称至少需要5个字`,
    addOrganization_addressRequiredValidation: `地址是必填项`,
    addOrganization_addressInvalidValidation: `无效的地址`,
    addOrganization_addressMaxValidation: `地址最多支持30个字`,
    addOrganization_addressMinValidation: `地址至少需要10个字`,
    addOrganization_address2InvalidValidation: `无效的备用地址`,
    addOrganization_address2MaxValidation: `备用地址最多支持30个字`,
    addOrganization_address2MinValidation: `备用地址至少需要10个字`,
    addOrganization_phoneNumberRequiredValidation: `手机号是必填项`,
    addOrganization_phoneNumberMaxValidation: `手机号最多支持15位`,
    addOrganization_phoneNumberMinValidation: `手机号至少需要10位`,
    addOrganization_emailAddressRequiredValidation: `电子邮箱是必填项`,
    addOrganization_emailAddressMaxValidation: `电子邮箱最多支持30个字`,
    addOrganization_emailAddressInvalidValidation: `无效的电子邮箱`,
    addOrganization_primaryContactRequiredValidation: `联系方式是必填项`,
    addOrganization_organizationShortCodeRequiredValidation: `组织名称有效时才会生成组织短代码`,
    addOrganization_organizationShortCodeInvalidValidation: `无效的短代码`,
    addOrganization_organizationLogoRequiredValidation: `组织徽标是必填项`,
    addOrganization_saveErrorMesssage: `保存失败`,
    groups_groupNameTitle: `用户组名称`,
    groups_groupNameRequiredValidation: `用户组名称是必填项`,
    groups_groupNameInvalidValidation: `无效的用户组名称`,
    groups_roleTitle: `角色`,
    groups_roleRequiredValidation: `角色是必填项`,
    groups_colorTitle: `颜色`,
    groups_addTooltip: `添加`,
    groups_searchPlaceholder: `搜索`,
    groups_searchTooltip: `搜索`,
    groups_actionsDeleteTooltip: `删除选择的学校`,
    groups_deleteRowTooltip: `删除`,
    groups_editRowTooltip: `编辑`,
    groups_saveRowTooltip: `保存`,
    groups_cancelSaveRowTooltip: `取消`,
    groups_deleteRowText: `确定要删除这一行吗？`,
    groups_noRecords: `没有记录`,
    groups_labelDisplayedRows: `of`,
    groups_labelRowsSelect: `行`,
    groups_nextTooltip: `下一页`,
    groups_previousTooltip: `上一页`,
    groups_firstTooltip: `第一页`,
    groups_lastTooltip: `最后一页`,
    groups_errorDisplay: `显示用户组错误，请先选择组织`,
    schools_schoolNameTitle: `学校名称`,
    schools_addressTitle: `地址`,
    schools_phoneTitle: `手机号`,
    schools_emailTitle: `电子邮箱`,
    schools_contactNameTitle: `联系人`,
    schools_startDateTitle: `开始日期`,
    schools_endDateTitle: `结束日期`,
    schools_gradesTitle: `年级`,
    schools_schoolLogoTitle: `校徽`,
    schools_colorTitle: `颜色`,
    schools_actionsDeleteTooltip: `删除选择的学校`,
    schools_exportTooltip: `导出`,
    schools_uploadTooltip: `上传`,
    schools_addTooltip: `添加`,
    schools_searchPlaceholder: `搜索`,
    schools_searchTooltip: `搜索`,
    schools_exportCSVName: `导出CSV`,
    schools_exportPDFName: `导出PDF`,
    schools_noRecords: `没有记录`,
    schools_actionsEditTooltip: `编辑`,
    schools_deleteRowTooltip: `删除`,
    schools_editRowTooltip: `编辑`,
    schools_saveButtonLabel: `保存`,
    schools_cancelButtonLabel: `取消`,
    schools_saveRowTooltip: `保存`,
    schools_cancelSaveRowTooltip: `取消`,
    schools_deleteRowText: `确定要删除这一行吗？`,
    schools_addProgramButton: `添加课程`,
    schools_nameRequiredValidation: `名称是必填项`,
    schools_nameInvalidValidation: `无效的名称`,
    schools_addressRequiredValidation: `地址是必填项`,
    schools_addressInvalidValidation: `无效的地址`,
    schools_phoneRequiredValidation: `手机号是必填项`,
    schools_emailRequiredValidation: `电子邮箱是必填项`,
    schools_emailInvalidValidation: `无效的电子邮箱`,
    schools_contactNameRequiredValidation: `联系人名称是必填项`,
    schools_labelDisplayedRows: `of`,
    schools_labelRowsSelect: `行`,
    schools_nextTooltip: `下一页`,
    schools_previousTooltip: `上一页`,
    schools_firstTooltip: `第一页`,
    schools_lastTooltip: `最后一页`,
    schools_errorDisplay: `显示学校错误，请先选择组织`,
    schools_savedUsersError: `显示用户错误，请先选择组织`,
    school_saveSuccessfulMessage: `成功创建学校`,
    school_saveFailMessage: `发生错误，请再试一次`,
    classes_classTitle: `班级`,
    classes_statusTitle: `状态`,
    classes_programTitle: `课程`,
    classes_schoolTitle: `学校`,
    classes_subjectTitle: `学科`,
    classes_gradesTitle: `年级`,
    classes_startDateTitle: `开始日期`,
    classes_endDateTitle: `结束日期`,
    classes_createDateTitle: `创建日期`,
    classes_colorTitle: `颜色`,
    classes_noRecords: `没有记录`,
    classes_actionsEditTooltip: `编辑`,
    classes_deleteRowTooltip: `删除`,
    classes_editRowTooltip: `编辑`,
    classes_addTooltip: `添加`,
    classes_saveRowTooltip: `保存`,
    classes_cancelSaveRowTooltip: `取消`,
    classes_deleteRowText: `确定要删除这一行吗？`,
    classes_actionsDeleteTooltip: `删除选择的班级`,
    classes_searchPlaceholder: `搜索`,
    classes_searchTooltip: `搜索`,
    classes_classRequiredValidation: `班级名称是必填项`,
    classes_classInvalidValidation: `无效的班级名称`,
    classes_statusRequiredValidation: `状态是必填项`,
    classes_programRequiredValidation: `课程是必填项`,
    classes_schoolRequiredValidation: `学校是必填项`,
    classes_subjectRequiredValidation: `学科是必填项`,
    classes_gradesRequiredValidation: `年级是必填项`,
    classes_startDateRequiredValidation: `开始日期是必填项`,
    classes_endDateRequiredValidation: `结束日期是必填项`,
    classes_classRosterButton: `添加学生/老师`,
    classes_exportCSVName: `导出CSV`,
    classes_exportPDFName: `导出PDF`,
    classes_exportTooltip: `导出`,
    classes_uploadTooltip: `上传`,
    classes_labelDisplayedRows: `of`,
    classes_labelRowsSelect: `行`,
    classes_nextTooltip: `下一页`,
    classes_previousTooltip: `上一页`,
    classes_firstTooltip: `第一页`,
    classes_lastTooltip: `最后一页`,
    classes_errorDisplay: `显示班级错误，请先选择组织`,
    classes_savedSchoolsError: `显示学校错误，请先选择组织`,
    classes_classSavedMessage: `成功创建班级`,
    classes_classSaveError: `发生错误，请再试一次`,
    classes_classDeletedMessage: `Class has been deleted successfully`,
    classes_classDeletedError: `Sorry, something went wrong, please try again`,
    programs_programTitle: `课程`,
    programs_subjectTitle: `学科`,
    programs_gradeTitle: `年级`,
    programs_colorTitle: `颜色`,
    programs_addCommentButton: `添加备注`,
    programs_viewProgramDetailsButton: `课程详情`,
    programs_actionsDeleteTooltip: `删除选择的课程`,
    programs_uploadTooltip: `上传`,
    programs_exportCSVName: `导出CSV`,
    programs_exportPDFName: `导出PDF`,
    programs_exportTooltip: `导出`,
    programs_searchPlaceholder: `搜索`,
    programs_searchTooltip: `搜索`,
    programs_noRecords: `没有记录`,
    programs_deleteRowTooltip: `删除`,
    programs_editRowTooltip: `编辑`,
    programs_addTooltip: `添加`,
    programs_saveRowTooltip: `保存`,
    programs_cancelSaveRowTooltip: `取消`,
    programs_deleteRowText: `确定要删除这一行吗？`,
    programs_programRequiredValidation: `课程是必填项`,
    programs_programInvalidValidation: `无效的课程`,
    programs_labelDisplayedRows: `of`,
    programs_labelRowsSelect: `行`,
    programs_nextTooltip: `下一页`,
    programs_previousTooltip: `上一页`,
    programs_firstTooltip: `第一页`,
    programs_lastTooltip: `最后一页`,
    programs_schoolLabel: `学校`,
    grades_gradeTitle: `年级`,
    grades_ageRangeTitle: `年龄`,
    grades_colorTitle: `颜色`,
    grades_programsTitle: `课程`,
    grades_progressToTitle: `进度`,
    grades_labelDisplayedRows: `of`,
    grades_labelRowsSelect: `行`,
    grades_nextTooltip: `下一页`,
    grades_previousTooltip: `上一页`,
    grades_firstTooltip: `第一页`,
    grades_lastTooltip: `最后一页`,
    grades_exportTooltip: `导出`,
    grades_uploadTooltip: `上传`,
    grades_addTooltip: `添加`,
    grades_searchPlaceholder: `搜索`,
    grades_searchTooltip: `搜索`,
    grades_exportCSVName: `导出CSV`,
    grades_exportPDFName: `导出PDF`,
    grades_noRecords: `没有记录`,
    grades_deleteRowTooltip: `删除`,
    grades_editRowTooltip: `编辑`,
    grades_saveRowTooltip: `保存`,
    grades_cancelSaveRowTooltip: `取消`,
    grades_deleteRowText: `确定要删除这一行吗？`,
    grades_actionsDeleteTooltip: `删除选择的年级`,
    navMenu_superOrganization: `Super Organization`, // TODO (Henrik): confirm
    navMenu_superOrganizationDescription: `Super Organization Description`, // TODO (Henrik): confirm
    navMenu_superContentLibrary: `Global Library`, // TODO (Henrik): confirm
    navMenu_superContentLibraryDescription: `A library of all organizations' lesson material`, // TODO (Henrik): confirm
    navMenu_accounts: `Accounts`, // TODO (Henrik): confirm
    navMenu_accountsDescription: `A list of user accounts`, // TODO (Henrik): confirm
    navMenu_superBilling: `Super Billing`, // TODO (Henrik): confirm
    navMenu_superBillingDescription: `It's like billing, but super!`, // TODO (Henrik): confirm
    navMenu_metricsAndReport: `Metrics and Report`, // TODO (Henrik): confirm
    navMenu_metricsAndReportDescription: `It's the same as the one below, but super!`, // TODO (Henrik): confirm
    navMenu_home: `Home`,
    navMenu_homeDescription: `There is no place like home`,
    navMenu_analyticsAndReportsTitle: `分析与报表`,
    navMenu_analyticsAndReportsDescription: `查看组织的使用情况`,
    navMenu_assessmentsTitle: `学习评估`,
    navMenu_assessmentsDescription: `View and edit your assessments`,
    navMenu_billingTitle: `账单`,
    navMenu_billingDescription: `管理账单与订阅`,
    navMenu_contentLibraryTitle: `内容`,
    navMenu_contentLibraryDescription: `管理和查看内容`,
    navMenu_dataSecurityTitle: `数据安全与迁移`,
    navMenu_dataSecurityDescription: `数据使用情况`,
    navMenu_devicesTitle: `设备与许可证`,
    navMenu_devicesDescription: `组织的设备与许可证`,
    navMenu_groupsTitle: `用户组`,
    navMenu_groupsDescription: `添加/管理用户组`,
    navMenu_organizationTitle: `组织档案`,
    navMenu_organizationDescription: `管理组织`,
    navMenu_securityTitle: `安全`,
    navMenu_securityDescription: `安全设置`,
    navMenu_schoolsTitle: `学校与资源`,
    navMenu_schoolsDescription: `管理学校与资源`,
    navMenu_scheduleTitle: `课表`,
    navMenu_scheduleDescription: `Manage your schedules and join upcoming classes`,
    navMenu_supportTitle: `支持`,
    navMenu_supportDescription: `入职，培训和故障排除支持`,
    navMenu_usersTitle: `用户`,
    navMenu_usersDescription: `管理用户与权限`,
    navMenu_futureRelease: `未来版本计划中`,
    classRoster_nameTitle: `名称`,
    classRoster_groupTitle: `用户组`,
    classRoster_actionsDeleteTooltip: `删除选择的学生`,
    classRoster_actionsUploadTooltip: `上传`,
    classRoster_userAddedMessage: `添加用户到班级`,
    classRoster_userAddedError: `发生错误，请再试一次`,
    classRoster_userRemovedMessage: `User removed from class`,
    classRoster_userRemovedError: `Sorry, something went wrong, please try again`,
    classRoster_noRecords: `没有记录`,
    classRoster_actionsEditTooltip: `编辑`,
    classRoster_deleteRowTooltip: `删除`,
    classRoster_editRowTooltip: `编辑`,
    classRoster_addTooltip: `添加`,
    classRoster_saveRowTooltip: `保存`,
    classRoster_cancelSaveRowTooltip: `取消`,
    classRoster_deleteRowText: `确定要删除这一行吗？`,
    classRoster_searchPlaceholder: `搜索`,
    classRoster_searchTooltip: `搜索`,
    classRoster_exportCSVName: `导出CSV`,
    classRoster_exportPDFName: `导出PDF`,
    classRoster_exportTooltip: `导出`,
    classRoster_uploadTooltip: `上传`,
    classRoster_labelDisplayedRows: `of`,
    classRoster_labelRowsSelect: `行`,
    classRoster_nextTooltip: `下一页`,
    classRoster_previousTooltip: `上一页`,
    classRoster_firstTooltip: `第一页`,
    classRoster_lastTooltip: `最后一页`,
    home_welcomeLabel: `欢迎，{userName}!`,
    usageInfo_title: `Statistics`,
    usageInfo_onlineClasses: `在线课堂`,
    usageInfo_offlineClasses: `线下课堂`,
    usageInfo_homework: `家庭作业`,
    usageInfo_attendedAmount: `{amount}已参加`,
    usageInfo_completedAmount: `{amount}已完成`,
    planSelection_title: `Try a lesson plan`,
    planSelection_selectPlanLabel: `选择一个教学计划`,
    planSelection_planNotAvailableLabel: `No lesson plans available`,
    planSelection_viewLibraryLabel: `查看你的资源库`,
    scheduleInfo_scheduleClassesLabel: `你有{scheduledClassAmount}个已预定的课程`,
    scheduleInfo_seeScheduleLabel: `查看你的课表`,
    assessment_noNewUpdatesLabel: `你没有新的更新`,
    assessment_assessmentsTitle: `学习评估`,
    assessment_viewAssessmentsLabel: `View Your Assessments`,
    assessment_viewAsChart: `View as chart`,
    assessment_viewAsList: `View as list`,
    assessment_assessmentsRequireAttention: `You have {currentAmount} of {totalAmount} assessments that require
your attention.`,
    assessment_chartInProgress: `in progress`,
    assessment_chartCompleted: `completed`,
    dialogAppBar_organizationsTitle: `组织信息`,
    adminHeader_viewOrg: `查看组织`,
    adminHeader_viewUsers: `查看用户`,
    adminHeader_viewRoles: `查看角色`,
    adminHeader_viewSchools: `查看学校`,
    adminHeader_viewClasses: `班级`,
    adminHeader_viewPrograms: `课程`,
    adminHeader_viewGrades: `年级`,
    users_name: `名字`,
    users_activeStatus: `活跃`,
    users_inactiveStatus: `非活跃`,
    users_joinDate: `加入时间`,
    users_createUser: `创建用户`,
    roles_title: `角色`,
    roles_typeOrganizationAdmin: `组织管理员`,
    roles_typeParent: `家长`,
    roles_typeSchoolAdmin: `学校管理员`,
    roles_typeStudent: `学生`,
    roles_typeTeacher: `老师`,
    roles_rowsPerPageLabel: `每页显示行数`,
    schools_createSchoolLabel: `创建学校`,
    classes_createClassLabel: `创建班级`,
    organizations_createButton: `创建`,
    organizations_searchPlaceholder: `搜索`,
    organizations_statusLabel: `状态`,

    nextClass_title: `Your next live class is`,
    nextClass_alreadyStarted: `Class already started`,
    nextClass_startsSoon: `Class starts soon`,
    nextClass_teachersTitle: `{count, plural, =0 {No teacher} one {Teacher} other {Teachers}}`,
    nextClass_noClass: `You don't have any upcoming live class scheduled!`,

    yourClasses_title: `Your classes`,
    yourClasses_noClass: `You don't have any class yet`,

    scheduleInfo_title: `Your schedule (14 days)`,
    scheduleInfo_noClasses: `你没有任何即将到来的课程安排!`,
    scheduleInfo_live: `直播`,
    scheduleInfo_study: `Study`,
    scheduleInfo_task: `Task`,

    groups_rowsPerPage: `每页显示行数`,
    groups_fromToMaxCount: `{from} to {to}`,
    groups_allResults: `全部`,
    groups_addColumnsButton: `添加列`,
    groups_hideButton: `隐藏`,
    groups_noData: `没有数据`,
    groups_allGroupsPages: ``,
    groups_allPages: `全部页面`,
    groups_thisPage: `当前页面`,
    groups_none: ``,
    groups_groupBy: ``,
    groups_rowMoreActions: `更多操作`,
    groups_selectColumnsTitle: `选择列`,
    users_superAdminRole: `超级管理员`,
    users_organizationAdminRole: `组织管理员`,
    users_schoolAdminRole: `学校管理员`,
    users_parentRole: `家长`,
    users_studentRole: `学生`,
    users_teacherRole: `老师`,
    editDialog_delete: `删除`,
    editDialog_cancel: `取消`,
    editDialog_save: `保存`,
    editDialog_savedSuccess: `用户保存成功`,
    editDialog_savedError: `抱歉，出了点问题，请重试`,
    editDialog_deleteSuccess: `用户删除成功`,
    editDialog_deleteError: `抱歉，出了点问题，请重试`,
    editDialog_deleteConfirm: `确定要删除 {userName} 用户吗？`,
    createUser_title: `创建用户`,
    createUser_cancel: `取消`,
    createUser_create: `创建`,
    createUser_success: `用户创建成功`,
    createUser_error: `抱歉，出了点问题，请重试`,
    createUser_givenNameLabel: `名`,
    createUser_familyNameLabel: `姓`,
    createUser_rolesLabel: `角色`,
    createUser_schoolsLabel: `学校（可选）`,
    createUser_contactInfoLabel: `联系方式`,
    createUser_roleRequired: `至少需要一个角色`,
    createUser_invalidEmail: `无效的邮件地址`,
    createUser_invalidPhone: `无效的电话号码`,
    createUser_emailPhoneRequired: `需提供电子邮件或电话号码`,

    users_SuperAdmin: `超级管理员`,
    users_OrganizationAdmin: `组织管理员`,
    users_SchoolAdmin: `学校管理员`,
    users_Parent: `家长`,
    users_Student: `学生`,
    users_Teacher: `老师`,
    users_selectAll: `全选`,
    users_editButton: `编辑`,
    users_deleteButton: `删除`,

    planSelection_noOptionsLabel: `没有选项`,

    navbar_OrganizationsTab: `组织`,
    navbar_UsersTab: `用户`,
    navbar_RolesTab: `角色`,
    navbar_SchoolsTab: `学校`,
    navbar_ClassesTab: `班级`,
    navbar_organizationContentTab: `组织内容`,
    navbar_badanamuContentTab: `Badanamu内容`,

    roles_roleDescription: `角色说明`,
    roles_type: `类型`,
    roles_createRole: `创建`,
    roles_editButton: `编辑`,
    roles_deleteButton: `删除`,
    roles_roleInfoStep: `角色信息`,
    roles_setPermissionsStep: `设置权限`,
    roles_confirmRoleStep: `确认角色`,
    roles_confirmNewRoleTitle: `是否新建角色？`,
    roles_confirmNewRoleContent: `将在本组织中创建一个新角色`,
    roles_confirmNewRoleLabel: `创建`,
    roles_confirmSuccess: `新角色创建成功`,
    roles_confirmError: `抱歉，出了点问题，请重试`,

    rolesInfoCard_title: `角色信息`,
    rolesInfoCard_fetchingLabel: `获取权限`,
    rolesInfoCard_nameFieldLabel: `名称*`,
    rolesInfoCard_descriptionFieldLabel: `描述`,
    rolesInfoCard_requiredFieldLabel: `必填项*`,
    rolesInfoCard_roleEmpty: `角色名称不能为空`,
    rolesInfoCard_minChar: `角色名称至少有两位字符`,
    rolesInfoCard_maxChar: `角色名称不可超过20位字符`,
    rolesInfoCard_alphaNumeric: `仅字母数字字符有效`,
    rolesInfoCard_nameTaken: `该名称已被使用`,
    rolesInfoCard_descriptionMaxChar: `描述不可超过30位字符`,
    rolesInfoCard_descriptionAlphanumeric: `仅字母数字字符有效`,
    rolesInfoCard_clearLabel: `清除`,
    rolesInfoCard_resetLabel: `重置`,
    rolesInfoCard_copyLabel: `从...复制角色`,
    rolesInfoCard_createNewRoleLabel: `正在创建新角色`,
    rolesInfoCard_finishLabel: `角色创建已完成`,
    rolesInfoCard_continueButton: `继续`,
    rolesInfoCard_finishButton: `完成`,
    rolesInfoCard_actionsTitle: `操作`,
    rolesInfoCard_backButton: `返回`,

    schools_editButton: `编辑`,
    schools_deleteButton: `删除`,

    allOrganization_leaveOrganizationLabel: `退出选定组织`,
    allOrganization_leftOrganizationSuccess: `成功退出该组织`,
    allOrganization_leftOrganizationError: `退出组织发生了错误`,
    allOrganization_editButton: `编辑`,
    allOrganization_deleteButton: `删除`,
    allOrganization_deleteConfirmLabel: `是否确定删除 {name}`,
    allOrganization_deleteSuccess: `成功删除组织`,
    allOrganization_deleteError: `删除组织发生了错误`,

    data_activeStatus: `活跃`,
    data_inactiveStatus: `非活跃`,

    schools_createTitle: `创建学校`,
    schools_nameLabel: `学校名称`,
    schools_requiredLabel: `必填`,
    schools_cancelLabel: `取消`,
    schools_createLabel: `创建`,
    schools_createdSuccess: `成功创建学校`,
    schools_createdError: `抱歉，出了点问题，请重试`,
    schools_required: `必填`,
    schools_alphanumeric: `仅字母数字字符有效`,
    schools_unique: `学校名称必须是唯一的`,
    schools_deleteSuccess: `成功删除学校`,
    schools_deleteError: `抱歉，出了点问题，请重试`,

    groups_rowMoreActions: `更多操作`,
    groups_selectColumnsTitle: `选择列`,

    class_createClass: `创建班级`,
    class_classLabel: `班级名称`,
    class_required: `班级名称不能为空`,
    class_alphanumeric: `仅字母数字字符有效`,
    class_unique: `班级名称必须是唯一的`,
    class_schoolsLabel: `学校（可选）`,
    class_cancel: `取消`,
    class_create: `创建`,
    class_confirmDelete: `是否确定要删除 {name}`,
    class_deleteRows: `是否要删除行 {rows}`,
    data_deleteRows: `是否要删除行 {rows}`,
    superAdmin_searchPlaceholder: `按文件夹名称、作者、作者ID和关键字搜索内容`,
    superAdmin_deleteLabel: `删除`,
    superAdmin_editLabel: `编辑`,
    superAdmin_moveLabel: `移动`,
    superAdmin_distributeLabel: `分享`,
    superAdmin_libraryLabel: `内容`,
    superAdmin_moveSelectedLabel: `移动已选定内容`,
    superAdmin_creatFolderLabel: `创建文件夹`,
    superAdmin_deleteSuccess: `成功删除内容`,
    superAdmin_deleteError: `抱歉，出了点问题，请重试`,
    superAdmin_deleteContentTitle: `删除内容`,
    superAdmin_deleteText: `是否确定删除 {name}`,
    superAdmin_type: `类型`,
    superAdmin_confirmDeletion: `确认删除`,
    superAdmin_authorIdLabel: `作者ID`,
    superAdmin_descriptionLabel: `描述`,
    superAdmin_keywordsLabel: `关键词`,
    superAdmin_publishStatusLabel: `发布状态`,
    superAdmin_createdLabel: `创建`,
    superAdmin_lastModifiedLabel: `最后一次修改`,
    superAdmin_contentTypeLabel: `内容类型`,
    superAdmin_authorNameLabel: `作者名称`,
    superAdmin_nameLabel: `名称`,
    superAdmin_contentFolderError: `抱歉，出了点问题`,

    ageRanges_idLabel: `ID`,
    ageRanges_ageRangeLabel: `年龄段`,
    ageRanges_deleteAgeRangeTitle: `删除年龄段`,
    ageRanges_deleteAgeRangeConfirm: `删除`,
    ageRanges_deleteText: `是否确定要删除 {ageRangeName}`,
    ageRanges_typeText: `类型`,
    ageRanges_typeEndText: `确认删除`,
    ageRanges_deleteSuccess: `年龄段已成功删除`,
    ageRanges_deleteError: `抱歉，发生了错误，请重试`,
    ageRanges_createAgeRangeLabel: `创建年龄段`,
    ageRanges_editLabel: `编辑`,
    ageRanges_deleteLabel: `删除`,
    ageRanges_title: `年龄段`,
    ageRanges_createSuccess: `年龄段创建成功`,
    ageRanges_createError: `抱歉，发生了错误，请重试`,
    ageRanges_cancelButton: `取消`,
    ageRanges_createButton: `创建`,
    ageRanges_saveButton: `保存`,
    ageRanges_formFrom: `从`,
    ageRanges_formTo: `到`,
    ageRanges_formFromUnit: `最小年龄单位`,
    ageRanges_formToUnit: `最大年龄单位`,
    ageRanges_formMonths: `月`,
    ageRanges_formYears: `年`,
    ageRanges_editSuccess: `年龄段保存成功`,
    ageRanges_formEditTitle: `编辑年龄段`,

    generic_deleteText: `是否确认要删除 {value}`,
    generic_typeText: `类型`,
    generic_typeEndText: `确认删除`,

    genericValidations_required: `必填项`,
    genericValidations_phoneInvalid: `有效手机号`,
    genericValidations_minChar: `最少输入 {min} 字符`,
    genericValidations_maxChar: `最多输入 {max} 字符`,
    genericValidations_emailInvalid: `有效邮箱地址`,
    genericValidations_equals: `数值不匹配`,
    genericValidations_alphanumeric: `该值不是字母数字`,

    grades_notSpecifiedLabel: `不指定`,
    grades_idLabel: `ID`,
    grades_nameLabel: `名称`,
    grades_progressFromLabel: `起始阶段`,
    grades_progressToLabel: `发展阶段`,
    grades_deleteGradePrompt: `删除年级`,
    grades_deleteConfirmButton: `删除年纪`,
    grades_deleteSuccess: `年纪删除成功`,
    grades_deleteError: `抱歉，发生了错误，请重试`,
    grades_createGradeLabel: `创建年级`,
    grades_editLabel: `编辑`,
    grades_deleteLabel: `删除`,
    grades_title: `年级`,

    generic_createError: `抱歉，发生了错误，请重试`,
    generic_saveLabel: `保存`,
    grades_cancelLabel: `取消`,
    grades_createGradeTitle: `创建年级`,
    grades_createLabel: `创建`,
    grades_createSuccess: `年级创建成功`,
    grades_deleteGradePromptTitle: `删除年级`,
    grades_editGradeTitle: `年级删除成功`,
    grades_editSuccess: `年级保存成功`,
    grades_editTitle: `编辑年级`,
    grades_gradeNameLabel: `年级名称`,

    library_cancelLabel: `取消`,
    library_createFolderSuccess: `文件夹创建成功`,
    library_createFolderTitle: `创建文件夹`,
    library_createLabel: `创建`,
    library_deleteContentedLabel: `删除内容`,
    library_deleteLabel: `删除`,
    library_deleteSuccess: `文件夹删除成功`,
    library_destinationTooltip: `分享至`,
    library_distributeEditSuccess: `分享设置更新成功`,
    library_distributeTooltip: `选择此选项将使当前和未来的组织可以使用所选内容。`,
    library_editSuccess: `文件夹保存成功`,
    library_editTitle: `编辑文件夹`,
    library_folderNameLabel: `文件夹名称`,
    library_moveError: `移动文件时发生错误，请重试`,
    library_moveLabel: `移动`,
    library_moveSuccess: `文件移动成功`,
    library_moveTooltip: `文件夹已被移动`,
    library_nameLabel: `名称`,
    library_phoneLabel: `电话`,
    library_selectOrganizationsLabel: `选择组织`,

    generic_idLabel: `ID`,
    programs_ageRanges: `年龄段`,
    programs_createLabel: `创建`,
    programs_createProgramLabel: `创建学科`,
    programs_deleteLabel: `删除`,
    programs_deleteProgramLabel: `删除学科`,
    programs_deleteSuccess: `学科删除成功`,
    programs_editLabel: `编辑`,
    programs_editProgramLabel: `编辑学科`,
    programs_grades: `年级`,
    programs_name: `名称`,
    programs_nextLabel: `下一个`,
    programs_previousLabel: `上一个`,
    programs_programNameLabel: `学科名称`,
    programs_programsInfoLabel: `学科信息`,
    programs_projectInfoLabel: `项目信息`,
    programs_saveLabel: `保存`,
    programs_subjects: `课程`,
    programs_summaryLabel: `概要`,
    programs_title: `学科`,
    programs_viewDetailsLabel: `查看详情`,

    class_addUserLabel: `添加用户`,
    class_ageRangeLabel: `年龄段 （可选）`,
    class_cancelLabel: `取消`,
    class_classNameLabel: `班级名称`,
    class_classRosterHeader: `班级成员`,
    class_classRosterLabel: `班级成员`,
    class_createClassTitle: `创建班级`,
    class_createLabel: `创建`,
    class_editLabel: `编辑`,
    class_editTitle: `编辑班级`,
    class_emailLabel: `邮箱`,
    class_gradeLabel: `年级（可选）`,
    class_phoneLabel: `手机号`,
    class_programLabel: `学科（可选）`,
    class_programsHeader: `学科`,
    class_removeConfirm: `移除`,
    class_removeUserLabel: `移出用户`,
    class_roleLabel: `角色`,
    class_schoolsLabel: `学校 （可选）`,
    class_searchPlaceholder: `通过名称，地址，邮箱和手机号搜索学生`,
    class_subjectsLabel: `课程（可选）`,
    class_tableStudents: `学生（{length}）`,
    class_tableSubjectsLabel: `课程`,
    class_tableTeachers: `老师 （{length}）`,
    class_usernameLabel: `用户名`,
    schools_addLabel: `添加`,
    schools_addUserTitle: `添加用户`,
    schools_ageRangesLabel: `年龄段`,
    schools_deleteConfrimLabel: `删除`,
    schools_deleteTitleLabel: `删除学校`,
    schools_emailLabel: `邮件`,
    schools_gradesLabel: `年级`,
    schools_phoneLabel: `手机号`,
    schools_programsLabel: `学科`,
    schools_roleLabel: `角色`,
    schools_schoolRosterLabel: `学校成员`,
    schools_searchPlaceholder: `通过名称，地址，邮箱和手机号搜索学生`,
    schools_shortCodeLabel: `代码`,
    schools_subjectsLabel: `课程`,
    schools_userNameLabel: `用户名`,
    schools_viewDetailsLabel: `查看班级详情`,

    navMenu_programsTitle: `Programs`,
    navMenu_classesTitle: `Classes`,
    navMenu_subjectsTitle: `Subjects`,
    navMenu_gradesTitle: `Grades`,
    navMenu_ageRangesTitle: `Age Ranges`,

    nextClass_title: `Your next live class is`,
    nextClass_alreadyStarted: `Class already started`,
    nextClass_startsSoon: `Class starts soon`,
    nextClass_teachersTitle: `{count, plural, =0 {No teacher} one {Teacher} other {Teachers}}`,
    nextClass_noClass: `You don't have any upcoming live class scheduled!`,
    yourClasses_title: `Your classes`,
    yourClasses_noClass: `You don't have any class yet`,
    scheduleInfo_title: `Your schedule (14 days)`,
    scheduleInfo_study: `Study`,
    scheduleInfo_task: `Task`,
    usageInfo_title: `Statistics`,
    usageInfo_totalCountLive: `Total of {total} live classes`,
    usageInfo_totalCountOffline: `Total of {total} offline classes`,
    usageInfo_totalCountHomework: `Total of {total} homework`,
    planSelection_title: `Try a lesson plan`,
    assessment_viewAssessmentsLabel: `View Your Assessments`,
    assessment_viewAsChart: `View as chart`,
    assessment_viewAsList: `View as list`,
    assessment_assessmentsRequireAttention: `You have {currentAmount} of {totalAmount} assessments that require
  your attention.`,
    assessment_chartInProgress: `in progress`,
    assessment_chartCompleted: `completed`,
};
export default messages;
