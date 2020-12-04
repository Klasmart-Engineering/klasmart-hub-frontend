import { renderHook, act } from '@testing-library/react-hooks';
import { useUserRoles } from '../../components/User/hooks/useUserRoles';

test('should set userRole from initial value', () => {
  const { result } = renderHook(() => useUserRoles());
  expect(result.current.roles).toStrictEqual([]);
  expect(typeof result.current.setRoles).toBe('function');
});

test('should update user Role', () => {
  const { result } = renderHook(() => useUserRoles());

  act(() => {
    result.current.setRoles([
      {
        role_id: '15e5bf6b-708b-4943-af09-98a7765750b7',
        role_name: 'Organization Admin',
      },
      {
        role_id: 'a797f39b-6b83-4a2a-b8a4-b21c457b0779',
        role_name: 'School Admin',
      },
    ]);
  });
  expect(result.current.roles).toStrictEqual([
    {
      role_id: '15e5bf6b-708b-4943-af09-98a7765750b7',
      role_name: 'Organization Admin',
    },
    {
      role_id: 'a797f39b-6b83-4a2a-b8a4-b21c457b0779',
      role_name: 'School Admin',
    },
  ]);
});
