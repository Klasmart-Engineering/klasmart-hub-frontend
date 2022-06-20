import {
    Component,
    ErrorInfo,
    ReactNode,
} from "react";

interface Props {
    children: ReactNode;
    errorComponent: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor (props: Props) {
        super(props);
        this.state = {
            hasError: false,
        };
    }

    public static getDerivedStateFromError (error: Error): State {
        // Update state so the next render will show the fallback UI.
        return {
            hasError: true,
        };
    }

    public componentDidCatch (error: Error, errorInfo: ErrorInfo) {
        console.error(`Uncaught error:`, error, errorInfo);
    }

    public render () {
        if (this.state.hasError) {
            return this.props.errorComponent;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
