const Department = require('../models/Department');

const departmentService = {
  createDepartment: async (departmentData) => {
    const department = new Department(departmentData);
    return await department.save();
  },
  
  getAllDepartments: async () => {
    return await Department.find();
  },

  getDepartmentById: async (id) => {
    return await Department.findById(id);
  },

  updateDepartment: async (id, departmentData) => {
    return await Department.findByIdAndUpdate(id, departmentData, { new: true });
  },

  deleteDepartment: async (id) => {
    return await Department.findByIdAndDelete(id);
  }
};

module.exports = departmentService;
