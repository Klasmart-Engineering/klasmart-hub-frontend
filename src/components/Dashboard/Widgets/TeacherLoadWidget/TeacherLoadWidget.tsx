import { WidgetType } from "../../models/widget.model";
import LoadingPage from "@/components/Common/LoadingPage";
import WidgetWrapper from "@/components/Dashboard/WidgetWrapper";
import React,
{ Suspense } from "react";
import { useIntl } from "react-intl";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const TeacherLoad = React.lazy(() => import(`reports/TeacherLoad`));

export default function TeacherLoadWidget () {
    const intl = useIntl();

    return (
        <WidgetWrapper
            label={
                intl.formatMessage({
                    id: `home.teacherLoad.containerTitleLabel`,
                })
            }
            loading={false}
            error={false}
            noData={false}
            // reload={reload}
            /*link={{
                url: `reports`,
                label: intl.formatMessage({
                    id: `home.teacherLoad.containerUrlLabel`,
                }),
            }}*/
            id={WidgetType.TEACHERLOAD}
        >
            <Suspense
                fallback={(
                    <LoadingPage />
                )}
            >
                <TeacherLoad />
            </Suspense>
        </WidgetWrapper>
    );
}
