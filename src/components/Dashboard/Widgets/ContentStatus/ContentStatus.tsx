
import { WidgetType } from "../../models/widget.model";
import LoadingPage from "@/components/Common/LoadingPage";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import React,
{ Suspense } from "react";
import { useIntl } from "react-intl";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const ContentStatus = React.lazy(() => import(`reports/ContentStatus`));

export default function ContentStatusWidget () {
    const intl = useIntl();

    return (
        <WidgetWrapper
            loading={false}
            error={false}
            noData={false}
            // reload={refetch}
            label={
                intl.formatMessage({
                    id: `home.contentStatus.containerTitleLabel`,
                })
            }
            link={{
                url: `library/organization-content`,
                label: intl.formatMessage({
                    id: `home.contentStatus.containerUrlLabel`,
                }),
            }}
            id={WidgetType.CONTENTSTATUS}
        >
            <Suspense
                fallback={(
                    <LoadingPage />
                )}
            >
                <ContentStatus />
            </Suspense>
        </WidgetWrapper>
    );
}
