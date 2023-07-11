import { GetStaticProps } from 'next';
import { MongoClient } from 'mongodb';
import { Narratives } from '../../types';

const Narratives = ({ narratives }: { narratives: Narratives[]}) => {
    
    return (
        <div>
            <h1>Narratives</h1>
            {narratives.map((narrative) => (
                <div key={narrative._id}>
                    <h2>{narrative["story name"]}</h2>
                    <p>{narrative.narrative_thread}</p>
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
    const narrativesCollection = db.collection('narratives');

    const narratives = await narrativesCollection.find().toArray();

    await client.close();

    return {
        props: {
            narratives: JSON.parse(JSON.stringify(narratives)),
        },
        revalidate: 3600,
    };
};

export default Narratives;