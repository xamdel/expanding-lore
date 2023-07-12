import Link from 'next/link';
import styles from '../styles/Compendium.module.css'
import CompendiumLayout from '../components/layouts/CompendiumLayout';

export default function Compendium() {
  return (
    <CompendiumLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <Link href="/Compendium/Storylines">
            <div className={styles.card}>Storylines</div>
          </Link>
          <Link href="/Compendium/Locations">
            <div className={styles.card}>Locations</div>
          </Link>
          <Link href="/Compendium/Factions">
            <div className={styles.card}>Factions</div>
          </Link>
          <Link href="/Compendium/Characters">
            <div className={styles.card}>Characters</div>
          </Link>
          <Link href="/Compendium/Other">
            <div className={styles.card}>Other</div>
          </Link>
        </div>
      </div>
    </CompendiumLayout>
  )
}