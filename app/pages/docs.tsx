import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Docs = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/docs/get_started');
  }, []);

  return null;
};

export default Docs;
