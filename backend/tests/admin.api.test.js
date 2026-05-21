const request = require('supertest');
const app = require('../src/app');
const { connectTestDb, disconnectTestDb, clearTestDb } = require('./helpers/testDb');
const User = require('../src/api/models/User');
const Donation = require('../src/api/models/Donazione');

describe('Admin API', () => {
    let adminToken;
    let adminId;
    let donorToken;
    let donorId;
    let associationToken;
    let associationId;

    beforeAll(async () => {
        await connectTestDb();
    });

    afterAll(async () => {
        await disconnectTestDb();
    });

    beforeEach(async () => {
        await clearTestDb();

        // Crea admin (solo tramite DB direttamente, non via public API)
        const adminUser = await User.create({
            email: 'admin@test.it',
            password: 'SecureAdmin123!',
            name: 'Admin User',
            role: 'ADMIN',
            phoneNumber: '+39 02 9999999',
            address: 'Via Admin 999'
        });
        adminId = adminUser._id;

        const adminRes = await request(app)
            .post('/api/auth/tokens')
            .send({
                email: 'admin@test.it',
                password: 'SecureAdmin123!'
            });
        adminToken = adminRes.body.token;

        // Crea donor
        const donorRes = await request(app)
            .post('/api/auth/users')
            .send({
                email: 'donor@test.it',
                password: 'DonorPass123!',
                name: 'Donor User',
                role: 'DONOR',
                phoneNumber: '+39 02 1111111',
                address: 'Via Donor 1'
            });
        donorId = donorRes.body.user._id;
        donorToken = donorRes.body.token;

        // Crea association (solo via admin endpoint)
        const assocRes = await request(app)
            .post('/api/admin/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                email: 'assoc@test.it',
                password: 'AssocPass123!',
                name: 'Association User',
                phoneNumber: '+39 02 2222222',
                address: 'Via Assoc 2'
            });
        associationId = assocRes.body.user._id;

        const assocLoginRes = await request(app)
            .post('/api/auth/tokens')
            .send({
                email: 'assoc@test.it',
                password: 'AssocPass123!'
            });
        associationToken = assocLoginRes.body.token;
    });

    describe('POST /api/admin/users', () => {
        it('crea account associazione con ruolo forzato', async () => {
            const res = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    email: 'new.assoc@test.it',
                    password: 'NewAssocPass123!',
                    name: 'New Association',
                    phoneNumber: '+39 02 3333333',
                    address: 'Via New Assoc 3'
                })
                .expect(201);

            expect(res.body.user.role).toBe('ASSOCIATION');
            expect(res.body.user.email).toBe('new.assoc@test.it');
            expect(res.body.user.password).toBeUndefined();
        });

        it('fallisce senza dati incompleti (400)', async () => {
            const res = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    email: 'incomplete@test.it'
                    // Manca password, name, phoneNumber, address
                })
                .expect(400);

            expect(res.body.message).toContain('Dati incompleti');
        });

        it('fallisce se email già in uso (400)', async () => {
            const res = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    email: 'donor@test.it', // Email già usata dal donor
                    password: 'DuplicatePass123!',
                    name: 'Duplicate Email',
                    phoneNumber: '+39 02 4444444',
                    address: 'Via Duplicate 4'
                })
                .expect(400);

            expect(res.body.message).toBe('Email già in uso.');
        });

        it('fallisce se non admin (401/403)', async () => {
            const res = await request(app)
                .post('/api/admin/users')
                .set('Authorization', `Bearer ${donorToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    email: 'unauthorized@test.it',
                    password: 'UnthPass123!',
                    name: 'Unauthorized',
                    phoneNumber: '+39 02 5555555',
                    address: 'Via Unauth 5'
                });

            expect([401, 403]).toContain(res.statusCode);
        });

        it('fallisce senza token (401)', async () => {
            await request(app)
                .post('/api/admin/users')
                .send({
                    email: 'notoken@test.it',
                    password: 'NoTokenPass123!',
                    name: 'No Token',
                    phoneNumber: '+39 02 6666666',
                    address: 'Via NoToken 6'
                })
                .expect(401);
        });
    });

    describe('PATCH /api/admin/users/:id', () => {
        it('banna un utente con motivazione', async () => {
            const res = await request(app)
                .patch(`/api/admin/users/${donorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    isBanned: true,
                    bannedReason: 'Violazione termini di servizio'
                })
                .expect(200);

            expect(res.body.user.isBanned).toBe(true);
            expect(res.body.user.bannedReason).toBe('Violazione termini di servizio');
            expect(res.body.user).toHaveProperty('bannedAt');
            expect(res.body.user).toHaveProperty('bannedBy');
            expect(res.body.user.bannedBy.toString()).toBe(adminId.toString());
        });

        it('non può bannare se stesso (409)', async () => {
            const res = await request(app)
                .patch(`/api/admin/users/${adminId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Content-Type', 'application/json')
                .send({
                    isBanned: true,
                    bannedReason: 'Self ban attempt'
                })
                .expect(409);

            expect(res.body.message).toContain('Non puoi modificare lo stato del tuo account admin');

            // Verifica che admin non sia stato bannato
            const admin = await User.findById(adminId);
            expect(admin.isBanned).toBe(false);
        });

        it('sbanna un utente (isBanned=false)', async () => {
            // Prima banna
            await request(app)
                .patch(`/api/admin/users/${donorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    isBanned: true,
                    bannedReason: 'Temporary ban'
                });

            // Poi sbanna
            const res = await request(app)
                .patch(`/api/admin/users/${donorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Content-Type', 'application/json')
                .send({ isBanned: false })
                .expect(200);

            expect(res.body.user.isBanned).toBe(false);
            expect(res.body.user.bannedAt).toBeNull();
            expect(res.body.user.bannedBy).toBeNull();
            expect(res.body.user.bannedReason).toBeNull();
        });

        it('bannato non può fare operazioni autenticate (403)', async () => {
            // Banna il donor
            await request(app)
                .patch(`/api/admin/users/${donorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    isBanned: true,
                    bannedReason: 'Testing ban enforcement'
                });

            // Tenta di creare una donazione con utente bannato
            const res = await request(app)
                .post('/api/donations')
                .set('Authorization', `Bearer ${donorToken}`)
                .send({
                    items: [{ type: 'FOOD', name: 'Bread', quantity: '5' }],
                    pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    pickupLocation: { address: 'Via Roma 123', geo: { type: 'Point', coordinates: [9.19, 45.46] } }
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toContain('Account bloccato');
        });

        it('fallisce se ID non valido (400)', async () => {
            await request(app)
                .patch(`/api/admin/users/invalid-id`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Content-Type', 'application/json')
                .send({ isBanned: true })
                .expect(400);
        });

        it('fallisce se utente non trovato (404)', async () => {
            const fakeId = '000000000000000000000000';

            await request(app)
                .patch(`/api/admin/users/${fakeId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Content-Type', 'application/json')
                .send({ isBanned: true })
                .expect(404);
        });

        it('fallisce se nessun campo valido da aggiornare (400)', async () => {
            const res = await request(app)
                .patch(`/api/admin/users/${donorId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .set('Content-Type', 'application/json')
                .send({}) // Payload vuoto
                .expect(400);

            expect(res.body.message).toContain('Nessun campo valido');
        });

        it('fallisce se non admin (401/403)', async () => {
            const res = await request(app)
                .patch(`/api/admin/users/${donorId}`)
                .set('Authorization', `Bearer ${donorToken}`)
                .set('Content-Type', 'application/json')
                .send({ isBanned: true });

            expect([401, 403]).toContain(res.statusCode);
        });

        it('fallisce senza token (401)', async () => {
            await request(app)
                .patch(`/api/admin/users/${donorId}`)
                .set('Content-Type', 'application/json')
                .send({ isBanned: true })
                .expect(401);
        });
    });

    describe('GET /api/admin/statistics/overview', () => {
        it('ritorna KPI principali (ultimi 30 giorni)', async () => {
            // Crea una donazione di prova
            await request(app)
                .post('/api/donations')
                .set('Authorization', `Bearer ${donorToken}`)
                .send({
                    items: [{ type: 'FOOD', name: 'Pane', quantity: '10 kg' }],
                    pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    pickupLocation: { address: 'Via Roma 123', geo: { type: 'Point', coordinates: [9.19, 45.46] } }
                });

            const res = await request(app)
                .get('/api/admin/statistics/overview')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('period');
            expect(res.body.period).toHaveProperty('start');
            expect(res.body.period).toHaveProperty('end');
            expect(res.body).toHaveProperty('donations');
            expect(res.body.donations).toHaveProperty('total');
            expect(res.body.donations).toHaveProperty('byCategory');
            expect(res.body).toHaveProperty('reports');
            expect(res.body).toHaveProperty('usersByRole');
        });

        it('fallisce se non admin (401/403)', async () => {
            const res = await request(app)
                .get('/api/admin/statistics/overview')
                .set('Authorization', `Bearer ${donorToken}`);

            expect([401, 403]).toContain(res.statusCode);
        });

        it('fallisce senza token (401)', async () => {
            await request(app)
                .get('/api/admin/statistics/overview')
                .expect(401);
        });
    });

    describe('GET /api/admin/statistics/trend', () => {
        it('ritorna trend donazioni giorno per giorno (default 30 giorni)', async () => {
            const res = await request(app)
                .get('/api/admin/statistics/trend')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('period');
            expect(res.body).toHaveProperty('trend');
            expect(Array.isArray(res.body.trend)).toBe(true);
        });

        it('supporta range personalizzato con query params', async () => {
            const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 giorni fa
            const toDate = new Date().toISOString();

            const res = await request(app)
                .get(`/api/admin/statistics/trend?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('period');
            expect(res.body.trend).toEqual(expect.any(Array));
        });

        it('fallisce con date range non valido (400)', async () => {
            const res = await request(app)
                .get('/api/admin/statistics/trend?fromDate=invalid-date')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400);

            expect(res.body).toHaveProperty('message');
        });

        it('fallisce se non admin (401/403)', async () => {
            const res = await request(app)
                .get('/api/admin/statistics/trend')
                .set('Authorization', `Bearer ${donorToken}`);

            expect([401, 403]).toContain(res.statusCode);
        });
    });

    describe('GET /api/admin/statistics (filtrate)', () => {
        it('ritorna statistiche filtrate con query params', async () => {
            const res = await request(app)
                .get('/api/admin/statistics')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('period');
            expect(res.body).toHaveProperty('filtersApplied');
            expect(res.body).toHaveProperty('totals');
            expect(res.body.totals).toHaveProperty('donations');
            expect(res.body.totals).toHaveProperty('byAssociation');
            expect(res.body.totals).toHaveProperty('byCategory');
        });

        it('filtra per itemType', async () => {
            const res = await request(app)
                .get('/api/admin/statistics?itemType=FOOD')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(res.body.filtersApplied.itemType).toBe('FOOD');
        });

        it('filtra per area', async () => {
            const res = await request(app)
                .get('/api/admin/statistics?area=Milano')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(res.body.filtersApplied.area).toBe('Milano');
        });

        it('filtra per range date', async () => {
            const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const toDate = new Date().toISOString();

            const res = await request(app)
                .get(`/api/admin/statistics?fromDate=${encodeURIComponent(fromDate)}&toDate=${encodeURIComponent(toDate)}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(res.body.period).toHaveProperty('from');
            expect(res.body.period).toHaveProperty('to');
        });

        it('fallisce con associationId non valido (400)', async () => {
            const res = await request(app)
                .get('/api/admin/statistics?associationId=invalid-id')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(400);

            expect(res.body.message).toContain('associationId non valido');
        });

        it('fallisce se non admin (401/403)', async () => {
            const res = await request(app)
                .get('/api/admin/statistics')
                .set('Authorization', `Bearer ${donorToken}`);

            expect([401, 403]).toContain(res.statusCode);
        });

        it('fallisce senza token (401)', async () => {
            await request(app)
                .get('/api/admin/statistics')
                .expect(401);
        });
    });
});
