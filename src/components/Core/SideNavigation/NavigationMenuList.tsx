import { useFeatureFlags } from "@/feature-flag/utils";
import { usePermission } from "@/utils/permissions";
import { useIsSuperAdmin } from "@/utils/userRoles";
import {
    Assessment,
    AssignmentInd,
    Business,
    ChildCare,
    Class,
    CreditCard,
    Event,
    Grade,
    Group,
    Home,
    Inbox,
    LibraryBooks,
    MenuBook,
    Person,
    School,
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
    ListSubheader,
} from "@mui/material";
import {
    createStyles,
    makeStyles,
} from '@mui/styles';
import clsx from "clsx";
import React,
{ Fragment } from "react";
import { useIntl } from "react-intl";
import {
    Link,
    useLocation,
} from "react-router-dom";

const useStyles = makeStyles((theme) => createStyles({
    sectionHeader: {
        backgroundColor: `#fff`,
        lineHeight: `36px`,
        fontSize: `0.8em`,
        fontWeight: 600,
        textTransform: `uppercase`,
    },
    defaultLink: {
        width: `90%`,
        margin: `0 auto`,
        borderRadius: theme.spacing(2),
    },
    selectedLink: {
        backgroundColor: lighten(theme.palette.primary.main, 0.9),
        "& .MuiListItemText-primary": {
            color: theme.palette.primary.contrastText,
        },
        "& .MuiListItemIcon-root": {
            color: theme.palette.primary.contrastText,
        },
    },
}));

interface MenuItem {
    icon: SvgIconComponent;
    text: string;
    link?: string;
    exact?: boolean;
}

interface MenuSection {
    header?: string;
    items: MenuItem[];
}

interface Props {
}

export default function NavigationMenuList (props: Props) {
    const classes = useStyles();
    const intl = useIntl();
    const location = useLocation();
    const { teacherStudentProgressReport } = useFeatureFlags();
    const homeSection: MenuSection = {
        items: [
            {
                text: intl.formatMessage({
                    id: `navMenu_home`,
                }),
                icon: Home,
                link: `/`,
                exact: true,
            },
        ],
    };

    const superAdminSection: MenuSection = {
        header: intl.formatMessage({
            id: `navMenu_superAdminLabel`,
        }),
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

    const librarySection = {
        items: usePermission(`library_200`) ? [
            {
                text: intl.formatMessage({
                    id: `navMenu_contentLibraryTitle`,
                }),
                icon: Inbox,
                link: `/library`,
            },
        ] : [],
    };

    const scheduleSection = {
        items: [
            {
                text: intl.formatMessage({
                    id: `navMenu_scheduleTitle`,
                }),
                icon: Event,
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
    const givenManagePermissionsValues = Object.values(managePermissions).filter((permission) => permission);
    const manageSection = {
        ...givenManagePermissionsValues.length > 1 // show header when users has 2 or more permissions
            ? {
                header: intl.formatMessage({
                    id: `navMenu_manageLabel`,
                }),
            }
            : {},
        items: [
            ...managePermissions.viewOrganizations
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_organizationTitle`,
                        }),
                        icon: Business,
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
                        icon: Group,
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
                        icon: AssignmentInd,
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
                        icon: School,
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
                        icon: LibraryBooks,
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
                        icon: Class,
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
                        icon: MenuBook,
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
                        icon: Grade,
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
                        icon: ChildCare,
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
    const givenDataPermissionsValues = Object.values(dataPermissions).filter((permission) => permission);
    const dataSection = {
        ...givenDataPermissionsValues.length > 1
            ? {
                header: intl.formatMessage({
                    id: `navMenu_dataLabel`,
                }),
            }
            : {},
        items: [
            ...( dataPermissions.viewReports
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_analyticsAndReportsTitle`,
                        }),
                        icon: TableChart,
                        link: `/reports`,
                    },
                ]
                : []),
            ...( teacherStudentProgressReport && dataPermissions.viewStudentReport
                ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_studentReportTitle`,
                            defaultMessage: `Student Report`,
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
                        icon: Assessment,
                        link: `/assessments`,
                    },
                ]
                : []),

        ],
    };

    const menuSections: MenuSection[] = [
        ...homeSection.items.length ? [ homeSection ] : [],
        ...superAdminSection.items.length ? [ superAdminSection ] : [],
        ...librarySection.items.length ? [ librarySection ] : [],
        ...scheduleSection.items.length ? [ scheduleSection ] : [],
        ...manageSection.items.length ? [ manageSection ] : [],
        ...dataSection.items.length ? [ dataSection ] : [],
    ];

    function isLinkSelected (item: MenuItem) {
        if (item.exact) return item.link === location.pathname;
        if (!item.link) return false;
        return location.pathname.startsWith(item.link);
    }

    return (
        <>
            {menuSections.map((section, i) => (
                <Fragment key={`section-${i}`}>
                    {i !== 0 && <Divider />}
                    <List dense>
                        {section.header && (
                            <ListSubheader className={classes.sectionHeader}>
                                {section.header}
                            </ListSubheader>
                        )}
                        {section.items.map((item, j) => (
                            <ListItem
                                key={`item-${i}-${j}`}
                                button
                                color="primary"
                                disabled={!item.link}
                                component={Link}
                                to={item.link ?? ``}
                                className={clsx(classes.defaultLink, {
                                    [classes.selectedLink]: isLinkSelected(item),
                                })}
                            >
                                <ListItemIcon>
                                    <item.icon />
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Fragment>
            ))}
        </>
    );
}
