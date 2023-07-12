import { GetStaticProps } from 'next';
import { MongoClient } from 'mongodb';
import { Other } from '../../types';
import styles from '../../styles/Compendium.module.css'

const Others = ({ others }: { others: Other[]}) => {
    
    return (
        <div className={styles.container}>
            <h1>Other</h1>
            {others.map((other) => (
                <div key={other._id}>
                    <h2>{other.name}</h2>
                    <p>{other.description}</p>
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
    const othersCollection = db.collection('other');

    const others = await othersCollection.find().sort({ name : 1 }).toArray();

    await client.close();

    return {
        props: {
            others: JSON.parse(JSON.stringify(others)),
        },
        revalidate: 3600,
    };
};

export default Others;