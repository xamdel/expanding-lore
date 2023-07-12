import { GetStaticProps } from 'next';
import { MongoClient } from 'mongodb';
import { Locations } from '../../types';
import styles from '../../styles/Compendium.module.css'

const Locations = ({ locations }: { locations: Locations[]}) => {
    
    return (
        <div className={styles.container}>
            <h1>Locations</h1>
            {locations.map((location) => (
                <div key={location._id}>
                    <h2>{location.name}</h2>
                    <p>{location.description}</p>
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
    const locationsCollection = db.collection('locations');

    const locations = await locationsCollection.find().sort({ name : 1 }).toArray();

    await client.close();

    return {
        props: {
            locations: JSON.parse(JSON.stringify(locations)),
        },
        revalidate: 3600,
    };
};

export default Locations;