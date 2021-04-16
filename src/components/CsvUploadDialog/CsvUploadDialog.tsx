import {
    Dialog,
    FileInput,
} from 'kidsloop-px';
import React from 'react';
import { useIntl } from 'react-intl';

/**
 * Props interface for component.
 */
interface Props {
    /**
     * Indicates if dialog box should be open.
     */
    open: boolean;

    /**
     * Used to close dialog box.
     */
    setOpenCsvUpload: (value: boolean) => void;

    /**
     * Submits CSV to parent component in order to request upload.
     */
    submitCsv: (csv: File) => Promise<void>;

    /**
     * Dialog box title.
     */
    title: string;
}

/**
 * Handles CSV file for creating users.
 * @param props Props from parent component.
 * @returns
 */
export const CsvUploadDialog = (props: Props) => {
    const {
        open,
        setOpenCsvUpload,
        submitCsv,
        title,
    } = props;
    const intl = useIntl();

    const onFileUpload = (file: File) => {
        if (file) {
            submitCsv(file);
        }
    };

    return (
        <Dialog
            open={open}
            title={title}
            actions={[
                {
                    label: intl.formatMessage({
                        id: `csvDialog_closeDialog`,
                    }),
                    color: `primary`,
                    onClick: () => {
                        setOpenCsvUpload(false);
                    },
                },
            ]}
            onClose={() => {
                setOpenCsvUpload(false);
            }}
        >
            <FileInput
                accept="text/csv"
                onFileUpload={onFileUpload}
            />
        </Dialog>
    );
};
