import {
    useEffect,
    useState,
} from 'react';

function useLocalStorage<T> (key: string, initialValue: T) {
    const getValue = (key: string, initialValue: T): T => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    };

    const [ key_, setKey ] = useState(key);
    const [ storedValue, setStoredValue ] = useState<T>(getValue(key_, initialValue));

    const setValue = (value: T) => {
        try {
            setStoredValue(value);
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setKey(key);
        const value = getValue(key, initialValue);
        setValue(value);
    }, [ key ]);

    return [ storedValue, setValue ] as [T, (value: T) => void ];
}
