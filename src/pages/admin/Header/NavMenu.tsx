import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from '@material-ui/core/styles';
import { TransitionProps } from '@material-ui/core/transitions';
import Typography from '@material-ui/core/Typography';
import AllInboxTwoToneIcon from '@material-ui/icons/AllInboxTwoTone';
import AppsIcon from '@material-ui/icons/Apps';
import BusinessTwoToneIcon from '@material-ui/icons/BusinessTwoTone';
import ContactSupportTwoToneIcon from '@material-ui/icons/ContactSupportTwoTone';
import CreditCardTwoToneIcon from '@material-ui/icons/CreditCardTwoTone';
import GroupTwoToneIcon from '@material-ui/icons/GroupTwoTone';
import LockTwoToneIcon from '@material-ui/icons/LockTwoTone';
import PersonOutlineTwoToneIcon from '@material-ui/icons/PersonOutlineTwoTone';
import PhonelinkTwoToneIcon from '@material-ui/icons/PhonelinkTwoTone';
import SchoolTwoToneIcon from '@material-ui/icons/SchoolTwoTone';
import SecurityTwoToneIcon from '@material-ui/icons/SecurityTwoTone';
import TableChartTwoToneIcon from '@material-ui/icons/TableChartTwoTone';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { injectIntl, IntlFormatters } from 'react-intl';
import React, { useState } from 'react';
import { MenuItemProps } from '../../models/MenuItemProps';
import { MenuItem } from '../../models/MenuItem';
import { NavLink } from 'react-router-dom';
import { DialogTitle, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    menuButton: {
      maxWidth: '90%',
      padding: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        maxWidth: '100%',
      },
    },
    menuContainer: {
      padding: theme.spacing(4, 5),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2, 2),
      },
    },
    menuGrid: {
      padding: theme.spacing(1),
      textAlign: 'center',
    },
    title: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(1),
    },
    navLink: {
      textDecoration: 'none',
      color: '#000',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })
);

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function MenuButton(props: MenuItemProps) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCloseDialog = (link: string) => {
    if (link !== '#') {
      props.onClose();
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Button
        fullWidth
        className={classes.menuButton}
        onClick={() => handleCloseDialog(props.content.link)}
      >
        <NavLink className={classes.navLink} to={props.content.link}>
          <Grid
            container
            direction="column"
            justify="flex-start"
            alignItems="center"
            spacing={2}
          >
            <Grid item>{props.content.logo}</Grid>
            <Grid item>
              <Typography variant="body1">{props.content.title}</Typography>
              <Typography
                variant="caption"
                style={{ color: 'rgba(0, 0, 0, 0.6)' }}
              >
                {props.content.description}
              </Typography>
            </Grid>
          </Grid>
        </NavLink>
      </Button>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="info">
          This is currently planned for a future release!
        </Alert>
      </Snackbar>
    </>
  );
}

const Motion = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Grow style={{ transformOrigin: '0 0 0' }} ref={ref} {...props} />;
});

/**
 * Returns function to show NavMenu for NavBar
 */
function NavMenu(props: { intl: IntlFormatters }) {
  const { intl } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const MENU_ITEMS: MenuItem[] = [
    {
      description: intl.formatMessage({
        id: 'navMenu_analyticsAndReportsDescription',
      }),
      link: '#',
      logo: (
        <TableChartTwoToneIcon style={{ color: '#f7a219', fontSize: 48 }} />
      ),
      title: intl.formatMessage({ id: 'navMenu_analyticsAndReportsTitle' }),
    },
    {
      description: intl.formatMessage({ id: 'navMenu_billingDescription' }),
      link: '#',
      logo: (
        <CreditCardTwoToneIcon style={{ color: '#b0bec5', fontSize: 48 }} />
      ),
      title: intl.formatMessage({ id: 'navMenu_billingTitle' }),
    },
    {
      description: intl.formatMessage({
        id: 'navMenu_contentLibraryDescription',
      }),
      link: '#',
      logo: <AllInboxTwoToneIcon style={{ color: '#1f94e8', fontSize: 48 }} />,
      title: intl.formatMessage({ id: 'navMenu_contentLibraryTitle' }),
    },
    {
      description: intl.formatMessage({
        id: 'navMenu_dataSecurityDescription',
      }),
      link: '#',
      logo: <LockTwoToneIcon style={{ color: '#816961', fontSize: 48 }} />,
      title: intl.formatMessage({ id: 'navMenu_dataSecurityTitle' }),
    },
    {
      description: intl.formatMessage({ id: 'navMenu_devicesDescription' }),
      link: '#',
      logo: (
        <PhonelinkTwoToneIcon
          style={{
            color: theme.palette.type === 'dark' ? '#fefefe' : '#263238',
            fontSize: 48,
          }}
        />
      ),
      title: intl.formatMessage({ id: 'navMenu_devicesTitle' }),
    },
    {
      description: intl.formatMessage({ id: 'navMenu_groupsDescription' }),
      link: '#',
      logo: <GroupTwoToneIcon style={{ color: '#27bed6', fontSize: 48 }} />,
      title: intl.formatMessage({ id: 'navMenu_groupsTitle' }),
    },
    {
      description: intl.formatMessage({
        id: 'navMenu_organizationDescription',
      }),
      link: '/allOrganization',
      logo: <BusinessTwoToneIcon style={{ color: '#0E78D5', fontSize: 48 }} />,
      title: intl.formatMessage({ id: 'navMenu_organizationTitle' }),
    },
    {
      description: intl.formatMessage({ id: 'navMenu_securityDescription' }),
      link: '#',
      logo: <SecurityTwoToneIcon style={{ color: '#8396a0', fontSize: 48 }} />,
      title: intl.formatMessage({ id: 'navMenu_securityTitle' }),
    },
    {
      description: intl.formatMessage({ id: 'navMenu_schoolsDescription' }),
      link: '/school',
      logo: <SchoolTwoToneIcon style={{ color: '#0E78D5', fontSize: 48 }} />,
      title: intl.formatMessage({ id: 'navMenu_schoolsTitle' }),
    },
    {
      description: intl.formatMessage({ id: 'navMenu_supportDescription' }),
      link: '#',
      logo: (
        <ContactSupportTwoToneIcon style={{ color: '#3baf77', fontSize: 48 }} />
      ),
      title: intl.formatMessage({ id: 'navMenu_supportTitle' }),
    },
    {
      description: intl.formatMessage({ id: 'navMenu_usersDescription' }),
      link: '/user',
      logo: (
        <PersonOutlineTwoToneIcon style={{ color: '#0E78D5', fontSize: 48 }} />
      ),
      title: intl.formatMessage({ id: 'navMenu_usersTitle' }),
    },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton
        edge="start"
        onClick={handleClickOpen}
        color="inherit"
        aria-label="menu"
      >
        <AppsIcon />
      </IconButton>
      <Dialog
        aria-labelledby="nav-menu-title"
        aria-describedby="nav-menu-description"
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Motion}
      >
        <DialogTitle>
          <Tooltip title="Close" aria-label="add">
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="stretch"
          className={classes.menuContainer}
        >
          {MENU_ITEMS.map((menuItem) => {
            return (
              <Grid
                key={`menuItem-${menuItem.title}`}
                item
                xs={6}
                sm={4}
                md={3}
                lg={2}
                style={{ textAlign: 'center' }}
                className={classes.menuGrid}
              >
                <MenuButton content={menuItem} onClose={handleClose} />
              </Grid>
            );
          })}
        </Grid>
      </Dialog>
    </>
  );
}

export default injectIntl(NavMenu);
