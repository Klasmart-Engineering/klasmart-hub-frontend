// en.ts
const messages: Record<string, string> = {
    ERROR_ACCOUNT_BANNED: "차단된 계정입니다.",
    ERROR_ALREADY_VERIFIED: "이미 인증된 계정입니다.",
    ERROR_INPUT_INVALID_FORMAT: "이메일 혹은 휴대폰 번호 형식이 올바르지 않습니다.",
    ERROR_INPUT_TOO_LONG: "내용이 너무 깁니다.",
    ERROR_INPUT_TOO_SHORT: "내용이 너무 짧습니다.",
    ERROR_INVALID_LOGIN: "로그인 정보가 정확하지 않습니다.",
    ERROR_INVALID_PASSWORD: "비밀번호가 정확하지 않습니다.",
    ERROR_INVALID_VERIFICATION_CODE: "잘못된 인증 코드입니다.",
    ERROR_MOCK: "REST API로 인한 오류가 발생하였습니다.",
    ERROR_UNKOWN: "예상치 못한 오류가 발생했습니다.",
    ERROR_VERIFICATION_NOT_FOUND: "인증 정보를 찾을 수 없습니다.",
    ERROR_FUNCTION_NOT_FOUND: "알 수 없는 요청입니다.",

    auth_successPrompt: "로그인에 성공했습니다",
    auth_failedPrompt: "로그인에 실패했습니다",

    signup_signupPrompt: "회원가입",
    signup_signedUpAlready: "이미 계정이 있으신가요?",
    signup_signupButton: "회원가입",
    signupInvite_signupPrompt: "{name}, {organization}에 오신걸 환영합니다!",
    signupInvite_mistake: "이 초대장이 실수로 발송되었다고 생각하시면, ",
    signupInvite_click: "여기를 클릭하세요.",

    password_forgotPrompt: "계정 복구",
    password_forgotRecover: "복구",
    password_forgotBack: "이전",
    password_restorePrompt: "비밀번호 재설정",
    password_confirmRestore: "새 비밀번호 설정",
    password_changePrompt: "비밀번호 변경",
    password_confirmChange: "비밀번호 변경",
    password_changedPrompt: "비밀번호가 성공적으로 변경되었습니다",
    password_changedConfirm: "대시보드로 이동하기",

    verify_emailPrompt: "이메일 확인",
    verify_emailDirections: "이메일에서 인증 코드를 확인하십시오.",
    verify_emailCode: "인증 코드 입력",
    verify_emailSuccess: "이메일이 인증되었습니다",

    verify_invitePrompt: "초대 코드가 있습니까?",
    verify_inviteDirections: "있다면, 아래에 초대 코드를 입력하십시오.",
    verify_inviteCode: "초대 코드 입력",
    verify_inviteSkip: "초대 코드가 없습니다.",

    verify_phonePrompt: "휴대폰 번호 확인",
    verify_phoneDirections: "휴대폰으로 전송 된 메시지에서 인증 코드를 확인하십시오.",
    verify_phoneCode: "인증 코드 입력",

    classSettings_classroomSettings: "교실 설정",

    component_switchDark: "다크",
    component_switchLight: "라이트",

    button_create: "생성",
    button_continue: "계속",
    button_continueSignUp: "회원가입 계속",

    form_emailLabel: "이메일 주소 / 휴대폰 번호",
    form_nameLabel: "이름",
    form_passwordLabel: "비밀번호",
    form_passwordConfirmLabel: "비밀번호 확인",
    form_newPasswordLabel: "새 비밀번호",
    form_newPasswordConfirmLabel: "새 비밀번호 확인",
    form_passwordForgotEmailLabel: "이메일 주소 혹은 휴대폰 번호 입력",
    form_newPasswordCodeLabel: "인증 코드",
    form_currentPasswordLabel: "현재 비밀번호",

    invited_successPrompt: "성공적으로 {organization}에 가입했습니다.",
    invited_failedPrompt: "이런! 알 수 없는 문제가 발생했습니다!",

    locale_select: "언어 선택",
    locale_tooltip: "언어 변경",

    login_createAccount: "계정 생성",
    login_forgotPassword: "비밀번호 찾기",
    login_loginButton: "로그인",
    login_loginPrompt: "로그인",

    navMenu_adminConsoleLabel: "어드민 콘솔",
    navMenu_assessmentsLabel: "Assessments",
    navMenu_scheduleLabel: "Schedule",
    navMenu_libraryLabel: "Library",
    navMenu_liveLabel: "Live",
    navMenu_peopleLabel: "People",
    navMenu_reportLabel: "Report",

    userSettings_profile: "프로필",
    userSettings_myAccount: "내 계정",
    userSettings_signout: "로그아웃",

    privacy_helpLink: "고객지원",
    privacy_privacyLink: "개인 정보 정책",
    privacy_termsLink: "이용 약관",

    live_welcome: "KidsLoop에 오신 걸 환영합니다!",
    live_lessonPlanLabel: "레슨 플랜",
    live_lessonPlanSelect: "레슨 플랜 선택",
    live_liveButton: "Live 실행",
    live_featuredContent: "추천 컨텐츠",
};
export default messages;
