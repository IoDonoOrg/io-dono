const request = require('supertest');
const app = require('../src/app');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./helpers/testDb');

async function registerAndLoginDonor() {
    const email = `donor_${Date.now()}@test.it`;
    const password = 'Password123!';

    const registerRes = await request(app)
        .post('/api/auth/users')
        .send({
            email,
            password,
            name: 'Donor Test',
            role: 'DONOR',
            phoneNumber: '123',
            address: 'Via Roma'
        });

    expect([200, 201]).toContain(registerRes.statusCode);

    const loginRes = await request(app)
        .post('/api/auth/tokens')
        .send({ email, password });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');

    return loginRes.body.token;
}

describe('Donation API', () => {
    beforeAll(async () => {
        await connectTestDb();
    });

    afterEach(async () => {
        await clearTestDb();
    });

    afterAll(async () => {
        await disconnectTestDb();
    });

    test('POST /api/donations - crea una donazione valida', async () => {
        const token = await registerAndLoginDonor();

        const res = await request(app)
            .post('/api/donations')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: [{ type: 'Cibo', name: 'Pasta', quantity: '5kg' }],
                pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                notes: 'Test note',
                pickupLocation: {
                    address: 'Via Mesiano, Trento',
                    geo: { coordinates: [11.12, 46.06] }
                }
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('AVAILABLE');
        expect(res.body.items[0].name).toBe('Pasta');
    });

    test('GET /api/donations - ritorna la lista donazioni del donor autenticato', async () => {
        const token = await registerAndLoginDonor();

        await request(app)
            .post('/api/donations')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: [{ type: 'Cibo', name: 'Pane', quantity: '2kg' }],
                pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                notes: 'Lista test',
                pickupLocation: {
                    address: 'Via Verdi, Trento',
                    geo: { coordinates: [11.13, 46.07] }
                }
            });

        const res = await request(app)
            .get('/api/donations')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBeGreaterThanOrEqual(1);
    });

    test('GET /api/donations senza token deve fallire', async () => {
        const res = await request(app).get('/api/donations');
        expect(res.statusCode).toBe(401);
    });

    test('POST /api/donations con pickupTime nel passato deve fallire (caso frontiera)', async () => {
        const token = await registerAndLoginDonor();

        const res = await request(app)
            .post('/api/donations')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: [{ type: 'Cibo', name: 'Latte', quantity: '1L' }],
                pickupTime: new Date(Date.now() - 60 * 1000).toISOString(),
                notes: 'Dato di frontiera',
                pickupLocation: {
                    address: 'Via Brennero, Trento',
                    geo: { coordinates: [11.10, 46.08] }
                }
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/non può essere nel passato/i);
    });
});
