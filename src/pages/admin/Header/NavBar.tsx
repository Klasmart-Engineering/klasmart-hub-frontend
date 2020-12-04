import { useQuery, useReactiveVar } from "@apollo/client/react";
import AppBar from "@material-ui/core/AppBar";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import SettingsIcon from "@material-ui/icons/Settings";
import _get from "lodash/get";
import React, { useEffect } from "react";
import { injectIntl, IntlFormatters } from "react-intl";
import { organizationIdVar, userIdVar, userProfileVar } from "../../cache";
import { constantValues } from "../../constants";
import { LabelProps } from "../../models/LabelProps";
import { MenuItemLabel } from "../../models/MenuItemLabel";
import { GET_USER } from "../../operations/queries/getUser";
import { redirectIfUnauthorized } from "../../util/redirectIfUnauthorized";
import NavMenu from "./NavMenu";
import UserSettings from "./UserSettings";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    safeArea: {
      paddingLeft: "env(safe-area-inset-left)",
      paddingRight: "env(safe-area-inset-right)",
      zIndex: theme.zIndex.drawer + 1,
    },
    title: {
      flex: 1,
      marginLeft: theme.spacing(2),
    },
    colorLink: {
      color: "#000",
    },
  })
);

function ClassroomLabel(props: LabelProps) {
  const userProfile = useReactiveVar(userProfileVar);

  return (
    <Grid
      container
      item
      xs={10}
      direction="row"
      justify="flex-start"
      alignItems="flex-start"
    >
      <Grid item xs={12}>
        <Typography variant="body1" className={props.classes} noWrap>
          {userProfile.user_name}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body2" className={props.classes} noWrap>
          {userProfile.email}
        </Typography>
      </Grid>
    </Grid>
  );
}

/**
 * Returns function to show NavBar with buttons and NavMenu
 */
const NavBar = (props: { intl: IntlFormatters }) => {
  const { intl } = props;
  const classes = useStyles();
  const theme = useTheme();
  const minHeight = useMediaQuery(theme.breakpoints.up("sm")) ? 64 : 56;
  const menuLabel = constantValues.menuLabel.map((label: MenuItemLabel) => {
    if (label.id) {
      return { ...label, name: intl.formatMessage({ id: label.id }) };
    } else {
      return label;
    }
  });
  const userId = useReactiveVar(userIdVar);
  const { data, loading, error } = useQuery(GET_USER, {
    fetchPolicy: "network-only",
    variables: {
      user_id: userId,
    },
  });

  useEffect(() => {
    if (data && !loading) {
      organizationIdVar(_get(data, "user.my_organization.organization_id", ""));
    }
  }, [data, loading]);

  useEffect(() => {
    // Function then is call to avoid editor warning messages.
    redirectIfUnauthorized().then();
  }, []);

  return (
    <div className={classes.root}>
      <AppBar color="inherit" position="sticky" className={classes.safeArea}>
        <Toolbar>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{ minHeight }}
          >
            <Grid
              container
              item
              xs={12}
              md={4}
              lg={3}
              direction="row"
              justify="space-between"
              alignItems="center"
              wrap="nowrap"
              style={{ minHeight }}
            >
              <Grid container item xs={8} direction="row" wrap="nowrap">
                <NavMenu />
                <ClassroomLabel classes={classes.title} />
              </Grid>
              <Hidden mdUp>
                <Grid
                  container
                  item
                  xs={4}
                  justify="flex-end"
                  direction="row"
                  alignItems="center"
                  wrap="nowrap"
                >
                  <Grid item>
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="settings of current user"
                      aria-controls="menu-appbar"
                      aria-haspopup="true"
                    >
                      <SettingsIcon />
                    </IconButton>
                  </Grid>
                  <UserSettings
                    memberships={data?.user?.memberships}
                    loading={loading}
                    error={error}
                  />
                </Grid>
              </Hidden>
            </Grid>
            {/* <Grid
              container
              item
              xs={12}
              md={4}
              lg={6}
              direction="row"
              justify="center"
              wrap="nowrap"
            >
              {menuLabel.map((labelItem: any) => {
                return (
                  <Link
                    to={labelItem.path}
                    className={classes.colorLink}
                    key={labelItem.name}
                  >
                    <NavButton
                      key={`menuLabel-${labelItem.name}`}
                      isActive={false}
                      style={{ minHeight }}
                    >
                      <b>{labelItem.name.toLowerCase()}</b>
                    </NavButton>
                  </Link>
                );
              })}
            </Grid> */}
            <Hidden smDown>
              <Grid
                container
                item
                md={4}
                lg={3}
                direction="row"
                justify="flex-end"
                alignItems="center"
                wrap="nowrap"
              >
                <UserSettings
                  memberships={data?.user?.memberships}
                  loading={loading}
                  error={error}
                />
              </Grid>
            </Hidden>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default injectIntl(NavBar);
