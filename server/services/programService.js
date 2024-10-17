const MODEL = require('../models/programModel');

const getAll = async () => {
    console.log('getting programs')
    return await MODEL.find().populate('departmentId');
};

const getById = async (id) => {
    return await MODEL.findById(id).populate('departmentId');
};

const add = async (data) => {
    const newItem = new MODEL(data);
    return await newItem.save();
};

const update = async (id, data) => {
    return await MODEL.findByIdAndUpdate(id, data, { new: true });
};

const remove = async (id) => {
    return await MODEL.findByIdAndDelete(id);
};

module.exports = {
    getAll,
    getById,
    add,
    update,
    remove,
};
