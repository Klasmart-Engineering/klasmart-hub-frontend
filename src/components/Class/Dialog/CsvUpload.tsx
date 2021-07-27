import { useUploadClassesCsv } from "@/api/classes";
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

export default function UploadClassCsvDialog (props: Props) {
    const {
        open,
        onClose,
    } = props;
    const intl = useIntl();
    const { enqueueSnackbar } = useSnackbar();
    const [ uploadClassCsv ] = useUploadClassesCsv();
    const [ uploadSuccess, setUploadSuccess ] = useState<boolean>();

    const handleFileUpload = async (file: File) => {
        const typedFile = addCsvTypeIfMissing(file);
        try {
            await uploadClassCsv({
                variables: {
                    file: typedFile,
                },
            });
            enqueueSnackbar(intl.formatMessage({
                id: `createClass_classesCsvUploadSuccess`,
            }), {
                variant: `success`,
            });
            setUploadSuccess(true);
        } catch (e) {
            enqueueSnackbar(intl.formatMessage({
                id: `classes_classSaveError`,
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
                id: `createClass_uploadCsvTitle`,
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
