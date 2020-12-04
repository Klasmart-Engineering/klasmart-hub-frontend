import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { IntlProvider } from 'react-intl';
import { messages } from '../../language/en';
import UserTable from '../../components/User/UserTable';
import { REMOVE_SCHOOL_ROLE } from '../../operations/mutations/removeSchoolRole';

test('Should create user membership roles', () => {
  const userResponse = {
    data: {
      user: {
        user_id: '30d93830-b59d-46dd-a72a-d2473540490b',
        school_membership: {
          removeRole: {
            user_id: '30d93830-b59d-46dd-a72a-d2473540490b',
          },
        },
      },
    },
  };

  const mocks = [
    {
      request: {
        query: REMOVE_SCHOOL_ROLE,
        variables: {
          user_id: '30d93830-b59d-46dd-a72a-d2473540490b',
          school_id: '4zd93830-559d-asDf-a99Z-c1263dd84d5z',
          role_id: '4zd93830-559d-asDf-xxxZ-c126354049zz',
        },
      },
      result: userResponse,
    },
  ];

  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <IntlProvider locale="en" messages={messages}>
        <UserTable />
      </IntlProvider>
    </MockedProvider>
  );
});
