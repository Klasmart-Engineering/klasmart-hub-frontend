import { useState } from "react";

export const useMessageSnackBar = () => {
    const [messageSnackBar, setMessageSnackBar] = useState("");

    return { messageSnackBar, setMessageSnackBar };
};
