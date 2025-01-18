import Material from '../models/materials_model.js';

export const createMaterial = async (req, res) => {
    const material = new Material(req.body);
    await material.save();
    res.send(material);
};

export const getMaterials = async (req, res) => {
    const materials = await Material.find();
    res.send(materials);
};