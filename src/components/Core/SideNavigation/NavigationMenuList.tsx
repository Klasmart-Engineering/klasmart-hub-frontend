import { usePermission } from "@/utils/checkAllowed";
import { useIsSuperAdmin } from "@/utils/userRoles";
import {
    createStyles,
    Divider,
    lighten,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    makeStyles,
    Typography,
} from "@material-ui/core";
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
    Help,
    Home,
    Inbox,
    LibraryBooks,
    Lock,
    MenuBook,
    Person,
    PhoneAndroid,
    School,
    Security,
    SvgIconComponent,
    TableChart,
} from "@material-ui/icons";
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
            color: theme.palette.primary.main,
        },
        "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
        },
    },
}));

interface MenuItem {
    icon: SvgIconComponent;
    text: string;
    link?: string;
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
    const isSuperAdmin = useIsSuperAdmin();

    const menuSections: MenuSection[] = [
        {
            items: [
                {
                    text: intl.formatMessage({
                        id: `navMenu_home`,
                    }),
                    icon: Home,
                    link: `/`,
                },
            ],
        },
        ...isSuperAdmin ? [
            {
                header: `Super Admin`,
                items: [
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
                ],
            },
        ] : [],
        {
            items: [
                {
                    text: intl.formatMessage({
                        id: `navMenu_contentLibraryTitle`,
                    }),
                    icon: Inbox,
                    link: `/library`,
                },
            ],
        },
        {
            items: [
                {
                    text: intl.formatMessage({
                        id: `navMenu_scheduleTitle`,
                    }),
                    icon: Event,
                    link: `/schedule`,
                },
            ],
        },
        {
            header: `Manage`,
            items: [
                {
                    text: intl.formatMessage({
                        id: `navMenu_organizationTitle`,
                    }),
                    icon: Business,
                    link: `/admin/organizations`,
                },
                {
                    text: intl.formatMessage({
                        id: `navMenu_usersTitle`,
                    }),
                    icon: Group,
                    link: `/admin/users`,
                },
                {
                    text: intl.formatMessage({
                        id: `navMenu_groupsTitle`,
                    }),
                    icon: AssignmentInd,
                    link: `/admin/roles`,
                },
                {
                    text: intl.formatMessage({
                        id: `navMenu_schoolsTitle`,
                    }),
                    icon: School,
                    link: `/admin/schools`,
                },
                ...usePermission(`define_program_page_20105`) ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_programsTitle`,
                        }),
                        icon: LibraryBooks,
                        link: `/admin/programs`,
                    },
                ] : [],
                ...usePermission(`define_class_page_20104`) ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_classesTitle`,
                        }),
                        icon: Class,
                        link: `/admin/classes`,
                    },
                ] : [],
                ...usePermission(`define_subject_page_20106`) ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_subjectsTitle`,
                        }),
                        icon: MenuBook,
                        link: `/admin/subjects`,
                    },
                ] : [],
                ...usePermission(`define_grade_page_20103`) ? [
                    {
                        text: intl.formatMessage({
                            id: `navMenu_gradesTitle`,
                        }),
                        icon: Grade,
                        link: `/admin/grades`,
                    },
                ] : [],
                ...usePermission(`define_age_ranges_page_20102`) ? [
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
        },
        {
            header: `Data`,
            items: [
                {
                    text: intl.formatMessage({
                        id: `navMenu_analyticsAndReportsTitle`,
                    }),
                    icon: TableChart,
                    link: `/reports`,
                },
                {
                    text: intl.formatMessage({
                        id: `navMenu_assessmentsTitle`,
                    }),
                    icon: Assessment,
                    link: `/assessments`,
                },
            ],
        },
        {
            header: `General`,
            items: [
                {
                    text: intl.formatMessage({
                        id: `navMenu_billingTitle`,
                    }),
                    icon: CreditCard,
                },
                {
                    text: intl.formatMessage({
                        id: `navMenu_dataSecurityTitle`,
                    }),
                    icon: Lock,
                },
                {
                    text: intl.formatMessage({
                        id: `navMenu_devicesTitle`,
                    }),
                    icon: PhoneAndroid,
                },
                {
                    text: intl.formatMessage({
                        id: `navMenu_securityTitle`,
                    }),
                    icon: Security,
                },
                {
                    text: intl.formatMessage({
                        id: `navMenu_supportTitle`,
                    }),
                    icon: Help,
                },
            ],
        },
    ];
    return <>
        {menuSections.map((section, i) => (
            <Fragment key={`section-${i}`}>
                {i !== 0 && <Divider />}
                <List dense>
                    {section.header &&
                        <ListSubheader className={classes.sectionHeader}>
                            {section.header}
                        </ListSubheader>
                    }
                    {section.items.map((item, j) => (
                        <ListItem
                            key={`item-${i}-${j}`}
                            button
                            color="primary"
                            disabled={!item.link}
                            component={Link}
                            to={item.link ?? ``}
                            className={clsx(classes.defaultLink, {
                                [classes.selectedLink]: item.link === location.pathname,
                            })}
                        >
                            <ListItemIcon><item.icon /></ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Fragment>
        ))}
    </>;
}
