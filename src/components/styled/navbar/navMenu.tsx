import DialogAppBar from "@/components/styled/dialogAppBar";
import { MenuItem } from "@/types/objectTypes";
import { usePermission } from "@/utils/checkAllowed";
import { useIsSuperAdmin as useIsUserSuperAdmin } from "@/utils/userRoles";
import {
    Box,
    Button,
    createStyles,
    Dialog,
    DialogContent,
    Grid,
    Grow,
    IconButton,
    makeStyles,
    Theme,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions";
import Typography from "@material-ui/core/Typography";
import AppsIcon from "@material-ui/icons/Apps";
import {
    AllInbox as InboxIcon,
    Business as BusinessIcon,
    CalendarToday as CalendarIcon,
    ChildCare as ChildCareIcon,
    ContactSupport as SupportIcon,
    CreditCard as CardIcon,
    Grade as GradeIcon,
    Group as GroupIcon,
    Home as HomeIcon,
    LibraryBooks as LibraryBooksIcon,
    Lock as LockIcon,
    MenuBook as MenuBookIcon,
    PersonOutline as PersonIcon,
    Phonelink as PhoneIcon,
    School as SchoolIcon,
    Security as SecurityIcon,
    StackedLineChart as AssessmentIcon,
    TableChart as TableIcon,
} from "@styled-icons/material-twotone";
import clsx from "clsx";
import { useSnackbar } from "kidsloop-px";
import React,
{ useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => createStyles({
    dialogContent: {
        padding: 0,
    },
    superAdminMenuContainer: {
        backgroundColor: theme.palette.grey[100],
    },
    menuContainer: {
        padding: theme.spacing(4, 5),
        [theme.breakpoints.down(`sm`)]: {
            padding: theme.spacing(2, 2),
        },
    },
    menuButton: {
        minHeight: 64,
        padding: theme.spacing(2),
    },
    menuLink: {
        textDecoration: `none`,
        textAlign: `center`,
        display: `block`,
    },
}));

type MenuItemProps = Pick<MenuItem, `description` | `icon` | `title` | `link` | `color`>

function MenuButton (props: MenuItemProps) {
    const {
        description,
        icon: Icon, // capitilized to make React happy
        title,
        link,
        color,
    } = props;
    const classes = useStyles();

    return <Button
        fullWidth
        className={classes.menuButton}
    >
        <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            spacing={2}
        >
            <Grid item>
                <Icon
                    size="48"
                    color={link ? color : `gray`}
                />
            </Grid>
            <Grid item>
                <Typography variant="body1">
                    {title}
                </Typography>
                <Typography
                    variant="caption"
                    style={{
                        color: `rgba(0, 0, 0, 0.6)`,
                    }}
                >
                    {description}
                </Typography>
            </Grid>
        </Grid>
    </Button>;
}

const Motion = React.forwardRef((props: TransitionProps & { children?: React.ReactElement }, ref: React.Ref<unknown>) => (
    <Grow
        ref={ref}
        style={{
            transformOrigin: `0 0 0`,
        }}
        {...props}
    />
));

interface Props {
    className: string;
}

export default function NavMenu (props: Props) {
    const { className } = props;
    const classes = useStyles();
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ open, setOpen ] = useState(false);
    const isSuperAdmin = useIsUserSuperAdmin();

    const superAdminMenuItems: MenuItem[] = [
        {
            description: intl.formatMessage({
                id: `navMenu_superOrganizationDescription`,
            }),
            color: `#0E78D5`,
            icon: BusinessIcon,
            title: intl.formatMessage({
                id: `navMenu_superOrganization`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_superContentLibraryDescription`,
            }),
            link: `/super-admin/content-library`,
            color: `#1F94E8`,
            icon: InboxIcon,
            title: intl.formatMessage({
                id: `navMenu_superContentLibrary`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_accountsDescription`,
            }),
            color: `#0E78D5`,
            icon: PersonIcon,
            title: intl.formatMessage({
                id: `navMenu_accounts`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_superBillingDescription`,
            }),
            color: `#B0BEC5`,
            icon: CardIcon,
            title: intl.formatMessage({
                id: `navMenu_superBilling`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_metricsAndReportDescription`,
            }),
            color: `#F7A219`,
            icon: TableIcon,
            title: intl.formatMessage({
                id: `navMenu_metricsAndReport`,
            }),
        },
    ];

    const menuItems: MenuItem[] = [
        {
            description: intl.formatMessage({
                id: `navMenu_homeDescription`,
            }),
            link: `/`,
            color: `#1F94E8`,
            icon: HomeIcon,
            title: intl.formatMessage({
                id: `navMenu_home`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_analyticsAndReportsDescription`,
            }),
            link: `/reports`,
            color: `#F7A219`,
            icon: TableIcon,
            title: intl.formatMessage({
                id: `navMenu_analyticsAndReportsTitle`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_assessmentsDescription`,
            }),
            link: `/assessments`,
            color: `#98CE00`,
            icon: AssessmentIcon,
            title: intl.formatMessage({
                id: `navMenu_assessmentsTitle`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_contentLibraryDescription`,
            }),
            link: `/library`,
            color: `#1F94E8`,
            icon: InboxIcon,
            title: intl.formatMessage({
                id: `navMenu_contentLibraryTitle`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_groupsDescription`,
            }),
            link: `/admin/roles`,
            color: `#27BED6`,
            icon: GroupIcon,
            title: intl.formatMessage({
                id: `navMenu_groupsTitle`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_organizationDescription`,
            }),
            link: `/admin/organizations`,
            color: `#0E78D5`,
            icon: BusinessIcon,
            title: intl.formatMessage({
                id: `navMenu_organizationTitle`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_scheduleDescription`,
            }),
            link: `/schedule`,
            color: `#09BC8A`,
            icon: CalendarIcon,
            title: intl.formatMessage({
                id: `navMenu_scheduleTitle`,
            }),
        },
        ...usePermission(`define_school_program_page_20101`) ? [
            {
                description: intl.formatMessage({
                    id: `navMenu_schoolsDescription`,
                }),
                link: `/admin/schools`,
                color: `#0E78D5`,
                icon: SchoolIcon,
                title: intl.formatMessage({
                    id: `navMenu_schoolsTitle`,
                }),
            },
        ] : [],
        ...usePermission(`define_program_page_20105`) ? [
            {
                description: intl.formatMessage({
                    id: `navMenu_programsDescription`,
                }),
                link: `/admin/programs`,
                color: `#0E78D5`,
                icon: LibraryBooksIcon,
                title: intl.formatMessage({
                    id: `navMenu_programsTitle`,
                }),
            },
        ] : [],
        ...usePermission(`define_subject_page_20106`) ? [
            {
                description: intl.formatMessage({
                    id: `navMenu_subjectsDescription`,
                }),
                link: `/admin/subjects`,
                color: `#0E78D5`,
                icon: MenuBookIcon,
                title: intl.formatMessage({
                    id: `navMenu_subjectsTitle`,
                }),
            },
        ] : [],
        ...usePermission(`define_age_ranges_page_20102`) ? [
            {
                description: intl.formatMessage({
                    id: `navMenu_ageRangesDescription`,
                }),
                link: `/admin/age-ranges`,
                color: `#0E78D5`,
                icon: ChildCareIcon,
                title: intl.formatMessage({
                    id: `navMenu_ageRangesTitle`,
                }),
            },
        ] : [],
        ...usePermission(`define_grade_page_20103`) ? [
            {
                description: intl.formatMessage({
                    id: `navMenu_gradesDescription`,
                }),
                link: `/admin/grades`,
                color: `#0E78D5`,
                icon: GradeIcon,
                title: intl.formatMessage({
                    id: `navMenu_gradesTitle`,
                }),
            },
        ] : [],
        {
            description: intl.formatMessage({
                id: `navMenu_usersDescription`,
            }),
            link: `/admin/users`,
            color: `#0E78D5`,
            icon: PersonIcon,
            title: intl.formatMessage({
                id: `navMenu_usersTitle`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_billingDescription`,
            }),
            color: `#B0BEC5`,
            icon: CardIcon,
            title: intl.formatMessage({
                id: `navMenu_billingTitle`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_dataSecurityDescription`,
            }),
            color: `#816961`,
            icon: LockIcon,
            title: intl.formatMessage({
                id: `navMenu_dataSecurityTitle`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_devicesDescription`,
            }),
            color: `#263248`,
            icon: PhoneIcon,
            title: intl.formatMessage({
                id: `navMenu_devicesTitle`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_securityDescription`,
            }),
            color: `#8396A0`,
            icon: SecurityIcon,
            title: intl.formatMessage({
                id: `navMenu_securityTitle`,
            }),
        },
        {
            description: intl.formatMessage({
                id: `navMenu_supportDescription`,
            }),
            color: `#3BAF77`,
            icon: SupportIcon,
            title: intl.formatMessage({
                id: `navMenu_supportTitle`,
            }),
        },
    ];

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleItemClick = (url?: string) => {
        if (!url) {
            enqueueSnackbar(intl.formatMessage({
                id: `navMenu_futureRelease`,
            }), {
                variant: `info`,
            });
            return;
        }
        handleClose();
    };

    function GridMenuItem (menuItem: MenuItem, id: string) {
        const {
            color,
            description,
            icon,
            link,
            title,
        } = menuItem;
        return <Grid
            key={id}
            item
            xs={6}
            sm={4}
            md={3}
            lg={2}
        >
            <Link
                to={link ?? `#`}
                className={classes.menuLink}
                onClick={() => handleItemClick(link)}
            >
                <MenuButton
                    link={link}
                    color={color}
                    description={description}
                    icon={icon}
                    title={title}
                />
            </Link>
        </Grid>;
    }

    return (
        <>
            <Box
                display="flex"
                flex="0"
                alignItems="center"
                alignContent="center"
            >
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    className={className}
                    onClick={handleClickOpen}
                >
                    <AppsIcon />
                </IconButton>
            </Box>
            <Dialog
                fullScreen
                aria-labelledby="nav-menu-title"
                aria-describedby="nav-menu-description"
                open={open}
                TransitionComponent={Motion}
                onClose={handleClose}
            >
                <DialogAppBar handleClose={handleClose}/>
                <DialogContent className={classes.dialogContent}>
                    {isSuperAdmin && <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        className={clsx(classes.menuContainer, classes.superAdminMenuContainer)}
                    >
                        {superAdminMenuItems.map((menuItem, i) => GridMenuItem(menuItem, `superMenuItem-${i}`))}
                    </Grid>}
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        className={classes.menuContainer}
                    >
                        {menuItems.map((menuItem, i) => GridMenuItem(menuItem, `menuItem-${i}`))}
                    </Grid>
                </DialogContent>
            </Dialog>
        </>
    );
}
