const express = require("express");
const Roles = require("../models/Roles");

// Add Role
const addRole = async (req, res) => {
  const role = req.body.role;
  const permissions = req.body.permissions;

  const newRole = new Roles({ role, permissions });
  const isSaved = await newRole.save();

  if (isSaved) {
    return res.send({ code: 200, message: "role added" });
  }
};

getSelectedRolePermission = async (req, res) => {
  const roleName = req.body.role;
  const role = await Roles.findOne({role:roleName});
  if (role) {
    const {permissions} = role
    res.status(200).send({
      success: true,
      permissions,
    });
  } else {
    res.status(404).send({ success: false, msg: "role not found" });
  }
};

// Delete Role

const deleteRole = async (req, res) => {
  return res.send({ code: 200, message: "role Deleted" });
};

// Get Roles
const getRoles = async (req, res) => {
    try {
      const roles = await Roles.find().exec();
      return res.send(roles);
    } catch (error) {
      console.error(error);
      return res.send({ message: "Server Error" });
    }
  };

module.exports = {
  addRole,
  deleteRole,
  getSelectedRolePermission,
  getRoles,
};
