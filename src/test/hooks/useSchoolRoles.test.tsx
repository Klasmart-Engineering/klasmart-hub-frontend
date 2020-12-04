import { renderHook, act } from '@testing-library/react-hooks';
import { useSchoolRoles } from '../../components/User/hooks/useSchoolRoles';

test('should set schoolRoles to initial value', () => {
  const { result } = renderHook(() => useSchoolRoles());
  expect(result.current.schoolRoles).toStrictEqual([]);
  expect(typeof result.current.setSchoolRoles).toBe('function');
});

test('should update schoolRoles', () => {
  const { result } = renderHook(() => useSchoolRoles());

  act(() => {
    result.current.setSchoolRoles([
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
  expect(result.current.schoolRoles).toStrictEqual([
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
