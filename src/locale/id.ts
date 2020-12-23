// id.ts
const messages: Record<string, string> = {
    ERROR_ACCOUNT_BANNED: "Akun Anda telah diblokir",
    ERROR_ALREADY_VERIFIED: "Akun Anda telah diverifikasi",
    ERROR_INPUT_INVALID_FORMAT: "Format tidak valid",
    ERROR_INPUT_TOO_LONG: "Terlalu panjang",
    ERROR_INPUT_TOO_SHORT: "Terlalu singkat",
    ERROR_INVALID_LOGIN: "Login Tidak Valid",
    ERROR_INVALID_PASSWORD: "Kata sandi salah",
    ERROR_INVALID_VERIFICATION_CODE: "Kode verifikasi tidak benar",
    ERROR_MOCK: "Kesalahan data simulasi Rest API",
    ERROR_UNKOWN: "Kesalahan tidak diketahui",
    ERROR_VERIFICATION_NOT_FOUND: "Verifikasi tidak ditemukan",
    ERROR_FUNCTION_NOT_FOUND: "Fungsi tidak ditemukan",

    auth_successPrompt: "Berhasil masuk",
    auth_failedPrompt: "Gagal masuk",

    signup_signupPrompt: "Daftar",
    signup_signedUpAlready: "Punya akun?",
    signup_signupButton: "Daftar",
    signupInvite_signupPrompt: "Selamat datang di {organization}, {name}!",
    signupInvite_mistake: "Jika undangan yang dikirimkan salah",
    signupInvite_click: "klik disini.",

    password_forgotPrompt: "Pemulihan Akun",
    password_forgotRecover: "Memulihkan",
    password_forgotBack: "Kembali",
    password_restorePrompt: "Atur Ulang Kata Sandi",
    password_confirmRestore: "Setel kata sandi baru",
    password_changePrompt: "Ganti kata sandi",
    password_confirmChange: "Setujui password",
    password_changedPrompt: "Berhasil mengubah kata sandi Anda",
    password_changedConfirm: "Pergi ke dashboard",

    verify_emailPrompt: "verifikasi email",
    verify_emailDirections: "Silakan periksa email untuk kode verifikasi Anda",
    verify_emailCode: "Masukkan kode verifikasi Anda",
    verify_emailSuccess: "Email Anda telah diverifikasi",

    verify_invitePrompt: "Punya kode undangan?",
    verify_inviteDirections: "Jika ya, masukkan kode undangan Anda ",
    verify_inviteCode: "Masukkan kode undangan Anda",
    verify_inviteSkip: "Saya tidak memiliki kode undangan",

    verify_phonePrompt: "Verifikasi Nomor Telepon",
    verify_phoneDirections: "Periksa pesan kode verifikasi yang dikirim ke ponsel Anda",
    verify_phoneCode: "Masukkan kode verifikasi Anda",

    classSettings_classroomSettings: "Pengaturan Ruang Kelas",

    component_switchDark: "gelap",
    component_switchLight: "cahaya",

    button_create: "Membuat",
    button_continue: "lanjutkan",
    button_continueSignUp: "Lanjutkan dengan Mendaftar",

    form_emailLabel: "Email atau Telepon",
    form_nameLabel: "Siapa nama Anda?",
    form_passwordLabel: "Kata sandi",
    form_passwordConfirmLabel: "setujui password",
    form_newPasswordLabel: "kata sandi baru",
    form_newPasswordConfirmLabel: "Konfirmasi password baru",
    form_passwordForgotEmailLabel: "Masukkan email atau nomor telepon Anda",
    form_newPasswordCodeLabel: "Kode verifikasi",
    form_currentPasswordLabel: "kata sandi saat ini",

    invited_successPrompt: "Berhasil bergabung dengan {organization}.",
    invited_failedPrompt: "Ups! Ada yang tidak beres!",

    locale_select: "Pilih bahasa",
    locale_tooltip: "Ganti bahasa",

    login_createAccount: "Buat sebuah akun",
    login_forgotPassword: "Tidak ingat kata sandi?",
    login_loginButton: "Masuk",
    login_loginPrompt: "Masuk",

    navMenu_adminConsoleLabel: "Konsol Admin",
    navMenu_assessmentsLabel: "Penilaian",
    navMenu_scheduleLabel: "jadwal",
    navMenu_libraryLabel: "Perpustakaan",
    navMenu_liveLabel: "langsung",
    navMenu_homeLabel: "Home", // TODO(Henrik): translate
    navMenu_peopleLabel: "Orang-orang",
    navMenu_reportLabel: "Melaporkan",
    navMenu_adminLabel: "Admin",

    userSettings_profile: "Profil",
    userSettings_myAccount: "Akun saya",
    userSettings_signout: "Keluar",

    privacy_helpLink: "Bantuan",
    privacy_privacyLink: "Pribadi",
    privacy_termsLink: "Persyaratan",

    live_welcome: "Selamat datang di KidsLoop",
    live_lessonPlanLabel: "Rencana pelajaran",
    live_lessonPlanSelect: "Pilih Rencana Pelajaran",
    live_liveButton: "Tampilan langsung",
    live_featuredContent: "Konten Unggulan",

    header_viewOrg: "lihat organisasi",
    header_viewUsers: "lihat pengguna",
    header_viewGroups: "lihat grup",
    header_viewSchools: "llihat sekolah",
    header_classes: "kelas",
    header_programs: "program",
    header_grades: "tingkat",
    users_suffix: "akhiran",
    users_firstName: "nama depan",
    users_lastName: "nama belakang",
    users_middleName: "nama tengah",
    users_birthDate: "Tanggal Lahir",
    users_groups: "grup",
    users_school: "sekolah",
    users_avatar: "Avatar",
    users_contactInfo: "Contact Info",
    users_createDate: "Tanggal dibuat",
    users_updateDate: "Tanggal diperbarui",
    users_sendInvite: "kirim undangan",
    users_noRecords: "tidak ada tampilan rekaman ",
    users_labelDisplayedRows: "dari",
    users_labelRowsSelect: "baris",
    users_nextTooltip: "halaman selanjutnya",
    users_previousTooltip: "halaman sebelumnya",
    users_firstTooltip: "halaman pertama",
    users_lastTooltip: "halaman terakhir",
    users_exportTooltip: "Ekspor",
    users_uploadTooltip: "diunggah",
    users_addTooltip: "tambahkan",
    users_searchPlaceholder: "cari",
    users_searchTooltip: "cari",
    users_exportCSVName: "ekspor sebagai CSV",
    users_exportPDFName: "ekspor sebagai PDF",
    users_firstNameRequiredValidation: "nama depan diperlukan",
    users_firstNameInvalidValidation: "nama akhir diperlukan",
    users_firstNameMaxValidation: "nama pertama harus maksimal 10 karakter ",
    users_firstNameMinValidation: "nama pertama harus minimal 3 karakter ",
    users_middleNameInvalidValidation: "nama tengah tidak valid",
    users_middleNameMaxValidation: "nama tengah harus maksimal 10 karakter ",
    users_middleNameMinValidation: "nama tengah harus minimal 3 karakter ",
    users_lastNameRequiredValidation: "nama akhir dibutuhkan",
    users_lastNameInvalidValidation: "nama akhir tidak valid",
    users_lastNameMaxValidation: "nama akhir harus maksimal 10 karakter ",
    users_lastNameMinValidation: "nama akhir harus minimal 3 karakter ",
    users_groupRequiredValidation: "grup harus diisi",
    users_initialSchoolValue: "tidak ada sekolah",
    users_allSchoolsValue: "semua sekolah",
    users_emailMaxValidation: "Email harus maksimal 30 karakter ",
    users_emailInvalidValidation: "email tidak valid",
    users_resendInviteButton: "kirim ulang undangan",
    users_studentGroupOver18: "dengan ini, anda menyatakan bahwa alamat surel ini adalah milik siswa di atas 18 tahun",
    users_okButton: "OK",
    users_cancelButton: "Batal",
    users_invitationSent: "undangan dikirim ke pengguna",
    users_actionsDeleteTooltip: "hapus semua pengguna terpilih",
    users_errorDisplay: "error menampilkan pengguna",
    allOrganization_myOrganizations: "organisasi saya",
    allOrganization_organizationName: "nama organisasi",
    allOrganization_roles: "peranan",
    allOrganization_phone: "nomor telepon",
    allOrganization_email: "email",
    allOrganization_actionsDeleteTooltip: "hapus semua organisasi terpilih",
    allOrganization_actionsAddTooltip: "tambah organisasi",
    allOrganization_actionsEditTooltip: "edit",
    allOrganization_deleteRowTooltip: "hapus",
    allOrganization_changePasswordButton: "ganti sandi",
    allOrganization_changeOwner: "ganti pemilik",
    allOrganization_changeOwnerText: "Pilih satu pengguna sebagai pemilik organisasi",
    allOrganization_searchPlaceholder: "cari",
    allOrganization_searchTooltip: "cari",
    allOrganization_joinedOrganizations: "organisasi yang bergabung",
    allOrganization_role: "peran",
    allOrganization_noRecords: "tidak ada tampilan rekaman ",
    allOrganization_labelDisplayedRows: "dari",
    allOrganization_labelRowsSelect: "baris",
    allOrganization_nextTooltip: "halaman selanjutnya",
    allOrganization_previousTooltip: "halaman sebelumnya",
    allOrganization_firstTooltip: "halaman pertama",
    allOrganization_lastTooltip: "halaman terakhir",
    allOrganization_nameRequiredValidation: "nama harus diisi",
    allOrganization_groupRequiredValidation: "grup harus diisi",
    allOrganization_emailInvalidValidation: "email tidak valid",
    allOrganization_leaveOrganizationButton: "tinggalkan organisasi",
    allOrganization_leaveOrganizationConfirm: "setelah konfirmasi diberikan, anda tidak akan dihubungkan  dengan organisasi. Apakah dilanjutkan?",
    allOrganization_okButton: "OK",
    allOrganization_cancelButton: "batal",
    allOrganization_userLabel: "pengguna",
    allOrganization_leftOrganizationMessage: "anda telah keluar dari organisasi",
    joinedOrganization_email: "Organization Owner's Email",
    joinedOrganization_role: "Your Role",
    addOrganization_errorDisplay: "error menampilkan organisasi",
    addOrganization_nameOfOrganizationLabel: "nama organisasi",
    addOrganization_addressLabel: "alamat",
    addOrganization_phoneNumberLabel: "nomor telepon",
    addOrganization_emailAddressLabel: "alamat email",
    addOrganization_primaryContactLabel: "nomor utama",
    addOrganization_organizationShortCodeLabel: "kode singkat organisasi",
    addOrganization_addOrganizationLogoLabel: "tambah logo organisasi",
    addOrganization_organizationColorLabel: "warna organisasi",
    addOrganization_saveButtonLabel: "simpan",
    addOrganization_cancelButtonLabel: "batal",
    addOrganization_nameOfOrganizationPlaceholder: "NAMA RESMI ORGANISASI ANDA",
    addOrganization_addressPlaceholder: "ALAMAT ORGANISASI",
    addOrganization_emailAddressPlaceholder: "EMAIL ORGANISASI",
    addOrganization_organizationShortCodePlaceholder: "kode pendek organisasi",
    addOrganization_organizationNameRequiredValidation: "nama organisasi diperlukan",
    addOrganization_organizationNameInvalidValidation: "nama organisasi tidak valid",
    addOrganization_organizationNameMaxValidation: "nama organisasi harus maksimal 30 karakter ",
    addOrganization_organizationNameMinValidation: "nama organisasi harus minimal 5 karakter ",
    addOrganization_addressRequiredValidation: "alamat diperlukan",
    addOrganization_addressInvalidValidation: "alamat tidak valid",
    addOrganization_addressMaxValidation: "Alamat harus memiliki maksimal 30 karakter",
    addOrganization_addressMinValidation: "Alamat harus memiliki minimal 10 karakter",
    addOrganization_address2InvalidValidation: "alamat kedua tidak valid",
    addOrganization_address2MaxValidation: "alamat kedua harus maksimal 30 karakter",
    addOrganization_address2MinValidation: "alamat kedua harus minimal 10 karakter ",
    addOrganization_phoneNumberRequiredValidation: "nomor telepon diperlukan",
    addOrganization_phoneNumberMaxValidation: "nomor telepon harus maksimal 15 karakter ",
    addOrganization_phoneNumberMinValidation: "nomor telepon harus minimal 10 karakter ",
    addOrganization_emailAddressRequiredValidation: "alamat email wajib diisi",
    addOrganization_emailAddressMaxValidation: "alamat email harus maksimal 30 karakter ",
    addOrganization_emailAddressInvalidValidation: "alamat email tidak valid",
    addOrganization_primaryContactRequiredValidation: "nomor utama wajib diisi",
    addOrganization_organizationShortCodeRequiredValidation: "kode singkat organisasi dihasilkan jika nama organisasi valid",
    addOrganization_organizationShortCodeInvalidValidation: "kode singkat tidak valid",
    addOrganization_organizationLogoRequiredValidation: "logo organisasi wajib diisi",
    addOrganization_saveErrorMesssage: "gagal menyimpan",
    groups_groupNameTitle: "nama grup",
    groups_groupNameRequiredValidation: "nama grup harus diisi",
    groups_groupNameInvalidValidation: "nama grup tidak valid",
    groups_roleTitle: "peranan",
    groups_roleRequiredValidation: "peran wajib diisi",
    groups_colorTitle: "warna",
    groups_addTooltip: "tambah",
    groups_searchPlaceholder: "cari",
    groups_searchTooltip: "cari",
    groups_actionsDeleteTooltip: "hapus semua grup yang dipilih",
    groups_deleteRowTooltip: "hapus",
    groups_editRowTooltip: "edit",
    groups_saveRowTooltip: "simpan",
    groups_cancelSaveRowTooltip: "batal",
    groups_deleteRowText: "Anda yakin ingin menghapus baris ini?",
    groups_noRecords: "tidak ada tampilan rekaman ",
    groups_labelDisplayedRows: "dari",
    groups_labelRowsSelect: "baris",
    groups_nextTooltip: "halaman selanjutnya",
    groups_previousTooltip: "halaman sebelumnya",
    groups_firstTooltip: "halaman pertama",
    groups_lastTooltip: "halaman terakhir",
    groups_errorDisplay: "error dalam menampilkan daftar kelompok. Periksa apakah organisasi telah dipilih",
    schools_schoolNameTitle: "nama sekolah",
    schools_addressTitle: "alamat",
    schools_phoneTitle: "telepon",
    schools_emailTitle: "email",
    schools_contactNameTitle: "nama kontak",
    schools_startDateTitle: "tanggal mulai",
    schools_endDateTitle: "tanggal berakhir",
    schools_gradesTitle: "tingkatan",
    schools_schoolLogoTitle: "logo sekolah",
    schools_colorTitle: "warna",
    schools_actionsDeleteTooltip: "hapus sekolah terpilih",
    schools_exportTooltip: "ekspor",
    schools_uploadTooltip: "unggah",
    schools_addTooltip: "tambah",
    schools_searchPlaceholder: "cari",
    schools_searchTooltip: "cari",
    schools_exportCSVName: "ekspor sebagai CSV",
    schools_exportPDFName: "ekspor sebagai PDF",
    schools_noRecords: "tidak ada tampilan rekaman ",
    schools_actionsEditTooltip: "edit",
    schools_deleteRowTooltip: "hapus",
    schools_editRowTooltip: "edit",
    schools_saveButtonLabel: "simpan",
    schools_cancelButtonLabel: "batal",
    schools_saveRowTooltip: "simpan",
    schools_cancelSaveRowTooltip: "batal",
    schools_deleteRowText: "anda yakin akan menghapus barisan ini?",
    schools_addProgramButton: "tambahkan program",
    schools_nameRequiredValidation: "nama diperlukan",
    schools_nameInvalidValidation: "nama tidak valid",
    schools_addressRequiredValidation: "alamat diperlukan",
    schools_addressInvalidValidation: "alamat tidak valid",
    schools_phoneRequiredValidation: "nomor telepon diperlukan",
    schools_emailRequiredValidation: "email diperlukan",
    schools_emailInvalidValidation: "email tidak valid",
    schools_contactNameRequiredValidation: "nama kontak diperlukan",
    schools_labelDisplayedRows: "dari",
    schools_labelRowsSelect: "baris",
    schools_nextTooltip: "halaman berikutnya",
    schools_previousTooltip: "halaman sebelumnya",
    schools_firstTooltip: "halaman pertama",
    schools_lastTooltip: "halaman terakhir",
    schools_errorDisplay: "error dalam menampilkan daftar sekolah. Periksa apakah organisasi telah dipilih",
    schools_savedUsersError: "Gagal menampilkan pengguna yang menyimpan, periksa apakah organisasi telah dipilih",
    school_saveSuccessfulMessage: "sekolah berhasil dibuat",
    school_saveFailMessage: "Maaf, ada yang salah. Silakan dicoba lagi.",
    classes_classTitle: "kelas",
    classes_statusTitle: "status",
    classes_programTitle: "program",
    classes_schoolTitle: "sekolah",
    classes_subjectTitle: "subyek",
    classes_gradesTitle: "tingkat",
    classes_startDateTitle: "tanggal mulai",
    classes_endDateTitle: "tanggal berakhir",
    classes_createDateTitle: "buat tanggal",
    classes_colorTitle: "warna",
    classes_noRecords: "tidak ada tampilan rekaman ",
    classes_actionsEditTooltip: "edit",
    classes_deleteRowTooltip: "hapus",
    classes_editRowTooltip: "edit",
    classes_addTooltip: "tambah",
    classes_saveRowTooltip: "simpan",
    classes_cancelSaveRowTooltip: "batal",
    classes_deleteRowText: "anda yakin akan menghapus barisan ini?",
    classes_actionsDeleteTooltip: "hapus kelas terpilih",
    classes_searchPlaceholder: "cari",
    classes_searchTooltip: "cari",
    classes_classRequiredValidation: "nama kelas diperlukan",
    classes_classInvalidValidation: "nama kelas tidak valid",
    classes_statusRequiredValidation: "status diperlukan",
    classes_programRequiredValidation: "program diperlukan",
    classes_schoolRequiredValidation: "sekolah diperlukan",
    classes_subjectRequiredValidation: "subyek diperlukan",
    classes_gradesRequiredValidation: "tingkatan diperlukan",
    classes_startDateRequiredValidation: "tanggal mulai diperlukan",
    classes_endDateRequiredValidation: "tanggal berakhir diperlukan",
    classes_classRosterButton: "tambah siswa/guru",
    classes_exportCSVName: "ekspor sebagai CSV",
    classes_exportPDFName: "ekspor sebagai PDF",
    classes_exportTooltip: "ekspor",
    classes_uploadTooltip: "unggah",
    classes_labelDisplayedRows: "dari",
    classes_labelRowsSelect: "baris",
    classes_nextTooltip: "halaman selanjutnya",
    classes_previousTooltip: "halaman sebelumnya",
    classes_firstTooltip: "halaman terakhir",
    classes_lastTooltip: "halaman terakhir",
    classes_errorDisplay: "error dalam menampilkan daftar kelas. Periksa apakah organisasi telah dipilih",
    classes_savedSchoolsError: "Gagal menampilkan sekolah yang menyimpan, periksa apakah organisasi telah dipilih",
    classes_classSavedMessage: "kelas berhasil dibuat",
    classes_classSaveError: "Maaf, ada yang salah. Silakan dicoba lagi.",
    classes_classDeletedMessage: "Class has been deleted successfully",
    classes_classDeletedError: "Sorry, something went wrong, please try again",
    programs_programTitle: "program",
    programs_subjectTitle: "subyek",
    programs_gradeTitle: "tingkatan",
    programs_colorTitle: "warna",
    programs_addCommentButton: "tambahkan komentar",
    programs_viewProgramDetailsButton: "lihat detail program",
    programs_actionsDeleteTooltip: "hapus semua program terpilih",
    programs_uploadTooltip: "unggah",
    programs_exportCSVName: "ekspor sebagai CSV",
    programs_exportPDFName: "ekspor sebagai PDF",
    programs_exportTooltip: "ekspor",
    programs_searchPlaceholder: "cari",
    programs_searchTooltip: "cari",
    programs_noRecords: "tidak ada tampilan rekaman ",
    programs_deleteRowTooltip: "hapus",
    programs_editRowTooltip: "edit",
    programs_addTooltip: "tambahkan",
    programs_saveRowTooltip: "simpan",
    programs_cancelSaveRowTooltip: "batal",
    programs_deleteRowText: "anda yakin akan menghapus barisan ini?",
    programs_programRequiredValidation: "program diperlukan",
    programs_programInvalidValidation: "program tidak valid",
    programs_labelDisplayedRows: "dari",
    programs_labelRowsSelect: "baris",
    programs_nextTooltip: "halaman selanjutnya",
    programs_previousTooltip: "halaman sebelumnya",
    programs_firstTooltip: "halaman pertama",
    programs_lastTooltip: "halaman terakhir",
    programs_schoolLabel: "sekolah",
    grades_gradeTitle: "tingkatan",
    grades_ageRangeTitle: "rentang usia",
    grades_colorTitle: "warna",
    grades_programsTitle: "program",
    grades_progressToTitle: "kemajuan ke",
    grades_labelDisplayedRows: "dari",
    grades_labelRowsSelect: "baris",
    grades_nextTooltip: "halaman selanjutnya",
    grades_previousTooltip: "halaman sebelumnya",
    grades_firstTooltip: "halaman pertama",
    grades_lastTooltip: "halaman terakhir",
    grades_exportTooltip: "ekspor",
    grades_uploadTooltip: "unggah",
    grades_addTooltip: "tambah",
    grades_searchPlaceholder: "cari",
    grades_searchTooltip: "cari",
    grades_exportCSVName: "ekspor sebagai CSV",
    grades_exportPDFName: "ekspor sebagai PDF",
    grades_noRecords: "tidak ada tampilan rekaman ",
    grades_deleteRowTooltip: "hapus",
    grades_editRowTooltip: "edit",
    grades_saveRowTooltip: "simpan",
    grades_cancelSaveRowTooltip: "batal",
    grades_deleteRowText: "anda yakin akan menghapus barisan ini?",
    grades_actionsDeleteTooltip: "hapus tingkatan terpilih",
    navMenu_analyticsAndReportsTitle: "hasil analisa dan laporan",
    navMenu_analyticsAndReportsDescription: "Pantau penggunaan di seluruh organisasi Anda",
    navMenu_assessmentsTitle: "Assessments",
    navMenu_assessmentsDescription: "View and edit your assessments",
    navMenu_billingTitle: "Penagihan",
    navMenu_billingDescription: "atur penagihan dan langganan",
    navMenu_contentLibraryTitle: "perpustakaan konten",
    navMenu_contentLibraryDescription: "setujui, kelola, dan lihat perpustakaan konten Anda",
    navMenu_dataSecurityTitle: "keamanan data dan migrasi",
    navMenu_dataSecurityDescription: "kelola penggunaan data dan atur penggunaan data",
    navMenu_devicesTitle: "perangkat, aplikasi, dan lisensi",
    navMenu_devicesDescription: "perangkat dan lisensi aplikasi milik organisasi",
    navMenu_groupsTitle: "grup",
    navMenu_groupsDescription: "Tambahkan atau kelola grup",
    navMenu_organizationTitle: "Profil Organisasi",
    navMenu_organizationDescription: "Perbarui personalisasi dan kelola organisasi Anda",
    navMenu_securityTitle: "Keamanan",
    navMenu_securityDescription: "Konfigurasikan pengaturan keamanan",
    navMenu_schoolsTitle: "Sekolah dan Sumber Daya",
    navMenu_schoolsDescription: "Kelola sekolah dan sumber daya",
    navMenu_scheduleTitle: "Schedule",
    navMenu_scheduleDescription: "Manage your schedules and join upcoming classes",
    navMenu_supportTitle: "dukung",
    navMenu_supportDescription: "Dapatkan dukungan orientasi, pelatihan, dan pemecahan masalah",
    navMenu_usersTitle: "pengguna",
    navMenu_usersDescription: "Kelola pengguna dan izin mereka",
    navMenu_futureRelease: "ini telah direncanakan untuk dirilis di masa mendatang",
    classRoster_nameTitle: "nama",
    classRoster_groupTitle: "grup",
    classRoster_actionsDeleteTooltip: "hapus semua kelas terpilih",
    classRoster_actionsUploadTooltip: "unggah",
    classRoster_userAddedMessage: "Pengguna ditambahkan ke kelas",
    classRoster_userAddedError: "Maaf, ada yang salah. Silakan dicoba lagi.",
    classRoster_userRemovedMessage: "User removed from class",
    classRoster_userRemovedError: "Sorry, something went wrong, please try again",
    classRoster_noRecords: "tidak ada tampilan rekaman ",
    classRoster_actionsEditTooltip: "edit",
    classRoster_deleteRowTooltip: "hapus",
    classRoster_editRowTooltip: "edit",
    classRoster_addTooltip: "tambah",
    classRoster_saveRowTooltip: "simpan",
    classRoster_cancelSaveRowTooltip: "batal",
    classRoster_deleteRowText: "anda yakin akan menghapus barisan ini?",
    classRoster_searchPlaceholder: "cari",
    classRoster_searchTooltip: "cari",
    classRoster_exportCSVName: "ekspor sebagai CSV",
    classRoster_exportPDFName: "ekspor sebagai PDF",
    classRoster_exportTooltip: "ekspor",
    classRoster_uploadTooltip: "unggah",
    classRoster_labelDisplayedRows: "dari",
    classRoster_labelRowsSelect: "baris",
    classRoster_nextTooltip: "halaman selanjutnya",
    classRoster_previousTooltip: "halaman sebelumnya",
    classRoster_firstTooltip: "halaman pertama",
    classRoster_lastTooltip: "halaman terakhir",

};
export default messages;
