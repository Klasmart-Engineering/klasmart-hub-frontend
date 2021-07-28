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
import { Column } from "kidsloop-px/dist/types/components/Input/File/Spreadsheet/Base";
import React,
{
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";

const columns: Column[] = [
    {
        text: `organization_name`,
        required: true,
    },
    {
        text:`user_given_name`,
        required: true,
    },
    {
        text: `user_family_name`,
        required: true,
    },
    {
        text: `user_shortcode`,
    },
    {
        text: `user_email`,
        required: true,
    },
    {
        text: `user_phone`,
    },
    {
        text: `user_date_of_birth`,
    },
    {
        text: `user_gender`,
        required: true,
    },
    {
        text: `organization_role_name`,
        required: true,
    },
    {
        text: `school_name`,
    },
    {
        text: `class_name`,
    },
];

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

    const handleFileUpload = async (file: File, isDryRun: boolean) => {
        const typedFile = addCsvTypeIfMissing(file);
        try {
            await uploadUserCsv({
                variables: {
                    file: typedFile,
                    isDryRun,
                },
            });
            if (!isDryRun) {
                enqueueSnackbar(intl.formatMessage({
                    id: `createUser_userCsvUploadSuccess`,
                }), {
                    variant: `success`,
                });
                setUploadSuccess(true);
            }
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
                isDryRunEnabled
                columns={columns}
                onFileUpload={handleFileUpload}
            />
        </FullScreenDialog>
    );
}
