import BusinessTimes from '../models/business_times_model.js';

// Save Business Times
export const saveBusinessTimes = async (req, res) => {
    try {
        const { publicholiday_state, work_hours } = req.body;

        let businessTimes = await BusinessTimes.findOne();
        if (!businessTimes) {
            businessTimes = new BusinessTimes();
        }

        businessTimes.publicholiday_state = publicholiday_state || 'Victoria';
        businessTimes.work_hours = work_hours; // { monday_start: '08:00', monday_finish: '16:30', ... }

        await businessTimes.save();
        res.status(200).json({ message: 'Business times saved successfully' });
    } catch (error) {
        console.error('Error saving business times:', error);
        res.status(500).json({ error: 'Failed to save business times' });
    }
};

// Get Business Times
export const getBusinessTimes = async (req, res) => {
    try {
        const businessTimes = await BusinessTimes.findOne();
        res.status(200).json(businessTimes);
    } catch (error) {
        console.error('Error fetching business times:', error);
        res.status(500).json({ error: 'Failed to fetch business times' });
    }
};
