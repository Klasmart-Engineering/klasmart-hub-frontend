/* eslint-disable react/prop-types */
import {
    Card,
    colors,
    Typography,
} from "@mui/material";
import React from "react";

interface ErrorBoundaryProps {
}

interface ErrorBoundaryState {
    hasError: false;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: {
        hasError: false;
    };
    constructor (props: any) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError (error: unknown) {
    // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
        };
    }

    componentDidCatch (error: unknown, errorInfo: unknown) {
        // You can also log the error to an error reporting service
        // logErrorToMyService(error, errorInfo);
    }

    render () {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div
                    style={{
                        padding: 32,
                        width: `100%`,
                        height: `100%`,
                    }}
                >
                    <Card
                        elevation={0}
                        sx={{
                            width: `100%`,
                            height: `100%`,
                            display: `flex`,
                            alignItems: `center`,
                            justifyContent: `center`,
                            borderRadius: 4,
                            backgroundColor: colors.red[50],
                        }}
                    >
                        <Typography color="error">Something went wrong</Typography>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
