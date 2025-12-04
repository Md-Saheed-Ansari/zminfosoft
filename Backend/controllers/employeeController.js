const Employee = require("../models/Employee");

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createEmployee = async (req, res) => {
  const { name, role, email, phone, salary } = req.body;

  if (!name || !role || !email || !phone || !salary) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newEmployee = new Employee({ name, role, email, phone, salary });
    await newEmployee.save();
    res.status(201).json({ message: "Employee created" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const updateEmployee = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });
      res.status(200).json(updatedEmployee);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
  

module.exports = {
  createEmployee,
  getEmployees,
  deleteEmployee,
  updateEmployee,

};
