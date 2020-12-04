import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { IntlProvider } from 'react-intl';
import { messages } from '../../language/en';
import UserTable from '../../components/User/UserTable';
import { ADD_USER_ROLES } from '../../operations/mutations/addUserRoles';

test('Should create user membership roles', () => {
  const userResponse = {
    data: {
      user: {
        membership: {
          addRoles: [
            {
              role_name: 'School Admin',
              role_id: '4zd93830-559d-asDf-a99Z-c126354049zz',
            },
          ],
        },
      },
    },
  };

  const mocks = [
    {
      request: {
        query: ADD_USER_ROLES,
        variables: {
          user_id: '30d93830-b59d-46dd-a72a-d2473540490b',
          organization_id: '4zd93830-559d-asDf-a99Z-c126354049zz',
          role_ids: ['4zd93830-559d-asDf-a99Z-c126354049zz'],
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
