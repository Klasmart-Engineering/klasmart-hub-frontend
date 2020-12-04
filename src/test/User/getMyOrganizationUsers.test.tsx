import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { IntlProvider } from 'react-intl';
import { messages } from '../../language/en';
import UserTable from '../../components/User/UserTable';
import { GET_ORGANIZATION_USERS } from '../../operations/queries/getOrganizationUsers';

describe('School test', () => {
  test("Should show 'Users' created in the table", () => {
    const userResponse = {
      data: {
        users: {
          me: {
            my_organization: {
              organization_id: '2b4e5ef2-52fe-4fb8-8485-697ef6d8da0b',
              organization_name: 'Organization BTS',
              phone: '8231321321321',
              memberships: [
                {
                  roles: [
                    {
                      role_id: '15e5bf6b-708b-4943-af09-98a7765750b7',
                      role_name: 'Organization Admin',
                    },
                    {
                      role_id: 'a797f39b-6b83-4a2a-b8a4-b21c457b0779',
                      role_name: 'School Admin',
                    },
                  ],
                  user: {
                    avatar:
                      'https://robohash.org/1abb0b0b6ade05239627d74655fe50d1?set=set4&bgset=&size=400x400',
                    email: 'ash@asdf.com',
                    school_memberships: [
                      {
                        roles: [
                          {
                            role_id: '139d8e4a-a3d4-4b19-a696-40b8dda1e611',
                            role_name: 'Teacher',
                          },
                        ],
                        school: {
                          school_id: 'de68a7b9-8562-41d6-bc18-79bb7571828e',
                          school_name: 'BTS University',
                        },
                        school_id: 'de68a7b9-8562-41d6-bc18-79bb7571828e',
                      },
                    ],
                    user_id: 'd4cec470-6222-5457-a0d9-9fa4166980de',
                    user_name: 'ASH',
                  },
                },
              ],
              roles: [
                {
                  role_id: '15e5bf6b-708b-4943-af09-98a7765750b7',
                  role_name: 'Organization Admin',
                },
              ],
              schools: [
                {
                  school_id: 'de68a7b9-8562-41d6-bc18-79bb7571828e',
                  school_name: 'BTS University',
                },
              ],
            },
          },
        },
      },
    };

    const mocks = [
      {
        request: {
          query: GET_ORGANIZATION_USERS,
        },
        result: userResponse,
      },
      {
        request: {
          query: GET_ORGANIZATION_USERS,
        },
        error: new Error('Something went wrong'),
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
});
