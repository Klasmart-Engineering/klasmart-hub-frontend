// ko.ts
const messages: Record<string, string> = {
    ERROR_ACCOUNT_BANNED: `차단된 계정입니다`,
    ERROR_ALREADY_VERIFIED: `이미 인증된 계정입니다`,
    ERROR_INPUT_INVALID_FORMAT: `이메일 혹은 휴대폰 번호 형식이 올바르지 않습니다`,
    ERROR_INPUT_TOO_LONG: `입력값이 너무 깁니다`,
    ERROR_INPUT_TOO_SHORT: `입력값이 너무 짧습니다`,
    ERROR_INVALID_LOGIN: `로그인 정보가 정확하지 않습니다`,
    ERROR_INVALID_PASSWORD: `비밀번호가 정확하지 않습니다`,
    ERROR_INVALID_VERIFICATION_CODE: `잘못된 인증 코드입니다`,
    ERROR_MOCK: `REST API로 인한 오류가 발생했습니다`,
    ERROR_UNKOWN: `예상치 못한 오류가 발생했습니다`,
    ERROR_VERIFICATION_NOT_FOUND: `인증 정보를 찾을 수 없습니다`,
    ERROR_FUNCTION_NOT_FOUND: `알 수 없는 요청입니다`,

    auth_successPrompt: `로그인에 성공했습니다`,
    auth_failedPrompt: `로그인에 실패했습니다`,

    signup_signupPrompt: `회원가입`,
    signup_signedUpAlready: `이미 계정이 있으신가요?`,
    signup_signupButton: `회원가입`,
    signupInvite_signupPrompt: `{name}, {organization}에 오신걸 환영합니다!`,
    signupInvite_mistake: `이 초대장을 실수로 발송 했다고 생각 된다면, `,
    signupInvite_click: `여기를 클릭하세요.`,

    password_forgotPrompt: `계정 복구`,
    password_forgotRecover: `복구`,
    password_forgotBack: `이전`,
    password_restorePrompt: `비밀번호 재설정`,
    password_confirmRestore: `새 비밀번호 설정`,
    password_changePrompt: `비밀번호 변경`,
    password_confirmChange: `비밀번호 확인`,
    password_changedPrompt: `비밀번호가 성공적으로 변경되었습니다`,
    password_changedConfirm: `대시보드로 이동하기`,

    verify_emailPrompt: `이메일 확인`,
    verify_emailDirections: `이메일에서 인증 코드를 확인하십시오.`,
    verify_emailCode: `인증 코드 입력`,
    verify_emailSuccess: `이메일이 인증되었습니다`,

    verify_invitePrompt: `초대 코드가 있습니까?`,
    verify_inviteDirections: `있다면, 아래에 초대 코드를 입력하십시오.`,
    verify_inviteCode: `초대 코드 입력`,
    verify_inviteSkip: `초대 코드가 없습니다.`,

    verify_phonePrompt: `휴대폰 번호 확인`,
    verify_phoneDirections: `휴대폰으로 전송 된 메시지에서 인증 코드를 확인하십시오.`,
    verify_phoneCode: `인증 코드 입력`,

    classSettings_classroomSettings: `교실 설정`,

    component_switchDark: `다크`,
    component_switchLight: `라이트`,

    button_create: `생성`,
    button_continue: `계속`,
    button_continueSignUp: `회원가입 계속`,

    form_emailLabel: `이메일 주소 / 휴대폰 번호`,
    form_nameLabel: `이름`,
    form_passwordLabel: `비밀번호`,
    form_passwordConfirmLabel: `비밀번호 확인`,
    form_newPasswordLabel: `새 비밀번호`,
    form_newPasswordConfirmLabel: `새 비밀번호 확인`,
    form_passwordForgotEmailLabel: `이메일 주소 혹은 휴대폰 번호 입력`,
    form_newPasswordCodeLabel: `인증 코드`,
    form_currentPasswordLabel: `현재 비밀번호`,

    invited_successPrompt: `성공적으로 {organization}에 가입했습니다.`,
    invited_failedPrompt: `이런, 알 수 없는 문제가 발생했습니다!`,

    locale_select: `언어 선택`,
    locale_tooltip: `언어 변경`,

    login_createAccount: `계정 생성`,
    login_forgotPassword: `비밀번호 찾기`,
    login_loginButton: `로그인`,
    login_loginPrompt: `로그인`,

    navMenu_adminConsoleLabel: `어드민 콘솔`,
    navMenu_assessmentsLabel: `평가`,
    navMenu_scheduleLabel: `스케줄 관리`,
    navMenu_libraryLabel: `라이브러리`,
    navMenu_liveLabel: `라이브`,
    navMenu_homeLabel: `홈`,
    navMenu_peopleLabel: `피플`,
    navMenu_reportLabel: `리포트`,
    navMenu_adminLabel: `어드민`,

    userSettings_profile: `프로필`,
    userSettings_myAccount: `내 계정`,
    userSettings_signout: `로그아웃`,

    privacy_helpLink: `고객지원`,
    privacy_privacyLink: `정책`,
    privacy_termsLink: `이용 약관`,

    live_welcome: `KidsLoop에 오신 걸 환영합니다!`,
    live_lessonPlanLabel: `수업 계획`,
    live_lessonPlanSelect: `수업 계획 선택`,
    live_liveButton: `라이브 실행`,
    live_featuredContent: `추천 컨텐츠`,

    header_viewOrg: `기관 보기`,
    header_viewUsers: `사용자 보기`,
    header_viewGroups: `그룹 보기`,
    header_viewSchools: `학교 보기`,
    header_classes: `수업`,
    header_programs: `프로그램`,
    header_grades: `학년`,
    users_suffix: `Suffix`,
    users_firstName: `이름`,
    users_lastName: `성`,
    users_middleName: `Middle name`,
    users_birthDate: `생일`,
    users_groups: `그룹`,
    users_school: `학교`,
    users_avatar: `아바타`,
    users_contactInfo: `연락 정보`,
    users_createDate: `생성시간`,
    users_updateDate: `변경시간`,
    users_sendInvite: `초대하기`,
    users_noRecords: `기록이 존재하지 않습니다`,
    users_labelDisplayedRows: `of`,
    users_labelRowsSelect: `열`,
    users_nextTooltip: `다음 페이지`,
    users_previousTooltip: `이전 페이지`,
    users_firstTooltip: `처음 페이지`,
    users_lastTooltip: `마지막 페이지`,
    users_exportTooltip: `추출`,
    users_uploadTooltip: `업로드`,
    users_addTooltip: `추가`,
    users_searchPlaceholder: `검색`,
    users_searchTooltip: `검색`,
    users_exportCSVName: `CSV 추출`,
    users_exportPDFName: `PDF 추출`,
    users_firstNameRequiredValidation: `이름은 필수 항목입니다`,
    users_firstNameInvalidValidation: `유효하지 않은 이름입니다.`,
    users_firstNameMaxValidation: `이름은 최대 10자 이내여야 합니다.`,
    users_firstNameMinValidation: `이름은 최소 3자 이상이어야 합니다.`,
    users_middleNameInvalidValidation: `N/A`,
    users_middleNameMaxValidation: `N/A`,
    users_middleNameMinValidation: `N/A`,
    users_lastNameRequiredValidation: `성은 필수 항목입니다`,
    users_lastNameInvalidValidation: `유효하지 않은 성`,
    users_lastNameMaxValidation: `성은 최대 10자 이내여야 합니다.`,
    users_lastNameMinValidation: `성은 최소 3자 이상이어야 합니다.`,
    users_groupRequiredValidation: `그룹은 필수 항목입니다`,
    users_initialSchoolValue: `학교 없음`,
    users_allSchoolsValue: `전체 학교`,
    users_emailMaxValidation: `이메일은 최대 30자 이내여야합니다`,
    users_emailInvalidValidation: `유효하지 않은 이메일입니다`,
    users_resendInviteButton: `다시 초대하기`,
    users_studentGroupOver18: `이에 동의함으로써, 이 이메일은 18세 이상 학생 그룹에 배정됨을 이해했습니다`,
    users_okButton: `확인`,
    users_cancelButton: `취소`,
    users_invitationSent: `사용자에게 초대를 보냈습니다`,
    users_actionsDeleteTooltip: `선택한 모든 유저 삭제`,
    users_errorDisplay: `사용자 에러`,
    users_organizationRoles: `사용자의 기관 역할`,
    allOrganization_myOrganizations: `나의 기관`,
    allOrganization_organizationName: `기관명`,
    allOrganization_roles: `역할`,
    allOrganization_phone: `핸드폰 번호`,
    allOrganization_email: `이메일`,
    allOrganization_actionsDeleteTooltip: `선택한 모든 기관 삭제`,
    allOrganization_actionsAddTooltip: `기관 추가`,
    allOrganization_actionsEditTooltip: `편집`,
    allOrganization_deleteRowTooltip: `삭제`,
    allOrganization_changePasswordButton: `비밀번호 변경`,
    allOrganization_changeOwner: `소유자 변경`,
    allOrganization_changeOwnerText: `한 명의 기관 소유자를 선택해 주세요.`,
    allOrganization_searchPlaceholder: `검색`,
    allOrganization_searchTooltip: `검색`,
    allOrganization_joinedOrganizations: `가입된 기관`,
    allOrganization_role: `역할`,
    allOrganization_noRecords: `기록이 존재하지 않습니다`,
    allOrganization_labelDisplayedRows: `of`,
    allOrganization_labelRowsSelect: `열`,
    allOrganization_nextTooltip: `다음 페이지`,
    allOrganization_previousTooltip: `이전 페이지`,
    allOrganization_firstTooltip: `처음 페이지`,
    allOrganization_lastTooltip: `마지막 페이지`,
    allOrganization_nameRequiredValidation: `이름은 필수항목 입니다.`,
    allOrganization_groupRequiredValidation: `그룹은 필수항목 입니다.`,
    allOrganization_emailInvalidValidation: `유효하지 않은 이메일입니다`,
    allOrganization_leaveOrganizationButton: `기관 떠나기`,
    allOrganization_leaveOrganizationConfirm: `확인을 누르시면, 기관을 떠나게됩니다. 계속 하시겠습니까?`,
    allOrganization_okButton: `확인`,
    allOrganization_cancelButton: `취소`,
    allOrganization_userLabel: `사용자`,
    allOrganization_leftOrganizationMessage: `기관을 떠났습니다`,
    joinedOrganization_email: `기관 소유자 이메일`,
    joinedOrganization_role: `나의 역할`,
    addOrganization_errorDisplay: `기관 정보를 가져올 수 없습니다`,
    addOrganization_nameOfOrganizationLabel: `기관명`,
    addOrganization_addressLabel: `주소`,
    addOrganization_phoneNumberLabel: `핸드폰 번호`,
    addOrganization_emailAddressLabel: `이메일`,
    addOrganization_primaryContactLabel: `주 연락처`,
    addOrganization_organizationShortCodeLabel: `기관 코드`,
    addOrganization_addOrganizationLogoLabel: `기관 로고 추가`,
    addOrganization_organizationColorLabel: `기관 색상`,
    addOrganization_saveButtonLabel: `저장`,
    addOrganization_cancelButtonLabel: `취소`,
    addOrganization_nameOfOrganizationPlaceholder: `공식 기관명`,
    addOrganization_addressPlaceholder: `기관 주소`,
    addOrganization_emailAddressPlaceholder: `기관 이메일`,
    addOrganization_organizationShortCodePlaceholder: `기관 코드`,
    addOrganization_organizationNameRequiredValidation: `기관명을 입력해주세요`,
    addOrganization_organizationNameInvalidValidation: `기관명이 올바르지 않습니다`,
    addOrganization_organizationNameMaxValidation: `기관명은 최대 30자 이내여야 합니다`,
    addOrganization_organizationNameMinValidation: `기관명은 최소 5자 이상이어야 합니다`,
    addOrganization_addressRequiredValidation: `주소는 필수 항목입니다`,
    addOrganization_addressInvalidValidation: `주소가 올바르지 않습니다`,
    addOrganization_addressMaxValidation: `주소는 최대 30자 이내여야합니다`,
    addOrganization_addressMinValidation: `주소는 최소 10자 이상이어야 합니다`,
    addOrganization_address2InvalidValidation: `2차 주소가 올바르지 않습니다`,
    addOrganization_address2MaxValidation: `2차 주소는 최대 30자 이내여야합니다`,
    addOrganization_address2MinValidation: `2차 주소는 최소 10자 이상이어야합니다`,
    addOrganization_phoneNumberRequiredValidation: `연락처는 필수입니다`,
    addOrganization_phoneNumberMaxValidation: `연락처는 최대 15자리 이내여야 합니다`,
    addOrganization_phoneNumberMinValidation: `연락처는 최소 10자리 이상이어야합니다`,
    addOrganization_emailAddressRequiredValidation: `이메일은 필수입니다`,
    addOrganization_emailAddressMaxValidation: `이메일은 최대 30자 이내여야 합니다`,
    addOrganization_emailAddressInvalidValidation: `이메일이 유효하지 않습니다`,
    addOrganization_primaryContactRequiredValidation: `주 연락처는 필수항목 입니다.`,
    addOrganization_organizationShortCodeRequiredValidation: `기관명이 유효할 시, 기관코드가 생성됩니다.`,
    addOrganization_organizationShortCodeInvalidValidation: `기관 코드가 유효하지 않습니다`,
    addOrganization_organizationLogoRequiredValidation: `기관 로고는 필수 항목입니다`,
    addOrganization_saveErrorMesssage: `저장 실패`,
    groups_groupNameTitle: `그룹명`,
    groups_groupNameRequiredValidation: `그룹명은 필수항목 입니다.`,
    groups_groupNameInvalidValidation: `유효하지 않은 그룹명`,
    groups_roleTitle: `역할`,
    groups_roleRequiredValidation: `역할은 필수항목 입니다.`,
    groups_colorTitle: `색상`,
    groups_addTooltip: `추가`,
    groups_searchPlaceholder: `검색`,
    groups_searchTooltip: `검색`,
    groups_actionsDeleteTooltip: `선택한 모든 그룹 삭제`,
    groups_deleteRowTooltip: `삭제`,
    groups_editRowTooltip: `편집`,
    groups_saveRowTooltip: `저장`,
    groups_cancelSaveRowTooltip: `취소`,
    groups_deleteRowText: `이 열을 삭제하시겠습니까?`,
    groups_noRecords: `기록이 존재하지 않습니다`,
    groups_labelDisplayedRows: `of`,
    groups_labelRowsSelect: `열`,
    groups_nextTooltip: `다음 페이지`,
    groups_previousTooltip: `이전 페이지`,
    groups_firstTooltip: `처음 페이지`,
    groups_lastTooltip: `마지막 페이지`,
    groups_errorDisplay: `그룹 목록을 가져올 수 없습니다, 기관을 다시 확인해주세요.`,
    schools_schoolNameTitle: `학교명`,
    schools_addressTitle: `주소`,
    schools_phoneTitle: `연락처`,
    schools_emailTitle: `이메일`,
    schools_contactNameTitle: `담당자`,
    schools_startDateTitle: `시작 시간`,
    schools_endDateTitle: `종료 시간`,
    schools_gradesTitle: `학년`,
    schools_schoolLogoTitle: `학교 로고`,
    schools_colorTitle: `색상`,
    schools_actionsDeleteTooltip: `선택한 모든 학교 삭제`,
    schools_exportTooltip: `추출`,
    schools_uploadTooltip: `업로드`,
    schools_addTooltip: `추가`,
    schools_searchPlaceholder: `검색`,
    schools_searchTooltip: `검색`,
    schools_exportCSVName: `CSV 추출`,
    schools_exportPDFName: `PDF 추출`,
    schools_noRecords: `기록이 존재하지 않습니다`,
    schools_actionsEditTooltip: `편집`,
    schools_deleteRowTooltip: `삭제`,
    schools_editRowTooltip: `편집`,
    schools_saveButtonLabel: `저장`,
    schools_cancelButtonLabel: `취소`,
    schools_saveRowTooltip: `저장`,
    schools_cancelSaveRowTooltip: `취소`,
    schools_deleteRowText: `이 열을 삭제하시겠습니까?`,
    schools_addProgramButton: `프로그램 추가`,
    schools_nameRequiredValidation: `이름은 필수 항목입니다`,
    schools_nameInvalidValidation: `올바른 이름을 입력해주세요`,
    schools_addressRequiredValidation: `주소는 필수 항목입니다`,
    schools_addressInvalidValidation: `올바른 주소를 입력해주세요`,
    schools_phoneRequiredValidation: `연락처는 필수 항목입니다`,
    schools_emailRequiredValidation: `이메일은 필수 항목입니다`,
    schools_emailInvalidValidation: `이메일이 유효하지 않습니다`,
    schools_contactNameRequiredValidation: `담당자는 필수 항목입니다`,
    schools_labelDisplayedRows: `of`,
    schools_labelRowsSelect: `열`,
    schools_nextTooltip: `다음 페이지`,
    schools_previousTooltip: `이전 페이지`,
    schools_firstTooltip: `처음 페이지`,
    schools_lastTooltip: `마지막 페이지`,
    schools_errorDisplay: `학교 목록을 가져 올 수 없습니다, 기관을 다시 확인해주세요`,
    schools_savedUsersError: `저장된 사용자 정보를 가져올 수 없습니다. 기관을 다시 확인해주세요`,
    school_saveSuccessfulMessage: `학교가 생성되었습니다`,
    school_saveFailMessage: `문제가 발생되었습니다. 다시 시도해주세요`,
    classes_classTitle: `학급`,
    classes_statusTitle: `상태`,
    classes_programTitle: `프로그램`,
    classes_schoolTitle: `학교`,
    classes_subjectTitle: `과목`,
    classes_gradesTitle: `학년`,
    classes_startDateTitle: `시작 시간`,
    classes_endDateTitle: `종료 시간`,
    classes_createDateTitle: `생성 시간`,
    classes_colorTitle: `색상`,
    classes_noRecords: `기록이 존재하지 않습니다`,
    classes_actionsEditTooltip: `편집`,
    classes_deleteRowTooltip: `삭제`,
    classes_editRowTooltip: `편집`,
    classes_addTooltip: `추가`,
    classes_saveRowTooltip: `저장`,
    classes_cancelSaveRowTooltip: `취소`,
    classes_deleteRowText: `이 열을 삭제하시겠습니까?`,
    classes_actionsDeleteTooltip: `선택한 모든 학급 삭제`,
    classes_searchPlaceholder: `검색`,
    classes_searchTooltip: `검색`,
    classes_classRequiredValidation: `학급명은 필수 항목입니다`,
    classes_classInvalidValidation: `사용 할 수 없는 학급명입니다`,
    classes_statusRequiredValidation: `상태는 필수 항목입니다`,
    classes_programRequiredValidation: `프로그램은 필수 항목입니다`,
    classes_schoolRequiredValidation: `학교는 필수 항목입니다`,
    classes_subjectRequiredValidation: `과목은 필수 항목입니다`,
    classes_gradesRequiredValidation: `학년은 필수 항목입니다`,
    classes_startDateRequiredValidation: `시작 시간은 필수 항목입니다`,
    classes_endDateRequiredValidation: `종료 시간은 필수 항목입니다`,
    classes_classRosterButton: `학생/교사 추가`,
    classes_exportCSVName: `CSV 추출`,
    classes_exportPDFName: `PDF 추출`,
    classes_exportTooltip: `추출`,
    classes_uploadTooltip: `업로드`,
    classes_labelDisplayedRows: `of`,
    classes_labelRowsSelect: `열`,
    classes_nextTooltip: `다음 페이지`,
    classes_previousTooltip: `이전 페이지`,
    classes_firstTooltip: `처음 페이지`,
    classes_lastTooltip: `마지막 페이지`,
    classes_errorDisplay: `학급 목록을 가져올 수 없습니다. 기관을 다시 확인해주세요`,
    classes_savedSchoolsError: `저장된 학교 정보를 가져올 수 없습니다. 기관을 다시 확인해주세요.`,
    classes_classSavedMessage: `학급이 생성되었습니다`,
    classes_classSaveError: `문제가 발생되었습니다. 다시 시도해주세요`,
    classes_classDeletedMessage: `Class has been deleted successfully`,
    classes_classDeletedError: `Sorry, something went wrong, please try again`,
    programs_programTitle: `프로그램`,
    programs_subjectTitle: `과목`,
    programs_gradeTitle: `학년`,
    programs_colorTitle: `색상`,
    programs_addCommentButton: `코멘트 추가하기`,
    programs_viewProgramDetailsButton: `프로그램 상세`,
    programs_actionsDeleteTooltip: `선택한 모든 프로그램 삭제`,
    programs_uploadTooltip: `업로드`,
    programs_exportCSVName: `CSV 추출`,
    programs_exportPDFName: `PDF 추출`,
    programs_exportTooltip: `추출`,
    programs_searchPlaceholder: `검색`,
    programs_searchTooltip: `검색`,
    programs_noRecords: `기록이 존재하지 않습니다`,
    programs_deleteRowTooltip: `삭제`,
    programs_editRowTooltip: `편집`,
    programs_addTooltip: `추가`,
    programs_saveRowTooltip: `저장`,
    programs_cancelSaveRowTooltip: `취소`,
    programs_deleteRowText: `이 열을 삭제하시겠습니까?`,
    programs_programRequiredValidation: `프로그램은 필수 항목입니다`,
    programs_programInvalidValidation: `프로그램이 올바르지 않습니다`,
    programs_labelDisplayedRows: `of`,
    programs_labelRowsSelect: `열`,
    programs_nextTooltip: `다음 페이지`,
    programs_previousTooltip: `이전 페이지`,
    programs_firstTooltip: `처음 페이지`,
    programs_lastTooltip: `마지막 페이지`,
    programs_schoolLabel: `학교`,
    grades_gradeTitle: `학년`,
    grades_ageRangeTitle: `연령대`,
    grades_colorTitle: `색상`,
    grades_programsTitle: `프로그램`,
    grades_progressToTitle: `진행 과정`,
    grades_labelDisplayedRows: `of`,
    grades_labelRowsSelect: `열`,
    grades_nextTooltip: `다음 페이지`,
    grades_previousTooltip: `이전 페이지`,
    grades_firstTooltip: `처음 페이지`,
    grades_lastTooltip: `마지막 페이지`,
    grades_exportTooltip: `추출`,
    grades_uploadTooltip: `업로드`,
    grades_addTooltip: `추가`,
    grades_searchPlaceholder: `검색`,
    grades_searchTooltip: `검색`,
    grades_exportCSVName: `CSV 추출`,
    grades_exportPDFName: `PDF 추출`,
    grades_noRecords: `기록이 존재하지 않습니다`,
    grades_deleteRowTooltip: `삭제`,
    grades_editRowTooltip: `편집`,
    grades_saveRowTooltip: `저장`,
    grades_cancelSaveRowTooltip: `취소`,
    grades_deleteRowText: `이 열을 삭제하시겠습니까?`,
    grades_actionsDeleteTooltip: `선택한 학년 삭제`,
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
    navMenu_analyticsAndReportsTitle: `분석과 리포트`,
    navMenu_analyticsAndReportsDescription: `기관 사용량 확인`,
    navMenu_assessmentsTitle: `평가`,
    navMenu_assessmentsDescription: `View and edit your assessments`,
    navMenu_billingTitle: `청구서`,
    navMenu_billingDescription: `청구서와 구독 관리`,
    navMenu_contentLibraryTitle: `콘텐츠 라이브러리`,
    navMenu_contentLibraryDescription: `콘텐츠 라이브러리 승인, 관리, 보기`,
    navMenu_dataSecurityTitle: `데이터 보안 및 이관`,
    navMenu_dataSecurityDescription: `데이터 사용량 및 관리`,
    navMenu_devicesTitle: `기기, 앱 및 라이선스`,
    navMenu_devicesDescription: `기관 소유 기기와 앱 라이센스`,
    navMenu_groupsTitle: `그룹`,
    navMenu_groupsDescription: `그룹 추가 또는 관리`,
    navMenu_organizationTitle: `기관 프로필`,
    navMenu_organizationDescription: `개인정보 업데이트 및 기관 관리`,
    navMenu_securityTitle: `보안`,
    navMenu_securityDescription: `보안 설정`,
    navMenu_schoolsTitle: `학교와 재원`,
    navMenu_schoolsDescription: `학교와 재원 관리하기`,
    navMenu_scheduleTitle: `스케줄`,
    navMenu_scheduleDescription: `Manage your schedules and join upcoming classes`,
    navMenu_supportTitle: `지원`,
    navMenu_supportDescription: `시작하기와 트러블슈팅`,
    navMenu_usersTitle: `사용자`,
    navMenu_usersDescription: `사용자 및 권한 관리`,
    navMenu_futureRelease: `다음 업데이트에 포함 예정입니다`,
    classRoster_nameTitle: `이름`,
    classRoster_groupTitle: `그룹`,
    classRoster_actionsDeleteTooltip: `선택한 모든 수업 명부를 삭제`,
    classRoster_actionsUploadTooltip: `업로드`,
    classRoster_userAddedMessage: `수업에 추가된 사용자`,
    classRoster_userAddedError: `죄송합니다. 다시 시도해 주십시오.`,
    classRoster_userRemovedMessage: `User removed from class`,
    classRoster_userRemovedError: `Sorry, something went wrong, please try again`,
    classRoster_noRecords: `기록이 존재하지 않습니다`,
    classRoster_actionsEditTooltip: `편집`,
    classRoster_deleteRowTooltip: `삭제`,
    classRoster_editRowTooltip: `편집`,
    classRoster_addTooltip: `추가`,
    classRoster_saveRowTooltip: `저장`,
    classRoster_cancelSaveRowTooltip: `취소`,
    classRoster_deleteRowText: `이 열을 삭제하시겠습니까?`,
    classRoster_searchPlaceholder: `검색`,
    classRoster_searchTooltip: `검색`,
    classRoster_exportCSVName: `CSV 추출`,
    classRoster_exportPDFName: `PDF 추출`,
    classRoster_exportTooltip: `추출`,
    classRoster_uploadTooltip: `업로드`,
    classRoster_labelDisplayedRows: `of`,
    classRoster_labelRowsSelect: `열`,
    classRoster_nextTooltip: `다음 페이지`,
    classRoster_previousTooltip: `이전 페이지`,
    classRoster_firstTooltip: `처음 페이지`,
    classRoster_lastTooltip: `마지막 페이지`,
    home_welcomeLabel: `환영합니다, {userName}님!`,
    usageInfo_onlineClasses: `라이브 수업`,
    usageInfo_offlineClasses: `오프라인 수업`,
    usageInfo_homework: `숙제`,
    usageInfo_attendedAmount: `{amount} 회 출석`,
    usageInfo_completedAmount: `{amount}회 수료`,
    planSelection_selectPlanLabel: `수업 계획 선택`,
    planSelection_planNotAvailableLabel: `No lesson plans available`,
    planSelection_viewLibraryLabel: `라이브러리 보기`,
    scheduleInfo_scheduleClassesLabel: `앞으로 {scheduledClassAmount}개의 수업이 있습니다`,
    scheduleInfo_seeScheduleLabel: `스케줄 보기`,
    assessment_noNewUpdatesLabel: `업데이트가 없습니다!`,
    assessment_assessmentsTitle: `평가`,
    dialogAppBar_organizationsTitle: `기관 전용`,
    adminHeader_viewOrg: `기관`,
    adminHeader_viewUsers: `사용자`,
    adminHeader_viewRoles: `역할`,
    adminHeader_viewSchools: `학교`,
    adminHeader_viewClasses: `학급`,
    adminHeader_viewPrograms: `프로그램`,
    adminHeader_viewGrades: `학년`,
    users_name: `이름`,
    users_activeStatus: `활성`,
    users_inactiveStatus: `비활성`,
    users_joinDate: `가입 날짜`,
    users_createUser: `사용자 추가`,
    roles_title: `역할`,
    roles_typeOrganizationAdmin: `기관 어드민`,
    roles_typeParent: `부모`,
    roles_typeSchoolAdmin: `학교 어드민`,
    roles_typeStudent: `학생`,
    roles_typeTeacher: `선생님`,
    roles_rowsPerPageLabel: `페이지 당 행`,
    schools_createSchoolLabel: `학교 추가`,
    classes_createClassLabel: `학급 추가`,
    organizations_createButton: `생성하기`,
    organizations_searchPlaceholder: `검색`,
    organizations_statusLabel: `상태`,

    scheduleInfo_noClasses: `예정된 수업이 없습니다.`,
    scheduleInfo_live: `라이브`,
    groups_rowsPerPage: `페이지 별 행`,
    groups_fromToMaxCount: `{from}에서 {to}까지`,
    groups_allResults: `전체`,
    groups_addColumnsButton: `열 추가하기`,
    groups_hideButton: `숨기기`,
    groups_noData: `검색된 정보가 없습니다.`,
    groups_allGroupsPages: `모든 그룹 & 페이지`,
    groups_allPages: `모든 페이지`,
    groups_thisPage: `이 페이지`,
    groups_none: `없음`,
    groups_groupBy: `그룹별`,
    groups_rowMoreActions: `추가 액션`,
    groups_selectColumnsTitle: `열 선택하기`,
    users_superAdminRole: `상위 어드민`,
    users_organizationAdminRole: `기관 어드민`,
    users_schoolAdminRole: `학교 어드민`,
    users_parentRole: `학부모`,
    users_studentRole: `학생`,
    users_teacherRole: `교사`,
    editDialog_delete: `삭제하기`,
    editDialog_cancel: `취소하기`,
    editDialog_save: `저장하기`,
    editDialog_savedSuccess: `성공적으로 사용자를 저장했습니다.`,
    editDialog_savedError: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요.`,
    editDialog_deleteSuccess: `성공적으로 사용자를 삭제했습니다.`,
    editDialog_deleteError: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요.`,
    editDialog_deleteConfirm: `{userName}를 삭제하려는 것이 확실합니까?`,
    createUser_title: `사용자 생성하기`,
    createUser_cancel: `취소하기`,
    createUser_create: `생성하기`,
    createUser_success: `성공적으로 사용자를 생성했습니다.`,
    createUser_error: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요.`,
    createUser_givenNameLabel: `이름`,
    createUser_familyNameLabel: `성`,
    createUser_rolesLabel: `역할`,
    createUser_schoolsLabel: `학교 (선택적)`,
    createUser_contactInfoLabel: `연락처`,
    createUser_roleRequired: `적어도 하나의 역할은 필수적으로 입력되어야 합니다.`,
    createUser_invalidEmail: `불가능한 이메일 주소`,
    createUser_invalidPhone: `불가능한 휴대폰 번호`,
    createUser_emailPhoneRequired: `이메일이나 휴대폰 번호가 요구됩니다.`,

    users_SuperAdmin: `상위 어드민`,
    users_OrganizationAdmin: `기관 어드민`,
    users_SchoolAdmin: `학교 어드민`,
    users_Parent: `학부모`,
    users_Student: `학생`,
    users_Teacher: `교사`,
    users_selectAll: `전부 선택하기`,
    users_editButton: `수정하기`,
    users_deleteButton: `삭제하기`,

    planSelection_noOptionsLabel: `옵션 없음`,

    navbar_OrganizationsTab: `기관`,
    navbar_UsersTab: `사용자`,
    navbar_RolesTab: `역할`,
    navbar_SchoolsTab: `학교`,
    navbar_ClassesTab: `수업`,
    navbar_organizationContentTab: `기관 내용`,
    navbar_badanamuContentTab: `Badanamu 내용`,

    roles_roleDescription: `역할 설명`,
    roles_type: `종류`,
    roles_createRole: `생성하기`,
    roles_editButton: `수정하기`,
    roles_deleteButton: `삭제하기`,
    roles_roleInfoStep: `역할 정보`,
    roles_setPermissionsStep: `권한 설정하기`,
    roles_confirmRoleStep: `역할 확정하기`,
    roles_confirmNewRoleTitle: `새로운 역할을 생성할까요?`,
    roles_confirmNewRoleContent: `이 기관에 새로운 역할을 생성합니다.`,
    roles_confirmNewRoleLabel: `생성하기`,
    roles_confirmSuccess: `성공적으로 새로운 역할이 생성되었습니다.`,
    roles_confirmError: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요.`,

    rolesInfoCard_title: `역할 정보`,
    rolesInfoCard_fetchingLabel: `권한 가져오는중`,
    rolesInfoCard_nameFieldLabel: `이름*`,
    rolesInfoCard_descriptionFieldLabel: `설명`,
    rolesInfoCard_requiredFieldLabel: `필수 칸*`,
    rolesInfoCard_roleEmpty: `역할 이름은 공란일 수 없습니다.`,
    rolesInfoCard_minChar: `역할 이름은 적어도 2글자여야 합니다.`,
    rolesInfoCard_maxChar: `역할 이름은 20글자를 초과할 수 없습니다.`,
    rolesInfoCard_alphaNumeric: `영문과 숫자만 사용 가능합니다.`,
    rolesInfoCard_nameTaken: `이미 사용중인 이름입니다.`,
    rolesInfoCard_descriptionMaxChar: `설명은 30자를 초과할 수 없습니다. `,
    rolesInfoCard_descriptionAlphanumeric: `영문과 숫자만 사용 가능합니다.`,
    rolesInfoCard_clearLabel: `지우기`,
    rolesInfoCard_resetLabel: `기본값 재설정하기`,
    rolesInfoCard_copyLabel: `...로부터 역할 복사해오기`,
    rolesInfoCard_createNewRoleLabel: `새로운 역할 생성하기`,
    rolesInfoCard_finishLabel: `역할 생성 절차가 끝났습니다.`,
    rolesInfoCard_continueButton: `계속하기`,
    rolesInfoCard_finishButton: `끝내기`,
    rolesInfoCard_actionsTitle: `액션`,
    rolesInfoCard_backButton: `뒤로가기`,

    schools_editButton: `수정하기`,
    schools_deleteButton: `삭제하기`,

    allOrganization_leaveOrganizationLabel: `선택한 기관 나가기`,
    allOrganization_leftOrganizationSuccess: `성공적으로 기관에서 나왔습니다. `,
    allOrganization_leftOrganizationError: `기관에서 나오는 도중에 에러가 발생했습니다. `,
    allOrganization_editButton: `수정하기`,
    allOrganization_deleteButton: `삭제하기`,
    allOrganization_deleteConfirmLabel: `{name}를 삭제하려는 것이 확실합니까?`,
    allOrganization_deleteSuccess: `성공적으로 기관이 삭제되었습니다.`,
    allOrganization_deleteError: `기관을 삭제하는 도중에 에러가 발생했습니다. `,

    data_activeStatus: `활성화하기`,
    data_inactiveStatus: `비활성화하기`,

    schools_createTitle: `학교 생성하기`,
    schools_nameLabel: `학교 이름`,
    schools_requiredLabel: `필수적`,
    schools_cancelLabel: `취소하기`,
    schools_createLabel: `생성하기`,
    schools_createdSuccess: `학교가 성공적으로 생성되었습니다.`,
    schools_createdError: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요.`,
    schools_required: `필수적`,
    schools_alphanumeric: `영문과 숫자만 사용 가능합니다.`,
    schools_unique: `학교 이름은 유일한 값이어야 합니다.`,
    schools_deleteSuccess: `학교가 성공적으로 삭제되었습니다. `,
    schools_deleteError: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요.`,

    groups_rowMoreActions: `추가 액션`,
    groups_selectColumnsTitle: `열 선택하기`,

    class_createClass: `수업 생성하기`,
    class_classLabel: `수업 이름`,
    class_required: `수업 이름은 공란일 수 없습니다.`,
    class_alphanumeric: `영문과 숫자만 사용 가능합니다.`,
    class_unique: `수업 이름은 유일한 값이어야 합니다.`,
    class_schoolsLabel: `학교 (선택적)`,
    class_cancel: `취소하기`,
    class_create: `생성하기`,
    class_confirmDelete: `{name}를 삭제하려는 것이 확실합니까?`,
    class_deleteRows: `{rows}행 삭제하기`,
    data_deleteRows: `{rows}행 삭제하기`,
    superAdmin_searchPlaceholder: `폴더명, 작성자, 작성자 ID 및 키워드로 컨텐츠 검색하기`,
    superAdmin_deleteLabel: `삭제하기`,
    superAdmin_editLabel: `수정하기`,
    superAdmin_moveLabel: `이동하기`,
    superAdmin_distributeLabel: `배포하기`,
    superAdmin_libraryLabel: `라이브러리`,
    superAdmin_moveSelectedLabel: `선택된 것 옮기기`,
    superAdmin_creatFolderLabel: `폴더 생성하기`,
    superAdmin_deleteSuccess: `컨텐츠가 성공적으로 삭제되었습니다.`,
    superAdmin_deleteError: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요.`,
    superAdmin_deleteContentTitle: `컨텐츠 삭제하기`,
    superAdmin_deleteText: `{name}를 삭제하려는 것이 확실합니까?`,
    superAdmin_type: `종류`,
    superAdmin_confirmDeletion: `삭제 확인하기`,
    superAdmin_authorIdLabel: `작성자 ID`,
    superAdmin_descriptionLabel: `설명`,
    superAdmin_keywordsLabel: `키워드`,
    superAdmin_publishStatusLabel: `상태 공유하기`,
    superAdmin_createdLabel: `생성됨`,
    superAdmin_lastModifiedLabel: `최근에 수정됨`,
    superAdmin_contentTypeLabel: `컨텐츠 종류`,
    superAdmin_authorNameLabel: `작성자 이름`,
    superAdmin_nameLabel: `이름`,
    superAdmin_contentFolderError: `죄송하지만, 무언가 잘못됐습니다.`,
    editOrganization_labelNameOfOrganization: `기관 이름`,
    editOrganization_placeholderNameOfOrganization: `기관 공식 이름`,
    editOrganization_labelAddress: `주소`,
    editOrganization_placeholderAddress: `기관 주소`,
    editOrganization_labelPhoneNumber: `휴대폰 번호`,
    editOrganization_labelEmailAddress: `이메일 주소`,
    editOrganization_placeholderEmail: `기관 이메일`,
    editOrganization_labelOrganizationShortCode: `기관 코드`,
    editOrganization_placeholderOrganizationShortCode: `기간 코드`,
    editOrganization_labelAddOrganizationLogo: `기관 로고 추가`,
    editOrganization_labelOranizationColor: `기관 색깔`,
    editOrganization_buttonSave: `저장`,
    editOrganization_buttonCancel: `취소`,
    editOrganization_errorEditingOrganization: `기관 편집 에러`,

    ageRanges_idLabel: `ID`,
    ageRanges_ageRangeLabel: `나이대`,
    ageRanges_deleteAgeRangeTitle: `나이대 삭제하기`,
    ageRanges_deleteAgeRangeConfirm: `삭제하기`,
    ageRanges_deleteText: `"{ageRangeName}"를 정말 삭제하시겠습니까?`,
    ageRanges_typeText: `종류`,
    ageRanges_typeEndText: `삭제 확인하기`,
    ageRanges_deleteSuccess: `나이대가 성공적으로 삭제되었습니다`,
    ageRanges_deleteError: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요`,
    ageRanges_createAgeRangeLabel: `나이대 생성하기`,
    ageRanges_editLabel: `수정하기`,
    ageRanges_deleteLabel: `삭제하기`,
    ageRanges_title: `나이대`,
    ageRanges_createSuccess: `나이대가 성공적으로 생성되었습니다`,
    ageRanges_createError: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요`,
    ageRanges_cancelButton: `취소하기`,
    ageRanges_createButton: `생성하기`,
    ageRanges_saveButton: `저장하기`,
    ageRanges_formFrom: `부터`,
    ageRanges_formTo: `까지`,
    ageRanges_formFromUnit: `유닛부터`,
    ageRanges_formToUnit: `유닛까지`,
    ageRanges_formMonths: `월`,
    ageRanges_formYears: `년`,
    ageRanges_editSuccess: `나이대가 성공적으로 저장되었습니다`,
    ageRanges_formEditTitle: `나이대 수정하기`,

    generic_deleteText: `"{value}"를 정말 삭제하시겠습니까?`,
    generic_typeText: `종류`,
    generic_typeEndText: `삭제 확인하기.`,

    genericValidations_required: `필수기재`,
    genericValidations_phoneInvalid: `타당하지 않은 휴대폰 번호`,
    genericValidations_minChar: `최소 {min}글자 입력이 필요합니다`,
    genericValidations_maxChar: `최대 {max}글자 입력이 필요합니다`,
    genericValidations_emailInvalid: `타당하지 않은 이메일 주소`,
    genericValidations_equals: `값이 일치하지 않습니다`,
    genericValidations_alphanumeric: `값이 영문 및 숫자가 아닙니다`,

    grades_notSpecifiedLabel: `명시되지 않음`,
    grades_idLabel: `ID`,
    grades_nameLabel: `이름`,
    grades_progressFromLabel: `여기부터 진행`,
    grades_progressToLabel: `여기까지 진행`,
    grades_deleteGradePrompt: `학년 삭제하기`,
    grades_deleteConfirmButton: `삭제하기`,
    grades_deleteSuccess: `학년이 성공적으로 삭제됨`,
    grades_deleteError: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요`,
    grades_createGradeLabel: `학년 생성하기`,
    grades_editLabel: `편집하기`,
    grades_deleteLabel: `삭제하기`,
    grades_title: `학년`,

    generic_createError: `죄송하지만, 무언가 잘못됐으니 다시 시도해보세요`,
    generic_saveLabel: `저장하기`,
    grades_cancelLabel: `취소하기`,
    grades_createGradeTitle: `학년 생성하기`,
    grades_createLabel: `생성하기`,
    grades_createSuccess: `학년이 성공적으로 생성됨`,
    grades_deleteGradePromptTitle: `학년 삭제하기`,
    grades_editGradeTitle: `학년이 성공적으로 삭제됨`,
    grades_editSuccess: `학년이 성공적으로 저장됨`,
    grades_editTitle: `학년 수정하기`,
    grades_gradeNameLabel: `학년 이름`,

    library_cancelLabel: `취소하기`,
    library_createFolderSuccess: `폴더가 성공적으로 생성되었습니다`,
    library_createFolderTitle: `폴더 생성하기`,
    library_createLabel: `생성하기`,
    library_deleteContentedLabel: `내용 삭제하기`,
    library_deleteLabel: `삭제하기`,
    library_deleteSuccess: `폴더가 성공적으로 삭제되었습니다`,
    library_destinationTooltip: `목적지`,
    library_distributeEditSuccess: `배포설정이 성공적으로 업데이트 되었습니다`,
    library_distributeTooltip: `이 옵션을 선택하면 해당 내용이 현재와 미래 기관에 적용됩니다`,
    library_editSuccess: `폴더가 성공적으로 저장되었습니다`,
    library_editTitle: `폴더 편집하기`,
    library_folderNameLabel: `폴더 이름`,
    library_moveError: `파일을 옮기는 중에 에러가 발생했으니, 다시 시도해보세요`,
    library_moveLabel: `옮기기`,
    library_moveSuccess: `성공적으로 파일이 옮겨짐`,
    library_moveTooltip: `폴더가 옮겨짐`,
    library_nameLabel: `이름`,
    library_phoneLabel: `휴대폰`,
    library_selectOrganizationsLabel: `기관 선택`,

    generic_idLabel: `ID`,
    programs_ageRanges: `나이대`,
    programs_createLabel: `생성하기`,
    programs_createProgramLabel: `프로그램 생성하기`,
    programs_deleteLabel: `삭제하기`,
    programs_deleteProgramLabel: `프로그램 삭제하기`,
    programs_deleteSuccess: `프로그램이 성공적으로 삭제됨`,
    programs_editLabel: `편집하기`,
    programs_editProgramLabel: `프로그램 편집하기`,
    programs_grades: `학년`,
    programs_name: `이름`,
    programs_nextLabel: `다음`,
    programs_previousLabel: `이전`,
    programs_programNameLabel: `프로그램 이름`,
    programs_programsInfoLabel: `프로그램 정보`,
    programs_projectInfoLabel: `프로젝트 정보`,
    programs_saveLabel: `저장하기`,
    programs_subjects: `과목`,
    programs_summaryLabel: `요약`,
    programs_title: `프로그램`,
    programs_viewDetailsLabel: `상세내용 보기`,

    class_addUserLabel: `사용자 추가하기`,
    class_ageRangeLabel: `나이대(선택적)`,
    class_cancelLabel: `취소하기`,
    class_classNameLabel: `학급 이름`,
    class_classRosterHeader: `학급 로스터`,
    class_classRosterLabel: `학급 로스터`,
    class_createClassTitle: `학급 생성하기`,
    class_createLabel: `생성하기`,
    class_editLabel: `편집하기`,
    class_editTitle: `학급 편집하기`,
    class_emailLabel: `이메일`,
    class_gradeLabel: `학년 (선택적)`,
    class_phoneLabel: `휴대폰 번호`,
    class_programLabel: `프로그램 (선택적)`,
    class_programsHeader: `프로그램`,
    class_removeConfirm: `제거하기`,
    class_removeUserLabel: `사용자 제거하기`,
    class_roleLabel: `역할`,
    class_schoolsLabel: `학교 (선택적)`,
    class_searchPlaceholder: `이름, 주소, 이메일과 휴대폰 번호로 학생들을 검색해보세요`,
    class_subjectsLabel: `과목 (선택적)`,
    class_tableStudents: `학생 ({length})`,
    class_tableSubjectsLabel: `과목`,
    class_tableTeachers: `선생님 ({length})`,
    class_usernameLabel: `사용자 이름`,
    schools_addLabel: `추가하기`,
    schools_addUserTitle: `사용자 추가하기`,
    schools_ageRangesLabel: `나이대`,
    schools_deleteConfrimLabel: `삭제하기`,
    schools_deleteTitleLabel: `학교 삭제하기`,
    schools_emailLabel: `이메일`,
    schools_gradesLabel: `학년`,
    schools_phoneLabel: `휴대폰 번호`,
    schools_programsLabel: `프로그램`,
    schools_roleLabel: `역할`,
    schools_schoolRosterLabel: `학교 로스터`,
    schools_searchPlaceholder: `이름, 주소, 이메일과 휴대폰 번호로 학생들을 검색해보세요`,
    schools_shortCodeLabel: `숏 코드`,
    schools_subjectsLabel: `과목`,
    schools_userNameLabel: `사용자 이름`,
    schools_viewDetailsLabel: `학급 세부내용 보기`,

    navMenu_programsTitle: `Programs`,
    navMenu_classesTitle: `Classes`,
    navMenu_subjectsTitle: `Subjects`,
    navMenu_gradesTitle: `Grades`,
    navMenu_ageRangesTitle: `Age Ranges`,
};
export default messages;
