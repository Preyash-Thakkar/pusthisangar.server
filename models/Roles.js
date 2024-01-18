const mongoose = require("mongoose");
const { Schema } = mongoose;

const roleSchema = new mongoose.Schema({

    role : String,
    permissions : [{
        type : String,
    }]
});

const Role = mongoose.model ("Role" , roleSchema);

module.exports = Role;
