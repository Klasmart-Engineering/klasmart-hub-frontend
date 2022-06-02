import { useFeatureFlags } from "@/feature-flag/utils";
import { usePermission } from "@/utils/permissions";
import { useIsSuperAdmin } from "@/utils/userRoles";
import {
    AgeRangeIcon,
    AnalyticsReportsIcon,
    AssessmentIcon,
    ClassIcon,
    ContentsLibraryIcon,
    GradeIcon,
    HomeIcon,
    OrganizationIcon,
    ProgramIcon,
    RoleIcon,
    ScheduleIcon,
    SchoolIcon,
    SubjectIcon,
    UserIcon,
} from "@kl-engineering/kidsloop-px";
import {
    Business,
    CreditCard,
    Inbox,
    Person,
    ShowChartTwoTone,
    SvgIconComponent,
    TableChart,
} from "@mui/icons-material";
import {
    Divider,
    lighten,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import { Fragment } from "react";
import { useIntl } from "react-intl";
import {
    Link,
    useLocation,
} from "react-router-dom";

const useStyles = makeStyles((theme) => createStyles({
    listItem: {
        width: `calc(100% - ${theme.spacing(3)})`,
        height: theme.spacing(5),
        borderRadius: theme.spacing(2.5, 1, 2.5, 2.5),
        margin: theme.spacing(0, 1.5),
        padding: theme.spacing(1),
        transition: theme.transitions.create([ `width`, `border-radius` ], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.short,
        }),
    },
    listItemMini: {
        width: theme.spacing(5),
    },
    selectedLink: {
        backgroundColor: lighten(theme.palette.primary.main, 0.85),
        "& .MuiListItemText-primary": {
            color: theme.palette.primary.main,
        },
        "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
        },
    },
    textListItem: {
        opacity: 1,
        overflow: `hidden`,
        textOverflow: `ellipsis`,
        display: `-webkit-box`,
        WebkitLineClamp: 2,
        lineClamp: 2,
        WebkitBoxOrient: `vertical`,
        transition: theme.transitions.create([ `opacity` ], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.short,
        }),
    },
    textListItemMini: {
        opacity: 0,
    },
}));

interface MenuItem {
    icon: SvgIconComponent;
    text: string;
    link?: string;
    exact?: boolean;
}

interface MenuSection {
    id: string;
    items: MenuItem[];
}

interface Props {
    isMiniVariant?: boolean;
}

export default function NavigationMenuList (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const location = useLocation();
    const { teacherStudentProgressReport } = useFeatureFlags();

    const homeSection: MenuSection = {
        id: `Home`,
        items: [
            {
                text: intl.formatMessage({
                    id: `navMenu_home`,
                }),
                icon: HomeIcon,
                link: `/`,
                exact: true,
            },
        ],
    };

    const superAdminSection: MenuSection = {
        id: `Super Admin`,
        items: useIsSuperAdmin() ? [
            {
                text: intl.formatMessage({
                    id: `navMenu_superOrganization`,
                }),
                icon: Business,
            },
            {
                text: intl.formatMessage({
                    id: `navMenu_superContentLibrary`,
                }),
                icon: Inbox,
                link: `/super-admin/content-library`,
            },
            {
                text: intl.formatMessage({
                    id: `navMenu_accounts`,
                }),
                icon: Person,
            },
            {
                text: intl.formatMessage({
                    id: `navMenu_superBilling`,
                }),
                icon: CreditCard,
            },
            {
                text: intl.formatMessage({
                    id: `navMenu_metricsAndReport`,
                }),
                icon: TableChart,
            },
        ] : [],
    };

    const scheduleSection: MenuSection = {
        id: `schedule`,
        items: [
            ...usePermission(`library_200`) ? [
                {
                    text: intl.formatMessage({
                        id: `navMenu_contentLibraryTitle`,
                    }),
                    icon: ContentsLibraryIcon,
                    link: `/library`,
                },
            ] : [],
            {
                text: intl.formatMessage({
                    id: `navMenu_scheduleTitle`,
                }),
                icon: ScheduleIcon,
                link: `/schedule`,
            },
        ],
    };

    const managePermissions = {
        viewOrganizations: usePermission(`organizational_profile_10100`),
        viewUsers: usePermission(`view_user_page_40101`),
        viewRoles: usePermission(`view_roles_and_permissions_30110`),
        viewSchools: usePermission(`define_school_program_page_20101`),
        viewPrograms: usePermission(`define_program_page_20105`),
        viewClasses: usePermission(`define_class_page_20104`),
        viewSubjects: usePermission(`define_subject_page_20106`),
        viewGrades: usePermission(`define_grade_page_20103`),
        viewAgeRanges: usePermission(`define_age_ranges_page_20102`),
    };
    const manageSection: MenuSection = {
        id: `manage`,
        items: [
            ...managePermissions.viewOrganizations
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_organizationTitle`,
                        }),
                        icon: OrganizationIcon,
                        link: `/admin/organizations`,
                    },
                ]
                : [],
            ...managePermissions.viewUsers
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_usersTitle`,
                        }),
                        icon: UserIcon,
                        link: `/admin/users`,
                    },
                ]
                : [],
            ...managePermissions.viewRoles
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_groupsTitle`,
                        }),
                        icon: RoleIcon,
                        link: `/admin/roles`,
                    },
                ]
                : [],
            ...managePermissions.viewSchools
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_schoolsTitle`,
                        }),
                        icon: SchoolIcon,
                        link: `/admin/schools`,
                    },
                ]
                : [],
            ...managePermissions.viewPrograms
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_programsTitle`,
                        }),
                        icon: ProgramIcon,
                        link: `/admin/programs`,
                    },
                ]
                : [],
            ...managePermissions.viewClasses
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_classesTitle`,
                        }),
                        icon: ClassIcon,
                        link: `/admin/classes`,
                    },
                ]
                : [],
            ...managePermissions.viewSubjects
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_subjectsTitle`,
                        }),
                        icon: SubjectIcon,
                        link: `/admin/subjects`,
                    },
                ]
                : [],
            ...managePermissions.viewGrades
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_gradesTitle`,
                        }),
                        icon: GradeIcon,
                        link: `/admin/grades`,
                    },
                ]
                : [],
            ...managePermissions.viewAgeRanges
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_ageRangesTitle`,
                        }),
                        icon: AgeRangeIcon,
                        link: `/admin/age-ranges`,
                    },
                ]
                : [],
        ],
    };

    const dataPermissions = {
        viewReports: usePermission(`reports_600`),
        viewStudentReport: usePermission(`report_student_progress_teacher_660`),
        viewAssessments: usePermission(`assessments_page_406`),
    };
    const dataSection: MenuSection = {
        id: `data`,
        items: [
            ...( dataPermissions.viewReports
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_analyticsAndReportsTitle`,
                        }),
                        icon: AnalyticsReportsIcon,
                        link: `/reports`,
                    },
                ]
                : []),
            ...( teacherStudentProgressReport && dataPermissions.viewStudentReport
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_studentReportTitle`,
                        }),
                        icon: ShowChartTwoTone,
                        link: `/student-report`,
                    },
                ]
                : []),
            ...( dataPermissions.viewAssessments
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_assessmentsTitle`,
                        }),
                        icon: AssessmentIcon,
                        link: `/assessments`,
                    },
                ]
                : []),

        ],
    };

    const menuSections: MenuSection[] = [
        ...homeSection.items.length ? [ homeSection ] : [],
        ...superAdminSection.items.length ? [ superAdminSection ] : [],
        ...scheduleSection.items.length ? [ scheduleSection ] : [],
        ...dataSection.items.length ? [ dataSection ] : [],
        ...manageSection.items.length ? [ manageSection ] : [],
    ];

    function isLinkSelected (item: MenuItem) {
        if (item.exact) return item.link === location.pathname;
        if (!item.link) return false;
        return location.pathname.startsWith(item.link);
    }

    return (
        <>
            {menuSections.map((section, i) => (
                <Fragment key={section.id}>
                    {i !== 0 && (
                        <Divider
                            sx={{
                                margin: `0 24px`,
                            }}
                        />
                    )}
                    <List dense>
                        {section.items.map((item) => (
                            <Tooltip
                                key={`item-${item.link}-${item.text}`}
                                title={props.isMiniVariant ? item.text : ``}
                                placement="right"
                                sx={{
                                    borderRadius: 2,
                                }}
                            >
                                <ListItem
                                    button
                                    color="primary"
                                    disabled={!item.link}
                                    component={Link}
                                    to={item.link ?? ``}
                                    className={clsx(classes.listItem, {
                                        [classes.selectedLink]: isLinkSelected(item),
                                        [classes.listItemMini]: props.isMiniVariant,
                                    })}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                        }}
                                    >
                                        <item.icon />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            marginLeft: 1.5,
                                        }}
                                        primaryTypographyProps={{
                                            sx: {
                                                lineHeight: 1.1,
                                            },
                                        }}
                                        className={clsx(classes.textListItem, {
                                            [classes.textListItemMini]: props.isMiniVariant,
                                        })}
                                    />
                                </ListItem>
                            </Tooltip>
                        ))}
                    </List>
                </Fragment>
            ))}
        </>
    );
}
