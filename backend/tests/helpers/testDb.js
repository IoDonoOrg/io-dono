const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

async function connectTestDb() {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
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
    if (mongoServer) {
        await mongoServer.stop();
    }
}

module.exports = {
    connectTestDb,
    clearTestDb,
    disconnectTestDb
};
