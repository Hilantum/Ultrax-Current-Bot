const { model, Schema } = require("mongoose");

let registerSchema = new Schema({
    userId: String,
    userDepartment: String,
    userJoinedStaff: Date,
    userRobux: { type: Number, default: '0' },
    userNotes: { type: Array, default: [] },
    userStatus: String,
});

module.exports = model("Staff Database", registerSchema);