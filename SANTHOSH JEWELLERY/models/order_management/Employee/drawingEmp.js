const mongoose = require("mongoose");

const drawings = mongoose.Schema(
    //     drawing_recieved_from: [
    //       {
    //         departement: {
    //           type: String,
    //           enum: [
    //             "Admin",
    //             "Manager",
    //             "Accountant",
    //             "Master of Jewelry Drawing",
    //             "Auto-Cad Employee",
    //             "Ghat Polish Employee",
    //             "Setting Preparation Employee",
    //             "Bandini Employee",
    //             "Stone Detail/Bandini Manage Employee",
    //           ],
    //         },
    //         name: String,
    //         status: {
    //           type: String,
    //           enum: ["Started", "Completed"],
    //           default: "Started",
    //         },
    //         image: String,
    //       },
    //     ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Drawings", drawings);
