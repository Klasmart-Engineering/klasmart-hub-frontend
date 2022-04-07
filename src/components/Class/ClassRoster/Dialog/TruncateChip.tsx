
import {
    Chip,
    Tooltip,
    Typography,
} from "@mui/material";
import React from "react";

export interface Props {
    items: string[];
    pluralLabel: string;
    maxItemsInTooltip?: number;
}

export default function TruncateChip (props: Props) {
    const {
        items,
        pluralLabel,
        maxItemsInTooltip,
    } = props;

    const truncateItems = maxItemsInTooltip && items.length > maxItemsInTooltip;
    const listItems = truncateItems ? items.filter((item, index) => index < maxItemsInTooltip) : items;

    if(items.length === 0) {
        return <p>No {pluralLabel}</p>;
    }

    if(items.length === 1) {
        return <b>{ items[0] }</b>;
    }

    return (
        <Tooltip title={
            <>
                {
                    listItems.map((item) => (
                        <Typography
                            key={`list-item-${item}`}
                            fontSize={14}
                        >
                            {item}
                        </Typography>
                    ))
                }
                {
                    truncateItems &&
                        <Typography fontSize={14}>
                                +{ items.length - maxItemsInTooltip } more
                        </Typography>
                }
            </>
        }
        >
            <Chip
                label={`${items.length} ${pluralLabel}`}
            />
        </Tooltip>
    );
}
