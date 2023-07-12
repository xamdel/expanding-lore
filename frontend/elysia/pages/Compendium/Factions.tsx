import { GetStaticProps } from 'next';
import { MongoClient } from 'mongodb';
import { Factions } from '../../types';
import styles from '../../styles/Compendium.module.css'
import Link from 'next/link';
import CompendiumLayout from '../../components/layouts/CompendiumLayout';

const Factions = ({ factions }: { factions: Factions[] }) => {

    return (
        <CompendiumLayout>
            <div className={styles.container}>
                <Link href={'../Compendium'}>Home</Link>
                <h1>Factions</h1>
                {factions.map((faction) => (
                    <div key={faction._id}>
                        <h2>{faction.name}</h2>
                        <p>{faction.description}</p>
                    </div>
                ))}
            </div>
        </CompendiumLayout>
    );
};

const MONGO_URI = process.env.NEXT_PUBLIC_MONGO_URI;
if (!MONGO_URI) {
    throw new Error("Database environment variable not set");
}

export const getStaticProps: GetStaticProps = async () => {
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    const db = client.db();
    const factionsCollection = db.collection('factions');

    const factions = await factionsCollection.find().sort({ name: 1 }).toArray();

    await client.close();

    return {
        props: {
            factions: JSON.parse(JSON.stringify(factions)),
        },
        revalidate: 3600,
    };
};

export default Factions;