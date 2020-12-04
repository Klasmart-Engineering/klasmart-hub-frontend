import { renderHook, act } from '@testing-library/react-hooks';
import { useSchools } from '../../components/User/hooks/useSchools';

test('should set schools to initial value', () => {
  const { result } = renderHook(() => useSchools());
  expect(result.current.schools).toStrictEqual([]);
  expect(typeof result.current.setSchools).toBe('function');
});

test('should update schools', () => {
  const { result } = renderHook(() => useSchools());
  const schools = [
    {
      school_id: 'de68a7b9-8562-41d6-bc18-79bb7571828e',
      school_name: 'BTS University',
    },
    {
      school_id: '3572ea82-a8e2-47c2-bda3-c52eddcd800c',
      school_name: 'Harvard University',
    },
  ];

  act(() => {
    result.current.setSchools(schools);
  });
  expect(result.current.schools).toStrictEqual(schools);
});
