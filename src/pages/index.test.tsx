import HomePage from "./index";
import { WidgetView } from "@/components/Dashboard/WidgetManagement/defaultWidgets";
import * as hooks from "@/store/useDashboardMode";
import {
    fireEvent,
    screen,
    waitFor,
} from "@testing-library/react";
import { render } from "@tests/utils/render";
import React from 'react';

jest.mock(`@/components/Dashboard/Dashboard`);

jest.mock(`@/components/Dashboard/WidgetDashboard`);

jest.mock(`@/utils/permissions`, () => {
    return {
        ...jest.requireActual(`@/utils/permissions`),
        usePermission: () => true,
    };
});

const mockDashboardModeObject = {
    setToWidgetDashboard: jest.fn(),
    setToOriginalDashboard: jest.fn(),
    loading: false,
};

describe(`HomePage`, () => {
    it(`renders the widgets dashboard if new widgets are enabled`, async () => {

        const mockDashboardMode = hooks.DashboardMode.WIDGET;
        const mockView = WidgetView.STUDENT;

        jest.spyOn(hooks, `useDashboardMode`).mockImplementation(() => ({
            ...mockDashboardModeObject,
            dashboardMode: mockDashboardMode,
            showDashboardNoticeToggle: false,
            view: mockView,
        }));

        render(<HomePage />);

        await waitFor(() => {
            expect(screen.getByText(`widget dashboard`)).toBeInTheDocument();
        });
    });

    it(`renders the original dashboard if new widgets are disabled`, async () => {

        const mockDashboardMode = hooks.DashboardMode.ORIGINAL;
        const mockView = WidgetView.STUDENT;

        jest.spyOn(hooks, `useDashboardMode`).mockImplementation(() => ({
            ...mockDashboardModeObject,
            dashboardMode: mockDashboardMode,
            showDashboardNoticeToggle: false,
            view: mockView,
        }));

        render(<HomePage />);

        await waitFor(() => {
            expect(screen.getByText(`original dashboard`)).toBeInTheDocument();
        });
    });

    it(`renders the dashboard notice if dashboard is enabled`, async () => {

        const mockDashboardMode = hooks.DashboardMode.ORIGINAL;
        const mockView = WidgetView.STUDENT;

        jest.spyOn(hooks, `useDashboardMode`).mockImplementation(() => ({
            ...mockDashboardModeObject,

            dashboardMode: mockDashboardMode,
            showDashboardNoticeToggle: true,
            view: mockView,
        }));

        render(<HomePage />);

        await waitFor(() => {
            expect(screen.getByText(`Switch View`)).toBeInTheDocument();
        });
    });

    it(`switches to original dashboard mode when clicked and current dashboard mode is widgets`, () => {

        const mockDashboardMode = hooks.DashboardMode.WIDGET;
        const mockView = WidgetView.STUDENT;

        jest.spyOn(hooks, `useDashboardMode`).mockImplementation(() => ({
            ...mockDashboardModeObject,
            dashboardMode: mockDashboardMode,
            showDashboardNoticeToggle: true,
            view: mockView,
        }));

        render(<HomePage />);

        expect(mockDashboardModeObject.setToOriginalDashboard).toHaveBeenCalledTimes(0);

        fireEvent.click(screen.getByText(`Switch View`));

        expect(mockDashboardModeObject.setToOriginalDashboard).toHaveBeenCalledTimes(1);
    });

    it(`switches to widget dashboard mode when clicked and current dashboard mode is original`, () => {

        const mockDashboardMode = hooks.DashboardMode.ORIGINAL;
        const mockView = WidgetView.STUDENT;

        jest.spyOn(hooks, `useDashboardMode`).mockImplementation(() => ({
            ...mockDashboardModeObject,
            dashboardMode: mockDashboardMode,
            showDashboardNoticeToggle: true,
            view: mockView,
        }));

        render(<HomePage />);

        expect(mockDashboardModeObject.setToWidgetDashboard).toHaveBeenCalledTimes(0);

        fireEvent.click(screen.getByText(`Switch View`));

        expect(mockDashboardModeObject.setToWidgetDashboard).toHaveBeenCalledTimes(1);
    });
});
