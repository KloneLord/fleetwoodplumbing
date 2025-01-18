
import Plan from '../models/plan_model.js';

export const createPlan = async (req, res) => {
    const plan = new Plan(req.body);
    await plan.save();
    res.send(plan);
};

export const getPlans = async (req, res) => {
    const plans = await Plan.find();
    res.send(plans);
};