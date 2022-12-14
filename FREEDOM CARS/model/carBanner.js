const mongoose = require("mongoose");
const carBanner = new mongoose.Schema({
  title: {
    type: String
  },
  bannerImage: {
    type: String,
    default: "uploads/public/carBannerFreedom.jpg"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId
  },
  logDateCreated: {
    type: String
  },
  logDateModified: {
    type: String
  },
  isActive: {
    type: Boolean,
    enum: [false, true],
    default: true
  }
});

module.exports = mongoose.model("carBanners", carBanner);
