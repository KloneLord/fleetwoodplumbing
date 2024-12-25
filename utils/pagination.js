export const paginate = (model, page, limit) => {
    const skip = (page - 1) * limit;
    return model.find().skip(skip).limit(limit);
};
