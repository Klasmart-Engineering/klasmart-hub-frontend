import { useState } from "react";

export const useShowSnackBar = () => {
    const [showSnackBar, setShowSnackBar] = useState(false);

    return { showSnackBar, setShowSnackBar };
};
