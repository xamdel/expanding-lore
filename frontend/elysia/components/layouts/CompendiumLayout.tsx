import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutProps } from '../../types';

const CompendiumLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div>
      <h1>Compendium</h1>
      {router.pathname !== '/Compendium' && (
        <Link href="../Compendium">Home</Link>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}

export default CompendiumLayout;