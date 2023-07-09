import { useState, useEffect } from 'react';
import { fetchCharacters } from '../utils';

const useFetchCharacters = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const charactersData = await fetchCharacters();
        setCharacters(charactersData);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An error occurred while fetching characters');
        }
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { characters, loading, error };
};

export default useFetchCharacters;