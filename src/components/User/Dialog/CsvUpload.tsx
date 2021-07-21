import { useUploadUserCsv } from "@/api/users";
import {
    addCsvTypeIfMissing,
    CSV_ACCEPT_TYPES,
    handleFileUploadError,
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

const MAX_FILE_SIZE = 50000; // 50 kb

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
                accept={CSV_ACCEPT_TYPES}
                maxSize={MAX_FILE_SIZE}
                locales={intl.locale}
                dropzoneLabel={intl.formatMessage({
                    id: `csvDialog_addCsvFile`,
                })}
                exceedsMaxSizeError={(fileSize, maxSize) => intl.formatMessage({
                    id: `validation.error.file.maxSize`,
                }, {
                    size: `${(fileSize / 1000).toFixed(1)} kB`,
                    max: `${(maxSize / 1000).toFixed(1)} kB`,
                })}
                uploadSuccessMessage={intl.formatMessage({
                    id: `uploadCsv_uploadSuccessMessage`,
                })}
                removeButtonTooltip={intl.formatMessage({
                    id: `uploadCsv_removeButtonTooltip`,
                })}
                uploadButtonTooltip={intl.formatMessage({
                    id: `uploadCsv_uploadButtonTooltip`,
                })}
                spreadsheetInvalidData={intl.formatMessage({
                    id: `uploadCsv_invalidDataError`,
                })}
                typeRejectedError={intl.formatMessage({
                    id: `uploadCsv_typeRejectedError`,
                })}
                allValidationsPassedMessage={intl.formatMessage({
                    id: `uploadCsv_allValidationsPassedMessage`,
                })}
                numValidationsFailedMessage={(count) => intl.formatMessage({
                    id: `uploadCsv_numValidationsFailedMessage`,
                }, {
                    count,
                })}
                onFileUpload={handleFileUpload}
                onFileUploadError={handleFileUploadError(intl)}
            />
        </FullScreenDialog>
    );
}
