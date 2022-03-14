import FeedbackComment from "./FeedbackComment";
import { screen } from "@testing-library/react";
import { mockFeedback } from "@tests/mockHomeCard";
import { render } from "@tests/utils/render";
import React from "react";

test(`FeedbackComment component render properly`, async () => {
    render((
        <FeedbackComment
            handleMoreFeedbackOpen={jest.fn()}
            id={mockFeedback.id}
            feedback={mockFeedback.feedback}
        />
    ));

    expect(await screen.findByText(`The new component should work.`)).toBeInTheDocument();
});
