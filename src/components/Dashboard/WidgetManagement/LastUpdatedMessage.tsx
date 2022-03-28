import { useCmsApiClient } from "@kl-engineering/cms-api-client";
import { useReportsApiClient } from "@kl-engineering/reports-api-client";
import { maxBy } from "lodash";
import React,
{
    useEffect,
    useState,
} from "react";
import {
    FormattedDate,
    FormattedMessage,
} from "react-intl";
import { useIsFetching } from 'react-query';

interface Props {
    mockDate?: boolean;
}

export default function LastUpdatedMessage (props: Props) {
    const { mockDate } = props;
    const [ dataUpdatedAt, setDataUpdatedAt ] = useState<number|undefined>(undefined);
    const reportsQueryClient = useReportsApiClient().queryClient;
    const cmsQueryClient = useCmsApiClient().queryClient;
    const isFetching = useIsFetching();

    useEffect(() => {
        if (isFetching > 0 ) return;

        const reportsQueryCache = reportsQueryClient.getQueryCache();
        const cmsQueryCache = cmsQueryClient.getQueryCache();

        const allReportsCache = reportsQueryCache.getAll();
        const allCmsCache = cmsQueryCache.getAll();

        const allReportsLastUpdated = allReportsCache.map(item => { return item.state.dataUpdatedAt;});
        const allCmsLastUpdated = allCmsCache.map(item => { return item.state.dataUpdatedAt;});

        const allStatesLastUpdated = [ ...allReportsLastUpdated, ...allCmsLastUpdated ];

        const lastUpdatedDate = maxBy(allStatesLastUpdated);

        setDataUpdatedAt(lastUpdatedDate);
    }, [ isFetching ]);

    useEffect(() => {
        if (!mockDate) return;

        const now = new Date().getTime();
        setDataUpdatedAt(now);
    }, [ mockDate ]);

    if (!dataUpdatedAt) return null;

    return (<FormattedMessage
        id="home.banner.lastUpdatedDate"
        values={{
            lastUpdatedDate: (
                <span>
                    <FormattedDate
                        value={dataUpdatedAt}
                        hour="2-digit"
                        minute="2-digit"
                        day="2-digit"
                        month="2-digit"
                        year="2-digit"
                    />
                </span>
            ),
        }}
    />);
}
