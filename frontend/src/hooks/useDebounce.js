import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce rapid value updates (e.g. search inputs).
 * Prevents overwhelming API backends with requests on every keystroke.
 * 
 * @param {any} value - Input value to debounce
 * @param {number} delay - Milliseconds to delay execution (default: 400ms)
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
