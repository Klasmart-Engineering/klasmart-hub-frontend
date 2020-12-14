import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles(() => ({
    date: {
        color: "#919398",
    },
    containerTable: {
        width: "100%",
        overflowY: "auto",
    },
    sendInvitationStatus: {
        color: "#010BF2",
    },
    resendInvitationStatus: {
        color: "#898686",
    },
    avatarStyle: {
        width: 40,
        padding: "2px",
        border: "1px solid #000",
    },
    avatarListStyle: {
        width: 25,
        padding: "2px",
        border: "1px solid #000",
    },
    buttonParent: {
        marginLeft: "3px",
        fontSize: "9px",
        background: "#9D9D9D",
        border: "1px solid #9D9D9D",
        borderRadius: "21px",
        color: "#fff",
        padding: "0px 0px 0px 7px",
        height: "15px",
    },
    iconClose: {
        background: "#FD0000",
        height: "15px",
    },
    labelStatus: {
        color: "#898686",
        fontStyle: "italic",
    },
    dashedData: {
        borderBottom: "1px dashed",
        color: "#cacaca",
    },
    activeColor: { color: "#2BA600", fontWeight: "bold" },
    inactiveColor: { color: "#FF0000", fontWeight: "bold" },
}));
