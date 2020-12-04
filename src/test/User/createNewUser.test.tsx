import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { IntlProvider } from 'react-intl';
import { messages } from '../../language/en';
import UserTable from '../../components/User/UserTable';
import { NEW_USER } from '../../operations/mutations/newUser';

test('Should create New User', () => {
  const userResponse = {
    data: {
      newUser: {
        user_id: '30d93830-b59d-46dd-a72a-d2473540490b',
        user_name: 'Slash',
        avatar: 'avatar.jpg',
      },
    },
  };

  const mocks = [
    {
      request: {
        query: NEW_USER,
        variables: {
          user_name: 'Slash',
          email: 'user@user.com',
          avatar: 'avatar.jpg',
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
