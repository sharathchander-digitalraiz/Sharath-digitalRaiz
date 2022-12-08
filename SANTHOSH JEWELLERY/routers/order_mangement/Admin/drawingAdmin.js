const mongoose = require("mongoose");

const drawings_issued_to = mongoose.Schema({
    departement: {
      type: String,
      enum: [
        "Admin",
        "Manager",
        "Accountant",
        "Master of Jewelry Drawing",
        "Auto-Cad Employee",
        "Ghat Polish Employee",
        "Setting Preparation Employee",
        "Bandini Employee",
        "Stone Detail/Bandini Manage Employee",
      ],
    },
    name: String,
    image: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drawings_issued_to", drawings_issued_to);
