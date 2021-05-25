import { useUploadClassesCsv } from "@/api/classes";
import { handleFileUploadError } from "@/utils/csv";
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

const MAX_FILE_SIZE = 50000; // 50 Kb

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
        try {
            await uploadClassCsv({
                variables: {
                    file,
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
                accept={[
                    `text/csv`,
                    `text/x-csv`,
                    `application/x-csv`,
                    `application/csv`,
                    `text/x-comma-separated-values`,
                    `text/comma-separated-values`,
                    `.csv`,
                ]}
                maxSize={MAX_FILE_SIZE}
                locales={intl.locale}
                dropzoneLabel={intl.formatMessage({
                    id: `csvDialog_addCsvFile`,
                })}
                exceedsMaxSizeError={(fileSize, maxSize) => intl.formatMessage({
                    id: `uploadCsv_exceedsMaxSizeError`,
                }, {
                    fileSize: (fileSize / 1000).toFixed(1),
                    maxSize: (maxSize / 1000).toFixed(1),
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
