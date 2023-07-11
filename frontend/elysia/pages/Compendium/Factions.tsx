import { GetStaticProps } from 'next';
import { MongoClient } from 'mongodb';
import { Factions } from '../../types';

const Factions = ({ factions }: { factions: Factions[]}) => {
    
    return (
        <div>
            <h1>Factions</h1>
            {factions.map((faction) => (
                <div key={faction._id}>
                    <h2>{faction.name}</h2>
                    <p>{faction.description}</p>
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
    const factionsCollection = db.collection('factions');

    const factions = await factionsCollection.find().toArray();

    await client.close();

    return {
        props: {
            factions: JSON.parse(JSON.stringify(factions)),
        },
        revalidate: 3600,
    };
};

export default Factions;