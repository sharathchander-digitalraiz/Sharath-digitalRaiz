const landmarks = require("../model/landmarks");
exports.createLadmarks = (req, res) => {
  console.log(req.body);
  const {
    landmark_no,
    landmark_from,
    landmark_to,
    tenent_id,
    zones_id,
    circles_id,
    areas_id,
    wards_id,
    status,
    log_date_created,
    log_date_modified,
    created_by,
    modified_by
  } = req.body;

  const landmark = new landmarks({
    landmark_no: landmark_no,
    landmark_from: landmark_from,
    landmark_to: landmark_to,
    tenent_id: tenent_id,
    zones_id: zones_id,
    status: status,
    circles_id: circles_id,
    areas_id: areas_id,
    wards_id: wards_id,
    log_date_created: log_date_created,
    log_date_modified: log_date_modified,
    created_by: created_by,
    modified_by: modified_by
  });

  landmark.save((error, landmark) => {
    if (error) return res.status(400).json({ error });
    if (landmark) {
      res.status(200).json({ status: true, message: "Added Successfully" });
    }
  });
};

/* 
exports.getProductsBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id type")
    .exec((error, category) => {
      if (error) {
        return res.status(400).json({ error });
      }

      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) {
            return res.status(400).json({ error });
          }

          if (category.type) {
            if (products.length > 0) {
              res.status(200).json({
                products,
                priceRange: {
                  under5k: 5000,
                  under10k: 10000,
                  under15k: 15000,
                  under20k: 20000,
                  under30k: 30000,
                },
                productsByPrice: {
                  under5k: products.filter((product) => product.price <= 5000),
                  under10k: products.filter(
                    (product) => product.price > 5000 && product.price <= 10000
                  ),
                  under15k: products.filter(
                    (product) => product.price > 10000 && product.price <= 15000
                  ),
                  under20k: products.filter(
                    (product) => product.price > 15000 && product.price <= 20000
                  ),
                  under30k: products.filter(
                    (product) => product.price > 20000 && product.price <= 30000
                  ),
                },
              });
            }
          } else {
            res.status(200).json({ products });
          }
        });
      }
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) {
        res.status(200).json({ product });
      }
    });
  } else {
    return res.status(400).json({ error: "Params required" });
  }
};

// new update
exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) {
        res.status(202).json({ result });
      }
    });
  } else {
    res.status(400).json({ error: "Params required" });
  }
};

exports.getProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
}; */
