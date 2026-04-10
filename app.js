require('module-alias/register');
const cors = require('cors');
const express = require('express');
const { httpLogger } = require('@/middlewares/http-logger.middleware');
const { errorHandler } = require('@/middlewares/error-handler.middleware');
const { dbPool } = require('@/configs/database.config');

const { AppointmentsRouter } = require('@/routes/appointments.route');
const { AppointmentsController } = require('@/controllers/appointments.controller');
const { AppointmentsService } = require('@/services/appointments.service');
const { MySqlAppointmentsRepository } = require('@/repositories/appointments.repository');

function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(httpLogger);

    const appointmentsRepository = new MySqlAppointmentsRepository(dbPool);
    const appointmentsService = new AppointmentsService(appointmentsRepository);
    const appointmentsController = new AppointmentsController(appointmentsService);

    app.use('/api/v1/appointments', AppointmentsRouter(appointmentsController));

    app.use((req, res) => {
        return res.status(404).json({
            error: 'Not found',
            message: `Route ${req.method} ${req.originalUrl} not found`
        });
    });
    
    app.use(errorHandler);
    return app;
}

module.exports = { createApp };