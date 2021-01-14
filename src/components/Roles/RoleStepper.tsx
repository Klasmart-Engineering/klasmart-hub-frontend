import CheckIcon from "@material-ui/icons/Check";
import { Divider } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core/styles";

const useStyles = makeStyles(() =>
    createStyles({
        stepperContainer: {
            display: `flex`,
            padding: `10px`,
            alignItems: `center`,
        },
        roleInfo: {
            paddingLeft: `10px`,
        },
        dividerContainer: {
            width: `50px`,
            padding: `10px`,
        },
        svg_icons: {
            transform: `scale(.8)`,
        },
        small_svg_icons: {
            transform: `scale(.4)`,
        },
        checkIcon: {
            height: `15px`,
            width: `15px`,
            backgroundColor: `#07c0f8`,
            borderRadius: `50%`,
            color: `white`,
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
            fontSize: `10px`,
        },
        divider: {
            background: `#434343`,
        },
        activeStep: {
            height: `25px`,
            width: `25px`,
            backgroundColor: `#07c0f8`,
            borderRadius: `50%`,
            color: `white`,
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
            fontSize: `12px`,
        },
        inactiveStep: {
            height: `25px`,
            width: `25px`,
            backgroundColor: `#C4C4C4`,
            borderRadius: `50%`,
            color: `white`,
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
            fontSize: `12px`,
        },
        activeText: {
            fontSize: `15px`,
        },
        inactiveText: {
            fontSize: `15px`,
            color: `#C4C4C4`,
        },
        activeMiniStep: {
            height: `15px`,
            width: `15px`,
            backgroundColor: `#07c0f8`,
            borderRadius: `50%`,
            color: `white`,
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
            fontSize: `10px`,
        },
        inactiveMiniStep: {
            height: `15px`,
            width: `15px`,
            backgroundColor: `#C4C4C4`,
            borderRadius: `50%`,
            color: `white`,
            display: `flex`,
            justifyContent: `center`,
            alignItems: `center`,
            fontSize: `10px`,
        },
    }),
);

interface Props {
    activeStep: number;
}

export default function RoleStepper({ activeStep }: Props) {
    const classes = useStyles();

    return (
        <div className={classes.stepperContainer}>
            <div className={classes.activeStep}>
                {activeStep > 0 ? (
                    <CheckIcon className={classes.svg_icons} />
                ) : (
                    1
                )}
            </div>
            <div className={clsx([ classes.activeText, classes.roleInfo ])}>
                Role Info
            </div>
            <div className={classes.dividerContainer}>
                <Divider className={classes.divider} />
            </div>
            <div
                className={clsx({
                    [classes.activeStep]: activeStep >= 1,
                    [classes.inactiveStep]: activeStep < 1,
                })}
            >
                {activeStep > 1 ? (
                    <CheckIcon className={classes.svg_icons} />
                ) : (
                    2
                )}
            </div>
            <div
                className={clsx({
                    [classes.activeText]: activeStep >= 1,
                    [classes.inactiveText]: activeStep < 1,
                })}
                style={{
                    padding: `10px`,
                }}
            >
                Set Permissions
            </div>
            <div style={{
                width: `20px`,
                paddingRight: `5px`,
            }}>
                <Divider className={classes.divider} />
            </div>
            <div className={classes.checkIcon}>
                <CheckIcon className={classes.small_svg_icons} />
            </div>
            <div style={{
                width: `20px`,
                padding: `5px`,
            }}>
                <Divider className={classes.divider} />
            </div>
            <div className={classes.checkIcon}>
                <CheckIcon className={classes.small_svg_icons} />
            </div>
            <div style={{
                width: `20px`,
                padding: `5px`,
            }}>
                <Divider className={classes.divider} />
            </div>
            <div className={classes.inactiveMiniStep}>
                {/* Inactive mini-step*/}
            </div>
            <div style={{
                width: `20px`,
                padding: `5px`,
            }}>
                <Divider className={classes.divider} />
            </div>
            <div className={classes.checkIcon}>
                <CheckIcon className={classes.small_svg_icons} />
            </div>
            <div style={{
                width: `20px`,
                padding: `5px`,
            }}>
                <Divider className={classes.divider} />
            </div>
            <div
                className={clsx({
                    [classes.activeStep]: activeStep >= 2,
                    [classes.inactiveStep]: activeStep < 2,
                })}
            >
                {activeStep > 2 ? (
                    <CheckIcon className={classes.svg_icons} />
                ) : (
                    3
                )}
            </div>
            <div
                className={clsx({
                    [classes.activeText]: activeStep >= 2,
                    [classes.inactiveText]: activeStep < 2,
                })}
                style={{
                    padding: `10px`,
                }}
            >
                Confirm Role
            </div>
        </div>
    );
}
