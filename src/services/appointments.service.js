const { BadRequestError } = require('@/errors/bad-request-error');
const { NotFoundError } = require('@/errors/not-found-error');
const { InternalServerError } = require('@/errors/internal-server-error');
const { paginationConfig } = require('@/configs/pagination.config');

class AppointmentsService {
    constructor(appointmentsRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    async createAppointment(data) {
        const now = new Date();
        if (new Date(data.starts_at) < now) {
            throw new BadRequestError('Cannot create appointment in the past');
        }

        const result = await this.appointmentsRepository.create(data);
        if (!result.success) {
            if (result.sqlState === '45000') {
                throw new BadRequestError('Scheduling conflict: Medic, patient, or center is not available at the requested time');
            }

            throw new InternalServerError('Failed to create appointment: ' + result.sqlState);
        }
        
        return { appointment_id: result.data };
    }

    async getAppointments(query) {
        const result = await this.appointmentsRepository.findAll(paginationConfig.defaultPageSize, query);
        
        if (!result.success) {
            throw new InternalServerError('Failed to retrieve appointments: ' + result.sqlState);
        }
        
        return result.data;
    }

    async getAppointmentById(id) {
        const response = await this.appointmentsRepository.findById(id);
        
        if (!response.success) {
            throw new InternalServerError('Failed to find appointment: ' + response.sqlState);
        }

        if (!response.data) {
            throw new NotFoundError(`Appointment id ${id} not found`);
        }
        
        return response.data;
    }

    async confirmAppointment(id) {
        const result = await this.appointmentsRepository.confirm(id);

        if (!result.success) {
            throw new InternalServerError('Failed to confirm appointment: ' + result.sqlState);
        }

        if (!result.data.affectedRows) {
            const found = await this.appointmentsRepository.findById(id);
            if (!found.success) {
                throw new InternalServerError('Failed to find appointment: ' + found.sqlState);
            }

            if (!found.data) {
                throw new NotFoundError(`Appointment id ${id} not found`);
            }

            throw new BadRequestError('Appointment cannot be confirmed in its current state');
        }

        return this.getAppointmentById(id);
    }

    async checkInAppointment(id) {
        const result = await this.appointmentsRepository.checkIn(id);

        if (!result.success) {
            throw new InternalServerError('Failed to check-in appointment: ' + result.sqlState);
        }

        if (!result.data.affectedRows) {
            const found = await this.appointmentsRepository.findById(id);
            if (!found.success) {
                throw new InternalServerError('Failed to find appointment: ' + found.sqlState);
            }

            if (!found.data) {
                throw new NotFoundError(`Appointment id ${id} not found`);
            }

            throw new BadRequestError('Appointment cannot be checked-in in its current state');
        }

        return this.getAppointmentById(id);
    }

    async cancelAppointment(id) {
        const result = await this.appointmentsRepository.cancel(id);

        if (!result.success) {
            throw new InternalServerError('Failed to cancel appointment: ' + result.sqlState);
        }

        if (!result.data.affectedRows) {
            const found = await this.appointmentsRepository.findById(id);
            if (!found.success) {
                throw new InternalServerError('Failed to find appointment: ' + found.sqlState);
            }

            if (!found.data) {
                throw new NotFoundError(`Appointment id ${id} not found`);
            }

            throw new BadRequestError('Appointment cannot be cancelled in its current state');
        }

        return this.getAppointmentById(id);
    }

}

module.exports = { AppointmentsService };