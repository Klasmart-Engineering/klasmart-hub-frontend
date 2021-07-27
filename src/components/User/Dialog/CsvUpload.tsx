import { useUploadUserCsv } from "@/api/users";
import {
    addCsvTypeIfMissing,
    buildDefaultSpreadsheetFileInputProps,
} from "@/utils/csv";
import {
    FullScreenDialog,
    SpreadsheetFileInput,
    useSnackbar,
} from "kidsloop-px";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

interface Props {
    open: boolean;
    onClose: (uploadSuccess?: boolean) => void;
}

export default function UploadUserCsvDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ uploadUserCsv ] = useUploadUserCsv();
    const [ uploadSuccess, setUploadSuccess ] = useState<boolean>();

    const handleFileUpload = async (file: File) => {
        const typedFile = addCsvTypeIfMissing(file);
        try {
            await uploadUserCsv({
                variables: {
                    file: typedFile,
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `createUser_userCsvUploadSuccess`,
            }), {
                variant: `success`,
            });
            setUploadSuccess(true);
        } catch (err) {
            enqueueSnackbar(intl.formatMessage({
                id: `createUser_error`,
            }), {
                variant: `error`,
            });
            setUploadSuccess(false);
            throw err;
        }
    };

    useEffect(() => {
        if (open) return;
        setUploadSuccess(undefined);
    }, [ open ]);

    return (
        <FullScreenDialog
            open={open}
            title={intl.formatMessage({
                id: `createUser_uploadCsvTitle`,
            })}
            onClose={() => onClose(uploadSuccess)}
        >
            <SpreadsheetFileInput
                {...buildDefaultSpreadsheetFileInputProps(intl)}
                onFileUpload={handleFileUpload}
            />
        </FullScreenDialog>
    );
}
