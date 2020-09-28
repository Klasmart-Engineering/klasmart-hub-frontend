// en.ts
const messages: Record<string, string> = {
    ERROR_ACCOUNT_BANNED: "Your account has been banned",
    ERROR_ALREADY_VERIFIED: "Your account has already been verified",
    ERROR_INPUT_INVALID_FORMAT: "Invalid format",
    ERROR_INPUT_TOO_LONG: "Too long",
    ERROR_INPUT_TOO_SHORT: "Too short",
    ERROR_INVALID_LOGIN: "Invalid Login",
    ERROR_INVALID_PASSWORD: "Invalid Password",
    ERROR_INVALID_VERIFICATION_CODE: "Invalid verification code",
    ERROR_MOCK: "The rest api simulated a mock error",
    ERROR_UNKOWN: "An unexpected error occurred",
    ERROR_VERIFICATION_NOT_FOUND: "Verification not found",
    ERROR_FUNCTION_NOT_FOUND: "Function not found",

    auth_successPrompt: "Login Successful",
    auth_failedPrompt: "Login Failed",

    signup_signupPrompt: "Sign Up",
    signup_signedUpAlready: "Have an account?",
    signup_signupButton: "Sign Up",
    signupInvite_signupPrompt: "Welcome to {organization}, {name}!",
    signupInvite_mistake: "If you think this invation was sent by mistake, ",
    signupInvite_click: "click here.",

    password_forgotPrompt: "Account Recovery",
    password_forgotRecover: "Recover",
    password_forgotBack: "Go Back",
    password_restorePrompt: "Reset Password",
    password_confirmRestore: "Set new password",
    password_changePrompt: "Change Password",
    password_confirmChange: "Change password",
    password_changedPrompt: "You've successfully changed your password",
    password_changedConfirm: "Go to dashboard",

    verify_emailPrompt: "Verify Email",
    verify_emailDirections: "Please check your email for your verification code.",
    verify_emailCode: "Enter your verification code",
    verify_emailSuccess: "Your email has been verified",

    verify_invitePrompt: "Have an invite code?",
    verify_inviteDirections: "If so, enter your invite code below.",
    verify_inviteCode: "Enter your invite code",
    verify_inviteSkip: "I do not have an invite code.",

    verify_phonePrompt: "Verify Phone Number",
    verify_phoneDirections: "Please check the message sent to your phone for your verification code.",
    verify_phoneCode: "Enter your verification code",

    classSettings_classroomSettings: "Classroom Settings",

    component_switchDark: "dark",
    component_switchLight: "light",

    button_create: "Create",
    button_continue: "Continue",
    button_continueSignUp: "Continue with Sign Up",

    form_emailLabel: "Email or phone",
    form_nameLabel: "What's your name?",
    form_passwordLabel: "Password",
    form_passwordConfirmLabel: "Confirm Password",
    form_newPasswordLabel: "New Password",
    form_newPasswordConfirmLabel: "Confirm New Password",
    form_passwordForgotEmailLabel: "Enter your email or phone number",
    form_newPasswordCodeLabel: "Verification Code",
    form_currentPasswordLabel: "Current Password",

    invited_successPrompt: "You've successfully joined {organization}.",
    invited_failedPrompt: "Oops, something went wrong!",

    locale_select: "Select Language",
    locale_tooltip: "Change Language",

    login_createAccount: "Create an account",
    login_forgotPassword: "Forgot Password?",
    login_loginButton: "Sign In",
    login_loginPrompt: "Sign In",

    navMenu_adminConsoleLabel: "Admin Console",
    navMenu_assessmentsLabel: "Assessments",
    navMenu_scheduleLabel: "Schedule",
    navMenu_libraryLabel: "Library",
    navMenu_liveLabel: "Live",
    navMenu_peopleLabel: "People",
    navMenu_reportLabel: "Report",

    userSettings_profile: "Profile",
    userSettings_myAccount: "My account",
    userSettings_signout: "Sign out",

    privacy_helpLink: "Help",
    privacy_privacyLink: "Privacy",
    privacy_termsLink: "Terms",

    live_welcome: "Welcome to KidsLoop",
    live_lessonPlanLabel: "Lesson Plan",
    live_lessonPlanSelect: "Select Lesson Plan",
    live_liveButton: "Go Live",
    live_featuredContent: "Featured Content",
};
export default messages;
