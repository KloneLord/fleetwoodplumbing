import mongoose from 'mongoose';

const businessTimesSchema = new mongoose.Schema({
    publicholiday_state: { type: String, default: 'Victoria' },
    work_hours: {
        monday_start: { type: String, default: '08:00' },
        monday_finish: { type: String, default: '16:30' },
        tuesday_start: { type: String, default: '08:00' },
        tuesday_finish: { type: String, default: '16:30' },
        wednesday_start: { type: String, default: '08:00' },
        wednesday_finish: { type: String, default: '16:30' },
        thursday_start: { type: String, default: '08:00' },
        thursday_finish: { type: String, default: '16:30' },
        friday_start: { type: String, default: '08:00' },
        friday_finish: { type: String, default: '16:30' },
        saturday_start: { type: String, default: '08:00' },
        saturday_finish: { type: String, default: '12:00' },
        sunday_start: { type: String, default: '00:00' },
        sunday_finish: { type: String, default: '00:00' },
    },
}, { timestamps: true });

const BusinessTimes = mongoose.model('BusinessTimes', businessTimesSchema);
export default BusinessTimes;
