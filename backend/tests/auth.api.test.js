const request = require('supertest');
const app = require('../src/app');
const User = require('../src/api/models/User');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./helpers/testDb');

describe('Auth API (registrazione e login)', () => {
    beforeAll(async () => {
        await connectTestDb();
    });

    afterEach(async () => {
        await clearTestDb();
    });

    afterAll(async () => {
        await disconnectTestDb();
    });

    describe('POST /api/auth/users', () => {
        test('registra un nuovo utente correttamente', async () => {
            const res = await request(app)
                .post('/api/auth/users')
                .send({
                    email: 'test@unitn.it',
                    password: 'Password123!',
                    name: 'Marco Test',
                    role: 'DONOR',
                    phoneNumber: '123456789',
                    address: 'Via Sommarive 5, Trento'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe('test@unitn.it');
        });

        test('fallisce se email già in uso', async () => {
            await User.create({
                email: 'esistente@unitn.it',
                password: 'Password123!',
                name: 'Esistente',
                role: 'DONOR',
                phoneNumber: '000',
                address: 'Indirizzo'
            });

            const res = await request(app)
                .post('/api/auth/users')
                .send({
                    email: 'esistente@unitn.it',
                    password: 'NuovaPassword123!',
                    name: 'Altro Nome',
                    role: 'DONOR',
                    phoneNumber: '111',
                    address: 'Altro indirizzo'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Email già in uso.');
        });
    });

    describe('POST /api/auth/tokens', () => {
        test('effettua login con credenziali valide', async () => {
            const password = 'SecretPassword123!';
            await User.create({
                email: 'login@test.it',
                password,
                name: 'Login User',
                role: 'DONOR',
                phoneNumber: '111',
                address: 'Test Addr'
            });

            const res = await request(app)
                .post('/api/auth/tokens')
                .send({
                    email: 'login@test.it',
                    password
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe('login@test.it');
        });

        test('fallisce con password errata', async () => {
            await User.create({
                email: 'wrongpwd@test.it',
                password: 'ValidPass123!',
                name: 'Wrong Pwd',
                role: 'DONOR',
                phoneNumber: '222',
                address: 'Addr test'
            });

            const res = await request(app)
                .post('/api/auth/tokens')
                .send({
                    email: 'wrongpwd@test.it',
                    password: 'BadPassword123!'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Credenziali non valide.');
        });
    });
    describe('POST /api/auth/users - Role Hardening (Security)', () => {
        test('consente registrazione con role=DONOR', async () => {
            const res = await request(app)
                .post('/api/auth/users')
                .send({
                    email: 'donor@hardened.it',
                    password: 'Password123!',
                    name: 'Donor Hardened',
                    role: 'DONOR',
                    phoneNumber: '333',
                    address: 'Via Hardened'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.role).toBe('DONOR');
        });

        test('nega registrazione con role=ASSOCIATION (403)', async () => {
            const res = await request(app)
                .post('/api/auth/users')
                .send({
                    email: 'assoc@hardened.it',
                    password: 'Password123!',
                    name: 'Association Attempt',
                    role: 'ASSOCIATION',
                    phoneNumber: '444',
                    address: 'Via Hacked'
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe('Ruolo non consentito per registrazione pubblica.');
        });

        test('nega registrazione con role=ADMIN (403)', async () => {
            const res = await request(app)
                .post('/api/auth/users')
                .send({
                    email: 'admin@hardened.it',
                    password: 'Password123!',
                    name: 'Admin Attempt',
                    role: 'ADMIN',
                    phoneNumber: '555',
                    address: 'Via BadActor'
                });

            expect(res.statusCode).toBe(403);
            expect(res.body.message).toBe('Ruolo non consentito per registrazione pubblica.');
        });

        test('default a DONOR se role non specified', async () => {
            const res = await request(app)
                .post('/api/auth/users')
                .send({
                    email: 'default@hardened.it',
                    password: 'Password123!',
                    name: 'Default Role User',
                    phoneNumber: '666',
                    address: 'Via Default'
                    // Nessun 'role' specificato
                });

            expect(res.statusCode).toBe(201);
            expect(res.body.user.role).toBe('DONOR');
        });

        test('ASSOCIATION e ADMIN creabili solo da /api/admin/users (admin-only endpoint)', async () => {
            // Questo test verifica che ASSOCIATION non possa essere creata via public endpoint
            // Conferma che /api/admin/users è l'unico modo per creare ASSOCIATION/ADMIN
            // (il test per /api/admin/users è in admin.api.test.js)

            const res = await request(app)
                .post('/api/auth/users')
                .send({
                    email: 'attempt.assoc@hardened.it',
                    password: 'Password123!',
                    name: 'Association Try Again',
                    role: 'ASSOCIATION',
                    phoneNumber: '777',
                    address: 'Via Persistence'
                });

            expect(res.statusCode).toBe(403);

            // Verifica che nessun utente con email sia stato creato
            const user = await User.findOne({ email: 'attempt.assoc@hardened.it' });
            expect(user).toBeNull();
        });
    });
});
