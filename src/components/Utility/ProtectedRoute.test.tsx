import ProtectedRoute from "@/components/Utility/ProtectedRoute";
import { usePermission } from "@/utils/permissions";
import { renderWithRouter } from "@tests/router";
import React from "react";

jest.mock(`@/utils/permissions`, () => {
    return {
        usePermission: jest.fn(),
    };
});

const MockComponent = jest.fn().mockReturnValue(`div`);

const mockUsePermission = usePermission as jest.MockedFunction<
    typeof usePermission
>;

const protectedPath = `/protected-route`;

const App = () => {
    return <ProtectedRoute
        path={protectedPath}
        permissions={`library_200`}
    >
        <MockComponent/>
    </ProtectedRoute>;
};

beforeEach(() => {
    MockComponent.mockClear();
});

test.each([ true, false ])(`if Permission API is loading and User hasPermission=%s, it renders the child component`, (hasPermission) => {
    mockUsePermission.mockReturnValueOnce({
        loading: true,
        hasPermission,
    });

    const { history } = renderWithRouter(<App/>, {
        route: protectedPath,
    });

    expect(history.location.pathname).toBe(protectedPath);
    expect(MockComponent).toHaveBeenCalledTimes(1);
});

test(`if Permission API is loaded and User doesn't have permission, it redirects to the homepage`, () => {
    mockUsePermission.mockReturnValueOnce({
        loading: false,
        hasPermission: false,
    });

    const { history } = renderWithRouter(<App/>, {
        route: protectedPath,
    });

    expect(history.location.pathname).toBe(`/`);
    expect(MockComponent).not.toHaveBeenCalled();
});

test(`if Permission API is loaded and User has permission, it renders the child component`, () => {
    mockUsePermission.mockReturnValueOnce({
        loading: false,
        hasPermission: true,
    });

    const { history } = renderWithRouter(<App/>, {
        route: protectedPath,
    });

    expect(history.location.pathname).toBe(protectedPath);
    expect(MockComponent).toHaveBeenCalledTimes(1);
});
