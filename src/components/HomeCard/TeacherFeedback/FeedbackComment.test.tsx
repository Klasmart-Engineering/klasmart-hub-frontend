import FeedbackComment from "./FeedbackComment";
import {
    screen,
    waitFor,
} from "@testing-library/react";
import { mockFeedback } from "@tests/mockHomeCard";
import { render } from "@tests/utils/render";
import React from "react";

test(`FeedbackComment component render properly`, async () => {
    const component = <FeedbackComment
        handleMoreFeedbackOpen={jest.fn()}
        id={mockFeedback.id}
        feedback={mockFeedback.feedback} />;
    render(component);

    await waitFor(() => {
        expect(screen.queryByText(`The new component should work.`)).toBeInTheDocument();
    });
});
