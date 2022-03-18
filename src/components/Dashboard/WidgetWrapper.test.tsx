import { WidgetType } from './models/widget.model';
import WidgetWrapper from "./WidgetWrapper";
import { screen } from "@testing-library/react";
import { render } from "@tests/utils/render";
import React from 'react';

describe(`WidgetWrapper`, () => {
    it(`renders a loader if loading prop is true`, () => {
        render(<WidgetWrapper
            loading={true}
            label=""
            id={WidgetType.SCHEDULE}>
            <div></div>
        </WidgetWrapper>);

        expect(screen.getByRole(`progressbar`)).toBeInTheDocument();
    });

    it(`renders an error if error prop is true`, () => {
        render(<WidgetWrapper
            error={true}
            noData={false}
            loading={false}
            label=""
            id={WidgetType.SCHEDULE}>
            <div></div>
        </WidgetWrapper>);

        expect(screen.getByText(`The data cannot be loaded, please try again later!`)).toBeInTheDocument();
    });

    it(`renders reload button if functionality available`, () => {
        render(<WidgetWrapper
            error={true}
            noData={false}
            loading={false}
            label=""
            reload={() => true}
            id={WidgetType.SCHEDULE}>
            <div></div>
        </WidgetWrapper>);

        expect(screen.getByText(`Try Again`)).toBeInTheDocument();
    });

    it(`renders no data component if noData prop is true`, () => {
        render(<WidgetWrapper
            noData={true}
            error={false}
            loading={false}
            label=""
            id={WidgetType.SCHEDULE}>
            <div></div>
        </WidgetWrapper>);

        expect(screen.getByText(`There is no data available`)).toBeInTheDocument();
    });

    it(`renders child component if loading, noData and error props are false`, () => {
        render(<WidgetWrapper
            noData={false}
            error={false}
            loading={false}
            label=""
            id={WidgetType.SCHEDULE}>
            <div>Child Component</div>
        </WidgetWrapper>);

        expect(screen.getByText(`Child Component`)).toBeInTheDocument();
    });
});
