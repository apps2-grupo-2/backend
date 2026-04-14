const { Router } = require('express');
const { validate } = require('@/middlewares/validate.middleware');
const { createAppointmentSchema } = require('@/schemas/create-appointment.schema');
const { getAppointmentsSchema } = require('@/schemas/get-appointments.schema');
const { getAppointmentByIdSchema } = require('@/schemas/get-appointment-by-id.schema');
const { patchAppointmentByIdConfirmSchema } = require('@/schemas/patch-appointment-by-id-confirm.schema');
const { patchAppointmentByIdCancelSchema } = require('@/schemas/patch-appointment-by-id-cancel.schema');
const { patchAppointmentByIdCheckInSchema } = require('@/schemas/patch-appointment-by-id-check-in.schema');

function AppointmentsRouter(appointmentsController) {
    const router = Router();

    router.post(
        '/',
        validate(createAppointmentSchema, 'body'),
        (req, res, next) => appointmentsController.createAppointment(req, res, next)
    );

    router.get('/', 
        validate(getAppointmentsSchema, 'query'),
        (req, res, next) => appointmentsController.getAppointments(req, res, next)
    );

    router.get('/:id', 
        validate(getAppointmentByIdSchema, 'params'),
        (req, res, next) => appointmentsController.getAppointmentById(req, res, next)
    );

    router.patch('/:id/confirm', 
        validate(patchAppointmentByIdConfirmSchema, 'params'),
        (req, res, next) => appointmentsController.patchAppointmentByIdConfirm(req, res, next)
    );

    router.patch('/:id/cancel', 
        validate(patchAppointmentByIdCancelSchema, 'params'),
        (req, res, next) => appointmentsController.patchAppointmentByIdCancel(req, res, next)
    );

    router.patch('/:id/check-in', 
        validate(patchAppointmentByIdCheckInSchema, 'params'),
        (req, res, next) => appointmentsController.patchAppointmentByIdCheckIn(req, res, next)
    );

    return router;
}

module.exports = { AppointmentsRouter };