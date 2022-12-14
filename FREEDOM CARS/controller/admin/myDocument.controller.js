const myDocumentsModel = require("../../model/myDocuments");

// add user documents
exports.addDocument = function (req, res) {
  try {
    let logDate = new Date();
    const docObj = new myDocumentsModel({
      collectionName: req.body.collectionName,
      collectDocumentId: req.body.collectDocumentId,
      dlNumber: req.body.dlNumber,
      occupationIdCard: req.body.occupationIdCard,
      passportFront: req.file.path,
      passportBack: req.file.path,
      passportVisa: req.file.path,
      aadharCardFront: req.file.path,
      aadharCardBack: req.file.path,
      createdBy: req.userId,
      logDateCreated: logDate,
      logDateModified: logDate
    });

    docObj.save(function (eror, data) {
      if (eror) {
        return res
          .status(400)
          .json({ message: "Documents could not be added" });
      }
      if (data) {
        res.status(200).json({ message: "Documents added successfully" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Something went wrong..!" });
  }
};
