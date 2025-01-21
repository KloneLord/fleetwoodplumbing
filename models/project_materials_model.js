import mongoose from 'mongoose';

const projectMaterialsSchema = new mongoose.Schema(
    {
        project_id: { type: String, required: true },
        username: { type: String, required: true },
        item_id: { type: String, required: true },
        item_name: { type: String, required: true },
        item_category: { type: String, required: true },
        quantity_booked_out: { type: Number, required: true },
        log_id: { type: String, required: true, unique: true },
        project_status: { type: String, default: 'Booked Out' },
        time: { type: String, required: true },
        date: { type: String, required: true },
    },
    { timestamps: true }
);

const ProjectMaterials = mongoose.model('ProjectMaterials', projectMaterialsSchema);
export default ProjectMaterials;