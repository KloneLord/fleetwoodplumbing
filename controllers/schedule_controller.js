import Job from "../models/schedule_model.js";

// Create a new schedule entry
export const createSchedule = async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json({ message: "Schedule entry created", job });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get all schedule entries
export const getSchedules = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get a specific schedule entry by ID
export const getScheduleById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: "Schedule not found" });
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Update a schedule entry
export const updateSchedule = async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedJob) return res.status(404).json({ message: "Schedule not found" });
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

// Delete a schedule entry
export const deleteSchedule = async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) return res.status(404).json({ message: "Schedule not found" });
        res.status(200).json({ message: "Schedule deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};