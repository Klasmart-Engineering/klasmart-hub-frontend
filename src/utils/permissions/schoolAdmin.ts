import { PermissionGroup } from "./permissionDetails";

export const schoolAdminRole: PermissionGroup = {
    role_name: `School Admin`,
    permissions: [
        `logos_1000`,
        `my_account_1010`,
        `my_settings_1020`,
        `personalizations_1030`,
        `my_learners_page_1040`,
        `my_learners_dashboards_1041`,
        `my_learners_schedule_1042`,
        `my_learners_study_plan_1043`,
        `my_learners_notifications_1044`,
        `my_learners_make_a_payment_1045`,
        `my_learners_coupon_management_1046`,
        `my_learners_view_promotions_1047`,
        `my_learners_class_recordings_1048`,
        `my_learners_attendance_report_1049`,
        `live_100`,
        `go_live_101`,
        `live_default_interface_170`,
        `attend_live_class_as_a_teacher_186`,
        `library_200`,
        `create_content_page_201`,
        `unpublished_content_page_202`,
        `pending_content_page_203`,
        `published_content_page_204`,
        `archived_content_page_205`,
        `view_asset_db_300`,
        `view_my_unpublished_content_210`,
        `view_my_pending_212`,
        `view_my_published_214`,
        `view_org_published_215`,
        `view_my_archived_216`,
        `view_org_archived_217`,
        `view_my_school_published_218`,
        `view_my_school_pending_225`,
        `view_my_school_archived_226`,
        `create_lesson_material_220`,
        `copy_content_222`,
        `create_my_schools_content_223`,
        `edit_my_unpublished_content_230`,
        `edit_my_pending_content_232`,
        `edit_my_published_content_234`,
        `edit_my_schools_published_247`,
        `edit_my_schools_pending_248`,
        `delete_my_unpublished_content_240`,
        `remove_my_schools_published_242`,
        `library_settings_270`,
        `approve_pending_content_271`,
        `reject_pending_content_272`,
        `archive_published_content_273`,
        `republish_archived_content_274`,
        `delete_archived_content_275`,
        `details_upload_thumbnail_276`,
        `details_manually_add_program_277`,
        `details_manually_add_developmental_skill_278`,
        `details_manually_add_skills_category_279`,
        `details_manually_add_suitable_age_280`,
        `details_manually_add_grade_281`,
        `share_content_282`,
        `favorite_content_283`,
        `associate_learning_outcomes_284`,
        `publish_featured_content_with_lo_285`,
        `publish_featured_content_no_lo_286`,
        `publish_free_content_with_lo_287`,
        `publish_free_content_no_lo_288`,
        `asset_db_300`,
        `create_asset_page_301`,
        `view_asset_310`,
        `view_live_recordings_311`,
        `create_asset_320`,
        `upload_asset_321`,
        `edit_asset_330`,
        `download_asset_331`,
        `delete_asset_340`,
        `asset_db_settings_380`,
        `assessments_400`,
        `create_learning_outcome_page_401`,
        `unpublished_page_402`,
        `pending_page_403`,
        `learning_outcome_page_404`,
        `milestones_page_405`,
        `assessments_page_406`,
        `view_my_unpublished_learning_outcome_410`,
        `view_my_pending_learning_outcome_412`,
        `view_org_pending_learning_outcome_413`,
        `view_completed_assessments_414`,
        `view_in_progress_assessments_415`,
        `view_published_learning_outcome_416`,
        `view_unpublished_milestone_417`,
        `view_published_milestone_418`,
        `view_unpublished_standard_419`,
        `view_published_standard_420`,
        `view_school_completed_assessments_426`,
        `view_school_in_progress_assessments_427`,
        `create_learning_outcome_421`,
        `create_milestone_422`,
        `create_standard_423`,
        `edit_my_unpublished_learning_outcome_430`,
        `edit_my_pending_learning_outcome_434`,
        `edit_org_pending_learning_outcome_435`,
        `edit_published_learning_outcome_436`,
        `edit_attendance_for_in_progress_assessment_438`,
        `edit_in_progress_assessment_439`,
        `edit_unpublished_milestone_440`,
        `edit_published_milestone_441`,
        `edit_unpublished_standard_442`,
        `edit_published_standard_443`,
        `delete_my_unpublished_learninng_outcome_444`,
        `delete_org_unpublished_learning_outcome_445`,
        `delete_my_pending_learning_outcome_446`,
        `delete_org_pending_learning_outcome_447`,
        `delete_published_learning_outcome_448`,
        `delete_unpublish_milestone_449`,
        `delete_published_milestone_450`,
        `delete_unpublished_standard_451`,
        `delete_published_standard_452`,
        `add_learning_outcome_to_content_485`,
        `schedule_500`,
        `create_schedule_page_501`,
        `view_my_calendar_510`,
        `view_org_calendar_511`,
        `view_school_calendar_512`,
        `create_event_520`,
        `create_my_schools_schedule_events_522`,
        `edit_event_523`,
        `delete_event_540`,
        `schedule_settings_580`,
        `schedule_quick_start_581`,
        `schedule_search_582`,
        `reports_600`,
        `school_reports_602`,
        `teacher_reports_603`,
        `class_reports_604`,
        `student_reports_605`,
        `view_my_school_reports_611`,
        `report_student_achievement_615`,
        `report_learning_outcomes_in_categories_616`,
        `share_report_630`,
        `download_report_631`,
        `report_settings_680`,
        `organizational_profile_10100`,
        `view_all_organization_details_page_10101`,
        `view_this_organization_profile_10110`,
        `view_my_organization_profile_10111`,
        `view_organization_details_10112`,
        `edit_my_organization_10331`,
        `edit_email_address_10332`,
        `edit_password_10333`,
        `join_organization_10881`,
        `leave_organization_10882`,
        `school_resources_20100`,
        `define_school_program_page_20101`,
        `define_age_ranges_page_20102`,
        `define_grade_page_20103`,
        `view_school_20110`,
        `view_program_20111`,
        `view_age_range_20112`,
        `view_grades_20113`,
        `view_classes_20114`,
        `create_school_20220`,
        `create_program_20221`,
        `create_age_range_20222`,
        `create_grade_20223`,
        `create_class_20224`,
        `add_students_to_class_20225`,
        `add_teachers_to_class_20226`,
        `edit_school_20330`,
        `edit_program_20331`,
        `edit_age_range_20332`,
        `edit_grade_20333`,
        `edit_class_20334`,
        `move_students_to_another_class_20335`,
        `edit_teacher_in_class_20336`,
        `upload_class_roster_with_teachers_20884`,
        `upload_classes_20890`,
        `users_40100`,
        `view_users_40110`,
        `create_users_40220`,
        `edit_users_40330`,
        `delete_users_40440`,
        `send_invitation_40882`,
        `support_60100`,
        `online_support_60101`,
        `view_any_featured_programs_70001`,
        `bada_rhyme_71000`,
        `bada_genius_71001`,
        `bada_talk_71002`,
        `bada_sound_71003`,
        `bada_read_71004`,
        `bada_math_71005`,
        `bada_stem_71006`,
        `badanamu_esl_71007`,
        `free_programs_80000`,
        `view_free_programs_80001`,
        `bada_rhyme_81000`,
        `bada_genius_81001`,
        `bada_talk_81002`,
        `bada_sound_81003`,
        `bada_read_81004`,
        `bada_math_81005`,
        `bada_stem_81006`,
        `badanamu_esl_81007`,
        `use_free_as_recommended_content_for_study_81008`,
    ],
};
