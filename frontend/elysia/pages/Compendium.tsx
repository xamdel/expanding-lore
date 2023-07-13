import Link from 'next/link';
import styles from '../styles/Compendium.module.css'
import CompendiumLayout from '../components/layouts/CompendiumLayout';

export default function Compendium() {
  return (
    <CompendiumLayout>
      <div>
        <div className={styles.cardContainer}>
          <Link href="/Compendium/Storylines">
            <div className={`${styles.card} ${styles.storylinesCard}`}>Storylines</div>
          </Link>
          <Link href="/Compendium/Locations">
            <div className={`${styles.card} ${styles.locationsCard}`}>Locations</div>
          </Link>
          <Link href="/Compendium/Factions">
            <div className={`${styles.card} ${styles.factionsCard}`}>Factions</div>
          </Link>
          <Link href="/Compendium/Characters">
            <div className={`${styles.card} ${styles.charactersCard}`}>Characters</div>
          </Link>
          <Link href="/Compendium/Other">
            <div className={`${styles.card} ${styles.otherCard}`}>Other</div>
          </Link>
        </div>
      </div>
    </CompendiumLayout>
  )
}