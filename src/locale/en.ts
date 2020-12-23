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
    password_confirmChange: "Confirm password",
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
    navMenu_homeLabel: "Home",
    navMenu_peopleLabel: "People",
    navMenu_reportLabel: "Report",
    navMenu_adminLabel: "Admin",

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

    header_viewOrg: "view org",
    header_viewUsers: "view users",
    header_viewGroups: "view roles",
    header_viewSchools: "view schools",
    header_classes: "classes",
    header_programs: "programs",
    header_grades: "grades",
    users_suffix: "Suffix",
    users_firstName: "Given Name",
    users_lastName: "Family Name",
    users_middleName: "Middle Name",
    users_birthDate: "Birth Date",
    users_groups: "Roles",
    users_school: "School",
    users_avatar: "Avatar",
    users_email: "Contact Info",
    users_createDate: "Create Date",
    users_updateDate: "Update Date",
    users_sendInvite: "Send Invite",
    users_noRecords: "No records to display",
    users_labelDisplayedRows: "of",
    users_labelRowsSelect: "rows",
    users_nextTooltip: "Next Page",
    users_previousTooltip: "Previous Page",
    users_firstTooltip: "First Page",
    users_lastTooltip: "Last Page",
    users_exportTooltip: "Export",
    users_uploadTooltip: "Upload",
    users_addTooltip: "Add",
    users_searchPlaceholder: "Search",
    users_searchTooltip: "Search",
    users_exportCSVName: "Export as CSV",
    users_exportPDFName: "Export as PDF",
    users_firstNameRequiredValidation: "First name is required",
    users_firstNameInvalidValidation: "First name is invalid",
    users_firstNameMaxValidation: "The first name must have a maximum of 10 characters",
    users_firstNameMinValidation: "The first name must have a minimum of 3 characters",
    users_middleNameInvalidValidation: "Middle name is invalid",
    users_middleNameMaxValidation: "The middle name must have a maximum of 10 characters",
    users_middleNameMinValidation: "The middle name must have a minimum of 3 characters",
    users_lastNameRequiredValidation: "Last name is required",
    users_lastNameInvalidValidation: "Last name is invalid",
    users_lastNameMaxValidation: "The last name must have a maximum of 10 characters",
    users_lastNameMinValidation: "The last name must have a minimum of 3 characters",
    users_groupRequiredValidation: "Role is required",
    users_initialSchoolValue: "No Schools",
    users_allSchoolsValue: "All Schools",
    users_emailMaxValidation: "The email must have a maximum of 30 characters",
    users_emailInvalidValidation: "Invalid email",
    users_resendInviteButton: "Resend Invite",
    users_studentGroupOver18: "With this action, you are certifying that this email belongs to a student group over the age of 18.",
    users_okButton: "Ok",
    users_cancelButton: "Cancel",
    users_invitationSent: "Invitation sent to user.",
    users_actionsDeleteTooltip: "Remove all selected users",
    users_errorDisplay: "Error displaying users",
    users_organizationRoles: "Organization Roles",
    allOrganization_myOrganizations: "My Organizations",
    allOrganization_organizationName: "Organization Name",
    allOrganization_roles: "Role(s)",
    allOrganization_phone: "Phone Number",
    allOrganization_email: "Email",
    allOrganization_actionsDeleteTooltip: "Remove all selected organizations",
    allOrganization_actionsAddTooltip: "Add Organization",
    allOrganization_actionsEditTooltip: "Edit",
    allOrganization_deleteRowTooltip: "Delete",
    allOrganization_changePasswordButton: "Change Password",
    allOrganization_changeOwner: "Change Owner",
    allOrganization_changeOwnerText: "Please choose one user as the organization´s owner",
    allOrganization_searchPlaceholder: "Search",
    allOrganization_searchTooltip: "Search",
    allOrganization_joinedOrganizations: "Joined Organizations",
    allOrganization_role: "Role",
    allOrganization_noRecords: "No records to display",
    allOrganization_labelDisplayedRows: "of",
    allOrganization_labelRowsSelect: "rows",
    allOrganization_nextTooltip: "Next Page",
    allOrganization_previousTooltip: "Previous Page",
    allOrganization_firstTooltip: "First Page",
    allOrganization_lastTooltip: "Last Page",
    allOrganization_nameRequiredValidation: "Name is required",
    allOrganization_groupRequiredValidation: "Role is required",
    allOrganization_emailInvalidValidation: "Invalid email",
    allOrganization_leaveOrganizationButton: "Leave Organization",
    allOrganization_leaveOrganizationConfirm: "Once you confirm the action, you will be unlinked from the organization. Do you want to continue?",
    allOrganization_okButton: "Ok",
    allOrganization_cancelButton: "Cancel",
    allOrganization_userLabel: "User",
    allOrganization_leftOrganizationMessage: "You have left the organization",
    joinedOrganization_email: "Organization Owner's Email",
    joinedOrganization_role: "Your Role",
    addOrganization_errorDisplay: "Error displaying the organization",
    addOrganization_nameOfOrganizationLabel: "Name of Organization",
    addOrganization_addressLabel: "Address",
    addOrganization_phoneNumberLabel: "Phone Number",
    addOrganization_emailAddressLabel: "Email Address",
    addOrganization_primaryContactLabel: "Primary Contact",
    addOrganization_organizationShortCodeLabel: "Organization Short Code",
    addOrganization_addOrganizationLogoLabel: "Add Organization Logo",
    addOrganization_organizationColorLabel: "Organization color",
    addOrganization_saveButtonLabel: "Save",
    addOrganization_cancelButtonLabel: "Cancel",
    addOrganization_nameOfOrganizationPlaceholder: "Official Name of Your Organization",
    addOrganization_addressPlaceholder: "Organization Address",
    addOrganization_emailAddressPlaceholder: "Organization Email",
    addOrganization_organizationShortCodePlaceholder: "Organization Short Code",
    addOrganization_organizationNameRequiredValidation: "Name of organization is required",
    addOrganization_organizationNameInvalidValidation: "Name of organization invalid",
    addOrganization_organizationNameMaxValidation: "The name of organization must have a maximum of 30 characters",
    addOrganization_organizationNameMinValidation: "The name of organization must have a minimum of 5 characters",
    addOrganization_addressRequiredValidation: "Address is required",
    addOrganization_addressInvalidValidation: "Address is invalid",
    addOrganization_addressMaxValidation: "The address must have a maximum of 30 characters",
    addOrganization_addressMinValidation: "The address must have a minimum of 10 characters",
    addOrganization_address2InvalidValidation: "Second address is invalid",
    addOrganization_address2MaxValidation: "The second address must have a maximum of 30 characters",
    addOrganization_address2MinValidation: "The second address must have a minimum of 10 characters",
    addOrganization_phoneNumberRequiredValidation: "Phone number is required",
    addOrganization_phoneNumberMaxValidation: "The phone number must have a maximum of 15 characters",
    addOrganization_phoneNumberMinValidation: "The phone number must have a minimum of 10 characters",
    addOrganization_emailAddressRequiredValidation: "Email address is required",
    addOrganization_emailAddressMaxValidation: "The email adress must have a maximum of 30 characters",
    addOrganization_emailAddressInvalidValidation: "Email address is invalid",
    addOrganization_primaryContactRequiredValidation: "Primary contact is required",
    addOrganization_organizationShortCodeRequiredValidation: "The organization short code is generated when the name of the organization is valid",
    addOrganization_organizationShortCodeInvalidValidation: "Short code invalid",
    addOrganization_organizationLogoRequiredValidation: "Organization logo is required",
    addOrganization_saveErrorMesssage: "Save failed!",
    groups_groupNameTitle: "Role Name",
    groups_groupNameRequiredValidation: "Role name is required",
    groups_groupNameInvalidValidation: "Invalid role name",
    groups_roleTitle: "Role",
    groups_roleRequiredValidation: "Role is required",
    groups_colorTitle: "Color",
    groups_addTooltip: "Add",
    groups_searchPlaceholder: "Search",
    groups_searchTooltip: "Search",
    groups_actionsDeleteTooltip: "Remove all selected roles",
    groups_deleteRowTooltip: "Delete",
    groups_editRowTooltip: "Edit",
    groups_saveRowTooltip: "Save",
    groups_cancelSaveRowTooltip: "Cancel",
    groups_deleteRowText: "Are you sure you want to delete this row?",
    groups_noRecords: "No records to display",
    groups_labelDisplayedRows: "of",
    groups_labelRowsSelect: "rows",
    groups_nextTooltip: "Next Page",
    groups_previousTooltip: "Previous Page",
    groups_firstTooltip: "First Page",
    groups_lastTooltip: "Last Page",
    groups_errorDisplay: "Error displaying role list, please check if the organization is selected",
    schools_schoolNameTitle: "School Name",
    schools_addressTitle: "Address",
    schools_phoneTitle: "Phone",
    schools_emailTitle: "Email",
    schools_contactNameTitle: "Contact Name",
    schools_startDateTitle: "Start Date",
    schools_endDateTitle: "End Date",
    schools_gradesTitle: "Grades",
    schools_schoolLogoTitle: "School Logo",
    schools_colorTitle: "Color",
    schools_actionsDeleteTooltip: "Remove all selected schools",
    schools_exportTooltip: "Export",
    schools_uploadTooltip: "Upload",
    schools_addTooltip: "Add",
    schools_searchPlaceholder: "Search",
    schools_searchTooltip: "Search",
    schools_exportCSVName: "Export as CSV",
    schools_exportPDFName: "Export as PDF",
    schools_noRecords: "No records to display",
    schools_actionsEditTooltip: "Edit",
    schools_deleteRowTooltip: "Delete",
    schools_editRowTooltip: "Edit",
    schools_saveButtonLabel: "Save",
    schools_cancelButtonLabel: "Cancel",
    schools_saveRowTooltip: "Save",
    schools_cancelSaveRowTooltip: "Cancel",
    schools_deleteRowText: "Are you sure you want to delete this row?",
    schools_addProgramButton: "Add Program",
    schools_nameRequiredValidation: "Name is required",
    schools_nameInvalidValidation: "Invalid name",
    schools_addressRequiredValidation: "Address required",
    schools_addressInvalidValidation: "Address invalid",
    schools_phoneRequiredValidation: "Phone is required",
    schools_emailRequiredValidation: "Email is required",
    schools_emailInvalidValidation: "Email is invalid",
    schools_contactNameRequiredValidation: "Contact name is required",
    schools_labelDisplayedRows: "of",
    schools_labelRowsSelect: "rows",
    schools_nextTooltip: "Next Page",
    schools_previousTooltip: "Previous Page",
    schools_firstTooltip: "First Page",
    schools_lastTooltip: "Last Page",
    schools_errorDisplay: "Error displaying schools list, please check if the organization is selected",
    schools_savedUsersError: "Failed to show saved users, check if the organization is selected",
    school_saveSuccessfulMessage: "School has been created successfully",
    school_saveFailMessage: "Sorry, something went wrong, please try again",
    classes_classTitle: "Class",
    classes_statusTitle: "Status",
    classes_programTitle: "Program",
    classes_schoolTitle: "School",
    classes_subjectTitle: "Subject",
    classes_gradesTitle: "Grades",
    classes_startDateTitle: "Start Date",
    classes_endDateTitle: "End Date",
    classes_createDateTitle: "Create Date",
    classes_colorTitle: "Color",
    classes_noRecords: "No records to display",
    classes_actionsEditTooltip: "Edit",
    classes_deleteRowTooltip: "Delete",
    classes_editRowTooltip: "Edit",
    classes_addTooltip: "Add",
    classes_saveRowTooltip: "Save",
    classes_cancelSaveRowTooltip: "Cancel",
    classes_deleteRowText: "Are you sure you want to delete this row?",
    classes_actionsDeleteTooltip: "Remove all selected classes",
    classes_searchPlaceholder: "Search",
    classes_searchTooltip: "Search",
    classes_classRequiredValidation: "Class name is required",
    classes_classInvalidValidation: "Invalid class name",
    classes_statusRequiredValidation: "Status is required",
    classes_programRequiredValidation: "Program is required",
    classes_schoolRequiredValidation: "School is required",
    classes_subjectRequiredValidation: "Subject is required",
    classes_gradesRequiredValidation: "Grades are required",
    classes_startDateRequiredValidation: "Start date required",
    classes_endDateRequiredValidation: "End date required",
    classes_classRosterButton: "Add Student/Teacher",
    classes_exportCSVName: "Export as CSV",
    classes_exportPDFName: "Export as PDF",
    classes_exportTooltip: "Export",
    classes_uploadTooltip: "Upload",
    classes_labelDisplayedRows: "of",
    classes_labelRowsSelect: "rows",
    classes_nextTooltip: "Next Page",
    classes_previousTooltip: "Previous Page",
    classes_firstTooltip: "First Page",
    classes_lastTooltip: "Last Page",
    classes_errorDisplay: "Error displaying classes list, please check if the organization is selected",
    classes_savedSchoolsError: "Failed to show saved schools, check if the organization is selected",
    classes_classSavedMessage: "Class has been created successfully",
    classes_classSaveError: "Sorry, something went wrong, please try again",
    classes_classDeletedMessage: "Class has been deleted successfully",
    classes_classDeletedError: "Sorry, something went wrong, please try again",
    programs_programTitle: "Program",
    programs_subjectTitle: "Subject",
    programs_gradeTitle: "Grade",
    programs_colorTitle: "Color",
    programs_addCommentButton: "Add Comment",
    programs_viewProgramDetailsButton: "View Program Details",
    programs_actionsDeleteTooltip: "Remove all selected programs",
    programs_uploadTooltip: "Upload",
    programs_exportCSVName: "Export as CSV",
    programs_exportPDFName: "Export as PDF",
    programs_exportTooltip: "Export",
    programs_searchPlaceholder: "Search",
    programs_searchTooltip: "Search",
    programs_noRecords: "No records to display",
    programs_deleteRowTooltip: "Delete",
    programs_editRowTooltip: "Edit",
    programs_addTooltip: "Add",
    programs_saveRowTooltip: "Save",
    programs_cancelSaveRowTooltip: "Cancel",
    programs_deleteRowText: "Are you sure you want to delete this row?",
    programs_programRequiredValidation: "Program is requried",
    programs_programInvalidValidation: "Program is invalid",
    programs_labelDisplayedRows: "of",
    programs_labelRowsSelect: "rows",
    programs_nextTooltip: "Next Page",
    programs_previousTooltip: "Previous Page",
    programs_firstTooltip: "First Page",
    programs_lastTooltip: "Last Page",
    programs_schoolLabel: "School",
    grades_gradeTitle: "Grade",
    grades_ageRangeTitle: "Age range",
    grades_colorTitle: "Color",
    grades_programsTitle: "Programs",
    grades_progressToTitle: "Progress To",
    grades_labelDisplayedRows: "of",
    grades_labelRowsSelect: "rows",
    grades_nextTooltip: "Next Page",
    grades_previousTooltip: "Previous Page",
    grades_firstTooltip: "First Page",
    grades_lastTooltip: "Last Page",
    grades_exportTooltip: "Export",
    grades_uploadTooltip: "Upload",
    grades_addTooltip: "Add",
    grades_searchPlaceholder: "Search",
    grades_searchTooltip: "Search",
    grades_exportCSVName: "Export as CSV",
    grades_exportPDFName: "Export as PDF",
    grades_noRecords: "No records to display",
    grades_deleteRowTooltip: "Delete",
    grades_editRowTooltip: "Edit",
    grades_saveRowTooltip: "Save",
    grades_cancelSaveRowTooltip: "Cancel",
    grades_deleteRowText: "Are you sure you want to delete this row?",
    grades_actionsDeleteTooltip: "Remove selected grades",
    navMenu_analyticsAndReportsTitle: "Analytics and Reports",
    navMenu_analyticsAndReportsDescription: "Monitor usage across your organization",
    navMenu_assessmentsTitle: "Assessments",
    navMenu_assessmentsDescription: "View and edit your assessments",
    navMenu_billingTitle: "Billing",
    navMenu_billingDescription: "Manage billing and subscriptions",
    navMenu_contentLibraryTitle: "Content Library",
    navMenu_contentLibraryDescription: "Approve, manage, and view your content library",
    navMenu_dataSecurityTitle: "Data Security and Migration",
    navMenu_dataSecurityDescription: "Manage data usage and set data usage settings",
    navMenu_devicesTitle: "Devices, Apps and Licenses",
    navMenu_devicesDescription: "Organization-owned devices and app licenses",
    navMenu_groupsTitle: "Roles",
    navMenu_groupsDescription: "Add or manage roles",
    navMenu_organizationTitle: "Organization Profile",
    navMenu_organizationDescription: "Update personalization and manage your organization",
    navMenu_securityTitle: "Security",
    navMenu_securityDescription: "Configure security settings",
    navMenu_schoolsTitle: "Schools and Resources",
    navMenu_schoolsDescription: "Manage schools and resources",
    navMenu_scheduleTitle: "Schedule",
    navMenu_scheduleDescription: "Manage your schedules and join upcoming classes",
    navMenu_supportTitle: "Support",
    navMenu_supportDescription: "Get onboarding, training, and troubleshooting support",
    navMenu_usersTitle: "Users",
    navMenu_usersDescription: "Manage users and their permissions",
    navMenu_futureRelease: "This is currently planned for a future release!",
    classRoster_nameTitle: "Name",
    classRoster_groupTitle: "Role",
    classRoster_actionsDeleteTooltip: "Remove all selected class rosters.",
    classRoster_actionsUploadTooltip: "Upload",
    classRoster_userAddedMessage: "User added to class",
    classRoster_userAddedError: "Sorry, something went wrong, please try again",
    classRoster_userRemovedMessage: "User removed from class",
    classRoster_userRemovedError: "Sorry, something went wrong, please try again",
    classRoster_noRecords: "No records to display",
    classRoster_actionsEditTooltip: "Edit",
    classRoster_deleteRowTooltip: "Delete",
    classRoster_editRowTooltip: "Edit",
    classRoster_addTooltip: "Add",
    classRoster_saveRowTooltip: "Save",
    classRoster_cancelSaveRowTooltip: "Cancel",
    classRoster_deleteRowText: "Are you sure you want to delete this row?",
    classRoster_searchPlaceholder: "Search",
    classRoster_searchTooltip: "Search",
    classRoster_exportCSVName: "Export as CSV",
    classRoster_exportPDFName: "Export as PDF",
    classRoster_exportTooltip: "Export",
    classRoster_uploadTooltip: "Upload",
    classRoster_labelDisplayedRows: "of",
    classRoster_labelRowsSelect: "rows",
    classRoster_nextTooltip: "Next Page",
    classRoster_previousTooltip: "Previous Page",
    classRoster_firstTooltip: "First Page",
    classRoster_lastTooltip: "Last Page",

};
export default messages;
