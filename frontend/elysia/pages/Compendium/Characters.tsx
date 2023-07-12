import { GetStaticProps } from 'next';
import { MongoClient } from 'mongodb';
import { Character } from '../../types';
import styles from '../../styles/Compendium.module.css'
import Link from 'next/link';

const Characters = ({ characters }: { characters: Character[]}) => {
    
    return (
        <div className={styles.container}>
            <Link href={'../Compendium'}>Home</Link>
            <h1>Characters</h1>
            {characters.map((character) => (
                <div key={character._id}>
                    <h2>{character.name}</h2>
                    <p>{character.physical_description}</p>
                    <p>{character.backstory}</p>
                    <p>{character.description}</p>
                </div>
            ))}
        </div>
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
    const charactersCollection = db.collection('characters');

    const characters = await charactersCollection.find().sort({ name: 1 }).toArray();

    await client.close();

    return {
        props: {
            characters: JSON.parse(JSON.stringify(characters)),
        },
        revalidate: 3600,
    };
};

export default Characters;