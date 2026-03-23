const request = require('supertest');
const app = require('../src/app');
const User = require('../src/api/models/User');
const Report = require('../src/api/models/Segnalazione');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./helpers/testDb');

async function registerAndLogin({ role, emailPrefix }) {
    const email = `${emailPrefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.it`;
    const password = 'Password123!';

    const registerRes = await request(app)
        .post('/api/auth/users')
        .send({
            email,
            password,
            name: `${role} Test`,
            role,
            phoneNumber: '123456789',
            address: 'Via Test 1, Trento'
        });

    expect([200, 201]).toContain(registerRes.statusCode);

    const loginRes = await request(app)
        .post('/api/auth/sessions')
        .send({ email, password });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');

    return {
        token: loginRes.body.token,
        user: loginRes.body.user
    };
}

describe('Reports API', () => {
    beforeAll(async () => {
        await connectTestDb();
    });

    afterEach(async () => {
        await clearTestDb();
    });

    afterAll(async () => {
        await disconnectTestDb();
    });

    test('POST /api/reports crea una segnalazione valida', async () => {
        const reporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'reporter' });
        const reported = await registerAndLogin({ role: 'ASSOCIATION', emailPrefix: 'reported' });

        const res = await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${reporter.token}`)
            .send({
                reportedUserId: reported.user._id,
                type: 'USER_BEHAVIOR',
                description: 'Comportamento non corretto al ritiro.'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.status).toBe('success');
        expect(res.body.data.report.status).toBe('OPEN');
        expect(res.body.data.report.type).toBe('USER_BEHAVIOR');
    });

    test('POST /api/reports fallisce senza target (reportedUserId o donationId)', async () => {
        const reporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'reporter_no_target' });

        const res = await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${reporter.token}`)
            .send({
                type: 'MALFUNCTION',
                description: 'Errore tecnico durante il flusso.'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/reportedUserId|donationId/i);
    });

    test('GET /api/reports restituisce solo le segnalazioni del reporter non admin', async () => {
        const reporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'reporter_list' });
        const otherReporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'other_reporter_list' });
        const reported = await registerAndLogin({ role: 'ASSOCIATION', emailPrefix: 'reported_list' });

        await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${reporter.token}`)
            .send({
                reportedUserId: reported.user._id,
                type: 'USER_BEHAVIOR',
                description: 'Segnalazione reporter 1'
            });

        await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${otherReporter.token}`)
            .send({
                reportedUserId: reported.user._id,
                type: 'USER_BEHAVIOR',
                description: 'Segnalazione reporter 2'
            });

        const res = await request(app)
            .get('/api/reports')
            .set('Authorization', `Bearer ${reporter.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(Array.isArray(res.body.data.reports)).toBe(true);
        expect(res.body.data.reports.length).toBe(1);
        expect(res.body.data.reports[0].description).toBe('Segnalazione reporter 1');
    });

    test('GET /api/reports?scope=all permette ad admin di vedere tutte le segnalazioni', async () => {
        const reporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'reporter_scope_all' });
        const otherReporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'other_scope_all' });
        const reported = await registerAndLogin({ role: 'ASSOCIATION', emailPrefix: 'reported_scope_all' });
        const admin = await registerAndLogin({ role: 'ADMIN', emailPrefix: 'admin_scope_all' });

        await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${reporter.token}`)
            .send({
                reportedUserId: reported.user._id,
                type: 'USER_BEHAVIOR',
                description: 'Segnalazione A'
            });

        await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${otherReporter.token}`)
            .send({
                reportedUserId: reported.user._id,
                type: 'MALFUNCTION',
                description: 'Segnalazione B'
            });

        const res = await request(app)
            .get('/api/reports?scope=all')
            .set('Authorization', `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('success');
        expect(Array.isArray(res.body.data.reports)).toBe(true);
        expect(res.body.data.reports.length).toBe(2);
    });

    test('GET /api/reports/:id restituisce il report al proprietario', async () => {
        const reporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'reporter_get_by_id' });
        const reported = await registerAndLogin({ role: 'ASSOCIATION', emailPrefix: 'reported_get_by_id' });

        const createRes = await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${reporter.token}`)
            .send({
                reportedUserId: reported.user._id,
                type: 'USER_BEHAVIOR',
                description: 'Lettura per id'
            });

        const reportId = createRes.body.data.report._id;

        const getRes = await request(app)
            .get(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${reporter.token}`);

        expect(getRes.statusCode).toBe(200);
        expect(getRes.body.status).toBe('success');
        expect(getRes.body.data.report._id).toBe(reportId);
    });

    test('GET /api/reports/:id nega accesso a non proprietario non admin', async () => {
        const reporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'reporter_owner' });
        const nonOwner = await registerAndLogin({ role: 'DONOR', emailPrefix: 'reporter_non_owner' });
        const reported = await registerAndLogin({ role: 'ASSOCIATION', emailPrefix: 'reported_for_forbidden' });

        const createRes = await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${reporter.token}`)
            .send({
                reportedUserId: reported.user._id,
                type: 'MALFUNCTION',
                description: 'Accesso non autorizzato'
            });

        const reportId = createRes.body.data.report._id;

        const getRes = await request(app)
            .get(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${nonOwner.token}`);

        expect(getRes.statusCode).toBe(403);
        expect(getRes.body.message).toMatch(/Accesso negato/i);
    });

    test('PATCH /api/reports/:id fallisce per utente non admin', async () => {
        const reporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'reporter_patch' });
        const reported = await registerAndLogin({ role: 'ASSOCIATION', emailPrefix: 'reported_patch' });

        const createRes = await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${reporter.token}`)
            .send({
                reportedUserId: reported.user._id,
                type: 'USER_BEHAVIOR',
                description: 'Patch non admin'
            });

        const reportId = createRes.body.data.report._id;

        const patchRes = await request(app)
            .patch(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${reporter.token}`)
            .send({ status: 'CLOSED' });

        expect(patchRes.statusCode).toBe(403);
        expect(patchRes.body.message).toMatch(/Admin/i);
    });

    test('PATCH /api/reports/:id aggiorna status per admin', async () => {
        const reporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'reporter_admin' });
        const reported = await registerAndLogin({ role: 'ASSOCIATION', emailPrefix: 'reported_admin' });
        const admin = await registerAndLogin({ role: 'ADMIN', emailPrefix: 'admin_patch' });

        const createRes = await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${reporter.token}`)
            .send({
                reportedUserId: reported.user._id,
                type: 'USER_BEHAVIOR',
                description: 'Patch admin'
            });

        const reportId = createRes.body.data.report._id;

        const patchRes = await request(app)
            .patch(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${admin.token}`)
            .send({ status: 'CLOSED' });

        expect(patchRes.statusCode).toBe(200);
        expect(patchRes.body.status).toBe('success');
        expect(patchRes.body.data.report.status).toBe('CLOSED');

        const dbReport = await Report.findById(reportId);
        expect(dbReport.status).toBe('CLOSED');
    });

    test('PATCH /api/reports/:id con payload vuoto ritorna 400', async () => {
        const reporter = await registerAndLogin({ role: 'DONOR', emailPrefix: 'reporter_empty_patch' });
        const reported = await registerAndLogin({ role: 'ASSOCIATION', emailPrefix: 'reported_empty_patch' });
        const admin = await registerAndLogin({ role: 'ADMIN', emailPrefix: 'admin_empty_patch' });

        const createRes = await request(app)
            .post('/api/reports')
            .set('Authorization', `Bearer ${reporter.token}`)
            .send({
                reportedUserId: reported.user._id,
                type: 'USER_BEHAVIOR',
                description: 'Patch vuoto'
            });

        const reportId = createRes.body.data.report._id;

        const patchRes = await request(app)
            .patch(`/api/reports/${reportId}`)
            .set('Authorization', `Bearer ${admin.token}`)
            .send({});

        expect(patchRes.statusCode).toBe(400);
        expect(patchRes.body.message).toMatch(/Nessun campo valido/i);
    });
});
