const { 
    buildAppointmentsController, 
    buildAppointmentExpirationJob,
    buildAppointmentReminderJob
 } = require('@apps2/bootstrap/appointments.bootstrap');
const { buildSpecialitiesController } = require('@apps2/bootstrap/specialities.bootstrap');
const { env } = require('@apps2/configs/env.config');

function buildDependencies() {
    const dependencies = {};
    
    if (env.appointmentsEnabled) {
        dependencies.appointmentsController = buildAppointmentsController();
        buildAppointmentExpirationJob().start();
        buildAppointmentReminderJob().start();
    }

    if (env.specialitiesEnabled) {
        dependencies.specialitiesController = buildSpecialitiesController();
    }
    
    return dependencies;
}


module.exports = { buildDependencies };