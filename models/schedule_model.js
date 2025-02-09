import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
        project_id: { type: String, required: true },
        project_title: { type: String, required: true },
        job_site: { type: String, required: true },
        user_id: { type: String, required: true },
        username: { type: String, required: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        clockin_time: { type: Date },
        clockout_time: { type: Date },
        total_hours: { type: Number, default: 0 },
        entry_date: { type: Date, default: Date.now },
        been_edited: { type: Boolean, default: false },
        edit_log_ids: { type: String }
});

const Job = mongoose.model("Job", jobSchema);
export default Job;