const mongoose = require('mongoose');

const parseQuantityNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    if (typeof value !== 'string') return 0;

    const match = value.replace(',', '.').match(/-?\d+(\.\d+)?/);
    if (!match) return 0;
    const parsed = parseFloat(match[0]);
    return Number.isFinite(parsed) ? parsed : 0;
};

const parseDateInput = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date;
};

const validateObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const getDateRange = ({ fromDate, toDate, defaultDays = 30, allowFutureEnd = false }) => {
    const now = new Date();
    let start;
    let end;

    if (!fromDate && !toDate) {
        end = now;
        start = new Date(now);
        start.setDate(start.getDate() - defaultDays);
        return { start, end };
    }

    start = parseDateInput(fromDate);
    end = parseDateInput(toDate);

    if (!start || !end) {
        return { error: 'Formato data non valido.' };
    }

    if (start > end) {
        return { error: 'Intervallo date non valido: data inizio maggiore della data fine.' };
    }

    if (!allowFutureEnd && end > now) {
        return { error: 'Intervallo date non valido: la data fine non puo essere nel futuro.' };
    }

    return { start, end };
};

module.exports = {
    parseQuantityNumber,
    parseDateInput,
    validateObjectId,
    getDateRange
};
