import { useState, useEffect, useCallback } from 'react';

interface UseSearchReturn {
  query: string;
  debouncedQuery: string;
  setQuery: (value: string) => void;
  clear: () => void;
}

export function useSearch(delay = 300): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  const clear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
  }, []);

  return { query, debouncedQuery, setQuery, clear };
}
