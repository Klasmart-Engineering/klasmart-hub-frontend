import GeneralError from "@/assets/img/general_error.svg";
import {
    Stack,
    Typography,
} from "@mui/material";
import {
    FormattedMessage,
    useIntl,
} from "react-intl";

interface ErrorPageProps {
}

const ErrorPage: React.VFC<ErrorPageProps> = (props) => {
    const intl = useIntl();

    return (
        <Stack
            direction="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            padding={2}
            gap={1}
        >
            <img
                src={GeneralError}
                alt={intl.formatMessage({
                    id: `home.common.error.generic.description`,
                })}
            />
            <Typography
                variant="h5"
                textAlign="center"
            >
                <FormattedMessage id="home.common.error.generic.title" />
            </Typography>
            <Typography textAlign="center">
                <FormattedMessage id="home.common.error.generic.description" />
            </Typography>
        </Stack>
    );
};

export default ErrorPage;
