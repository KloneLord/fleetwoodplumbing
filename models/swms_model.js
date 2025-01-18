import db from '../config/db_config.js';

export const saveToDatabase = async (swmsData) => {
    const collection = db.collection('swms');
    await collection.insertOne(swmsData);
};
