const mongoose = require('mongoose');
const { MongoMemoryReplSet } = require('mongodb-memory-server');

let mongoReplSet;

async function connectTestDb() {
    mongoReplSet = await MongoMemoryReplSet.create({
        replSet: { count: 1, storageEngine: 'wiredTiger' }
    });
    const uri = mongoReplSet.getUri();
    await mongoose.connect(uri, { dbName: 'io_dono_test' });
}

async function clearTestDb() {
    const collections = mongoose.connection.collections;
    for (const collectionName of Object.keys(collections)) {
        await collections[collectionName].deleteMany({});
    }
}

async function disconnectTestDb() {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }
    if (mongoReplSet) {
        await mongoReplSet.stop();
    }
}

module.exports = {
    connectTestDb,
    clearTestDb,
    disconnectTestDb
};
