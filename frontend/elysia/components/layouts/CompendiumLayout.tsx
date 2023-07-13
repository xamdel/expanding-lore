import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutProps } from '../../types';
import styles from '../../styles/Compendium.module.css'

const CompendiumLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div className={styles.compendiumHeader}>
      <h1>Compendium</h1>
      {router.pathname !== '/Compendium' && (
        <Link href="../Compendium">-Home-</Link>
      )}
      <div>
        {children}
      </div>
    </div>
  );
}

export default CompendiumLayout;