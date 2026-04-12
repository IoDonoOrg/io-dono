const request = require('supertest');
const app = require('../src/app');
const { connectTestDb, disconnectTestDb, clearTestDb } = require('./helpers/testDb');
const User = require('../src/api/models/User');
const Reward = require('../src/api/models/Ricompensa');
const RewardClaim = require('../src/api/models/RewardClaim');

describe('Reward API', () => {
    let donorToken;
    let rewardId;

    beforeAll(async () => {
        await connectTestDb();
    });

    afterAll(async () => {
        await disconnectTestDb();
    });

    beforeEach(async () => {
        await clearTestDb();

        // Crea un donor con punti solidali
        const donorRes = await request(app)
            .post('/api/auth/users')
            .set('Content-Type', 'application/json')
            .send({
                email: 'donor@example.com',
                password: 'Pass1234',
                name: 'Donor Test',
                phoneNumber: '+39 02 1234567',
                address: 'Via Roma 123'
            });

        donorToken = donorRes.body.token;

        // Aggiungi punti solidali al donor
        await User.findByIdAndUpdate(
            donorRes.body.user._id,
            { solidarityPoints: 200 }
        );

        // Crea reward attiva
        const activeReward = await Reward.create({
            title: 'Buono 10€',
            description: 'Buono sconto',
            pointsCost: 50,
            isActive: true,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        rewardId = activeReward._id;
    });

    describe('GET /api/rewards', () => {
        it('elenca le ricompense disponibili', async () => {
            const res = await request(app)
                .get('/api/rewards')
                .set('Authorization', `Bearer ${donorToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('items');
            expect(res.body).toHaveProperty('solidarityPoints', 200);
            expect(res.body.items.some(r => r._id.toString() === rewardId.toString())).toBe(true);
        });

        it('fallisce senza token', async () => {
            await request(app)
                .get('/api/rewards')
                .expect(401);
        });
    });

    describe('POST /api/me/rewards/claims', () => {
        it('attiva una reward correttamente', async () => {
            const res = await request(app)
                .post('/api/me/rewards/claims')
                .set('Authorization', `Bearer ${donorToken}`)
                .set('Content-Type', 'application/json')
                .send({ rewardId: rewardId.toString() })
                .expect(201);

            expect(res.body.claim).toHaveProperty('activationCode');
            expect(res.body).toHaveProperty('pointsSpent', 50);
            expect(res.body).toHaveProperty('remainingPoints', 150);
        });

        it('fallisce se punti insufficienti (409)', async () => {
            const donor = await User.findOne({ email: 'donor@example.com' });
            await User.findByIdAndUpdate(donor._id, { solidarityPoints: 10 });

            const res = await request(app)
                .post('/api/me/rewards/claims')
                .set('Authorization', `Bearer ${donorToken}`)
                .set('Content-Type', 'application/json')
                .send({ rewardId: rewardId.toString() })
                .expect(409);

            expect(res.body.message).toBe('Punti solidali insufficienti.');
        });

        it('fallisce con rewardId non valido (400)', async () => {
            await request(app)
                .post('/api/me/rewards/claims')
                .set('Authorization', `Bearer ${donorToken}`)
                .set('Content-Type', 'application/json')
                .send({ rewardId: 'invalid-id' })
                .expect(400);
        });

        it('fallisce senza token (401)', async () => {
            await request(app)
                .post('/api/me/rewards/claims')
                .set('Content-Type', 'application/json')
                .send({ rewardId: rewardId.toString() })
                .expect(401);
        });
    });

    describe('GET /api/me/rewards/claims', () => {
        it('elenca i claim reward dell\'utente', async () => {
            await request(app)
                .post('/api/me/rewards/claims')
                .set('Authorization', `Bearer ${donorToken}`)
                .send({ rewardId: rewardId.toString() })
                .expect(201);

            const res = await request(app)
                .get('/api/me/rewards/claims')
                .set('Authorization', `Bearer ${donorToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('items');
            expect(res.body).toHaveProperty('meta');
            expect(res.body.items.length).toBe(1);
        });

        it('fallisce senza token (401)', async () => {
            await request(app)
                .get('/api/me/rewards/claims')
                .expect(401);
        });
    });

    describe('PATCH /api/me/rewards/claims/:claimId', () => {
        it('aggiorna stato a USED', async () => {
            const claimRes = await request(app)
                .post('/api/me/rewards/claims')
                .set('Authorization', `Bearer ${donorToken}`)
                .send({ rewardId: rewardId.toString() })
                .expect(201);

            const claimId = claimRes.body.claim._id;

            const res = await request(app)
                .patch(`/api/me/rewards/claims/${claimId}`)
                .set('Authorization', `Bearer ${donorToken}`)
                .set('Content-Type', 'application/json')
                .send({ status: 'USED' })
                .expect(200);

            expect(res.body.status).toBe('USED');
        });

        it('fallisce se claim non trovato (404)', async () => {
            await request(app)
                .patch(`/api/me/rewards/claims/000000000000000000000000`)
                .set('Authorization', `Bearer ${donorToken}`)
                .set('Content-Type', 'application/json')
                .send({ status: 'USED' })
                .expect(404);
        });

        it('fallisce senza token (401)', async () => {
            await request(app)
                .patch(`/api/me/rewards/claims/000000000000000000000000`)
                .set('Content-Type', 'application/json')
                .send({ status: 'USED' })
                .expect(401);
        });
    });
});
