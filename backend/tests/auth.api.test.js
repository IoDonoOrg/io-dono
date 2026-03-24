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

    describe('POST /api/auth/sessions', () => {
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
                .post('/api/auth/sessions')
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
                .post('/api/auth/sessions')
                .send({
                    email: 'wrongpwd@test.it',
                    password: 'BadPassword123!'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body.message).toBe('Credenziali non valide.');
        });
    });
});
