import { Skeleton } from "@mui/material";
import { useTheme } from "@mui/styles";

interface LoadingPageProps {
}

const LoadingPage: React.VFC<LoadingPageProps> = (props) => {
    const theme = useTheme();
    return (
        <div
            style={{
                padding: theme.spacing(2),
                width: `100%`,
                height: `100%`,
            }}
        >
            <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                sx={{
                    borderRadius: 1,
                }}
            />
        </div>
    );
};

export default LoadingPage;
