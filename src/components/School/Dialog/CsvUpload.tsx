import { useUploadSchoolsCsv } from "@/api/schools";
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

export default function UploadSchoolCsvDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ uploadSchoolCsv ] = useUploadSchoolsCsv();
    const [ uploadSuccess, setUploadSuccess ] = useState<boolean>();

    const handleFileUpload = async (file: File) => {
        const typedFile = addCsvTypeIfMissing(file);
        try {
            await uploadSchoolCsv({
                variables: {
                    file: typedFile,
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `createSchools_schoolsCsvUploadSuccess`,
            }), {
                variant: `success`,
            });
            setUploadSuccess(true);
        } catch (e) {
            enqueueSnackbar(intl.formatMessage({
                id: `schools_createdError`,
            }), {
                variant: `error`,
            });
            setUploadSuccess(false);
            throw e;
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
                id: `createSchools_uploadCsvTitle`,
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
