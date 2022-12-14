const { body, check, param, validationResult } = require("express-validator")

exports.validate = (req, res, next) => {
	
	const result = validationResult(req).array()
	if (!result.length) return next()
	const errorMsg = result[0].msg
	res.status(422).json({ message: errorMsg })
}

exports.isRequestValidated = (req, res, next) => {

    const errors = validationResult(req);
    if(errors.array().length > 0){
        return res.status(400).json({ error: errors.array()[0].msg })
    }
    next();
}

exports.adminAddVendorVal =[
	check("fullName") 
		.exists()
		.withMessage("Store name is required for registration"),
]

exports.vendorRegistrationVal = [
	     check("fullName") 
		.exists()
		.withMessage("Store name is required for registration"),
		check("city")
		.exists()
		.withMessage("City is required for registration"),
		check("locality")
		.exists()
		.withMessage("Locality is required for registration"),
		check("category")
		.exists()
		.withMessage("Category is required for registration"),
		check("address")
		.exists()
		.withMessage("Address is required for registration"),
		check("email")
		.exists()
		.withMessage("Email is required for registration"),
		check("password")
		.exists()
		.withMessage("Password is required for registration"),
		check("confirmpassword")
		.exists()  
		.withMessage("Confirm Password is required for registration"),
] 

exports.vendorloginVal=[
	check("email")
		.exists()
		.withMessage("Email id required for login")
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Invalid Email "),
		check("password")
		.exists()
		.withMessage("Password is required for registration")
]

exports.RegisterPurchaser = [
	check('fullName')
	.trim()
	.notEmpty()
	.withMessage("full name can't be empty")
	.isLength({ min: 5, max: 255 })
	.withMessage("fullName character must be between 5 to 255"), 
	check("email")
		.exists()
		.withMessage("email id required for registration")
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Invalid Email "),
	    check("password")
		.exists()
		.withMessage("password field is requried")
		.trim() 
		.notEmpty()
		.withMessage("password can't be empty")
		.isStrongPassword({ minUppercase: 1, minLowercase: 1, minLength: 6 })
		.withMessage("password is not strong enough protect your password by entering strong password"),

	check("age")
	.exists()
		.withMessage("Age field is requried")
		.isNumeric()
		.withMessage("Age can't be string"),

	check("city")
		.isString()
		.notEmpty()
		.withMessage("city can't be emtpy"),
		check("state")
		.isString()
		.notEmpty()
		.withMessage("state can't be emtpy"),
		check("country")
		.isString()
		.notEmpty()
		.withMessage("country can't be emtpy"), 

	check('phone')
		.isNumeric()
		.withMessage("phone number must be Numberic"),

		check('address')
		.trim()
		.notEmpty()
		.withMessage("Addres can't be empty")
		.isLength({ min: 5, max: 255 })
		.withMessage("Address character must be between 5 to 255"),

]

exports.editPurchaserSchema = [
	check("email")
		.optional(true)
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage("Invalid Email "),

	check('fullName')
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("full name can't be empty")
		.isLength({ min: 5, max: 255 })
		.withMessage("fullName character must be between 5 to 255"),

	check("age")
		.optional(true)
		.isNumeric({ min: 5 })
		.withMessage("Age can't be string and age must be greater than 5"),

	check("city")
		.optional(true)
		.isString()
		.notEmpty()
		.withMessage("city can't be emtpy"),
		
		check("state")
		.optional(true)
		.isString()
		.notEmpty()
		.withMessage("state can't be emtpy"),

		check("country")
		.optional(true)
		.isString()
		.notEmpty()
		.withMessage("country can't be emtpy"),

	check('phone')
		.optional(true)
		.isNumeric()
		.withMessage("phone number must be Numberic"),

]

// exports.passwordSchema = [
// 	check('newPassword')
// 		.exists()
// 		.withMessage("password is required")
// 		.isStrongPassword()
// 		.withMessage("password is not strong enough")
// ]


exports.AddReminderSchema = [
	check('name')
		.exists()
		.withMessage("name is required")
		.notEmpty()
		.withMessage("name can't be empty")
		.isLength({ min: 3 })
		.withMessage("name must be greater than 3 character"),

	check('relationship')
		.exists()
		.withMessage("relationship is required")
		.notEmpty()
		.withMessage("relationship can't be empty"),

	check('occasion')
		.exists()
		.withMessage("occassion is required")
		.notEmpty()
		.withMessage("occassion can't be empty"),

	check('occasionDate')
		.exists()
		.withMessage("occasionDate is required")
		.notEmpty()
		.withMessage("occasionDate can't be empty")
		.isDate()
		.withMessage("occasionDate must be date"),

]

exports.ReminderIdScheam = [
	param('reminderId')
		.exists()
		.withMessage("reminderId is required")
		.trim()
		.isMongoId()
		.withMessage("please provide valid reminderId")
]


exports.EditReminderSchema = [
	check('name')   
		.optional(true) 
		.notEmpty()
		.withMessage("name can't be empty")    
		.isLength({ min: 3 })
		.withMessage("name must be greater than 3 character"),

	check('relationship')
		.optional(true)
		.notEmpty()
		.withMessage("relationship can't be empty"),


	check('occasion')
		.optional(true)
		.notEmpty()
		.withMessage("occassion can't be empty"),

	check('occasionDate')
		.optional(true)
		.notEmpty()
		.withMessage("occasionDate can't be empty")
		.isDate()
		.withMessage("occasionDate must be date"),

]

exports.addCardSchema = [
	check('cardNumber')
		.exists()
		.withMessage("cardNumber is required")
		.isNumeric()
		.withMessage("cardNumber must be Number"),

	check('holderName')
		.exists()
		.withMessage("holderName is required")
		.isString()
		.withMessage("holderName must be String")
		.isLength({ min: 3, max: 255 })
		.withMessage("holderName must be between 3 to 255"),

	check('expireDate')
		.exists()
		.withMessage("expireDate is required")
		.trim()
		.notEmpty()
		.withMessage("expireDate can't' be empty")
		.custom((expireData) => {
			if (/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(expireData)) {
				return true
			} else {
				throw new Error('please enter valid expireDate expire date format is: mm/yy or mm/yyyy or mmyy or mmyyyy')
			}
		}),


	check('cvv')
		.exists()
		.withMessage("cvv is required")
		.trim()
		.notEmpty()
		.withMessage("cvv can't' be empty")
		.custom((cvv) => {
			let curDate = new Date()

			if (/^[0-9]{3,4}$/.test(cvv)) {
				return true
			} else {
				throw new Error('please enter valid cvv only 3 or 4 digits are allowed')
			}
		})






]


exports.editCardSchema = [
	check('cardNumber')
		.optional(true)
		.isNumeric()
		.withMessage("cardNumber must be Number"),

	check('holderName')
		.optional(true)
		.isString()
		.withMessage("holderName must be String")
		.isLength({ min: 3, max: 255 })
		.withMessage("holderName must be between 3 to 255"),

	check('expireDate')
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("expireDate can't' be empty")
		.custom((expireData) => {
			if (/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/.test(expireData)) {
				return true
			} else {
				throw new Error('please enter valid expireDate expire date format is: mm/yy or mm/yyyy or mmyy or mmyyyy')
			}
		}),


	check('cvv')
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("cvv can't' be empty")
		.custom((cvv) => {
			let curDate = new Date()

			if (/^[0-9]{3,4}$/.test(cvv)) {
				return true
			} else {
				throw new Error('please enter valid cvv only 3 or 4 digits are allowed')
			}
		})






]


// --- netbanking --- //
exports.addNetbankingSchema = [

	check('bankName')
		.exists()
		.withMessage("bankName is required")
		.trim()
		.notEmpty()
		.withMessage("bankName can't' be empty"),

	check('accountNumber')
		.exists()
		.withMessage("accountNumber is required")
		.trim()
		.notEmpty()
		.withMessage("accountNumber can't' be empty"),

	check('ifscCode')
		.exists()
		.withMessage("ifscCode is required")
		.trim()
		.notEmpty()
		.withMessage("ifscCode can't' be empty"),

	check('accountHolderName')
		.exists()
		.withMessage("accountHolderName is required")
		.trim()
		.notEmpty()
		.withMessage("ifsaccountHolderNameCode can't' be empty")

]


exports.editNetbankingSchema = [

	check('bankName')
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("bankName can't' be empty"),

	check('accountNumber')
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("accountNumber can't' be empty"),

	check('ifscCode')
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("ifscCode can't' be empty"),

	check('accountHolderName')
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("ifsaccountHolderNameCode can't' be empty")

]

// --- Cart Schema --- //
exports.addCartSchema = [

	check('productId')
		.exists()
		.withMessage("productId is required")
		.trim()
		.notEmpty()
		.withMessage("productId can't' be empty")
		.isMongoId()
		.withMessage("productId is not proper"),


	check('qty')
		.exists()
		.withMessage("qty is required")
		.trim()
		.isInt({ min: 1 })
		.withMessage("qty must be positive integer"),



]

exports.removeCartSchema = [
	param('cartId')
		.exists()
		.withMessage("cartId is required")
		.trim()
		.notEmpty()
		.withMessage("cartId can't' be empty")
		.isMongoId()
		.withMessage("cartId is not proper"),
]

exports.manageCartQty = [
	param('cartId')
		.exists()
		.withMessage("cartId is required")
		.trim()
		.notEmpty()
		.withMessage("cartId can't' be empty")
		.isMongoId()
		.withMessage("cartId is not proper"),

	param('qty')
		.exists().withMessage("qty is required")
		.trim().isInt({ min: 1 }).withMessage("qty must be positive integer"),
]

// --- wishlist --- //
exports.wishListSchema = [
	param("productId")
		.trim().notEmpty().withMessage("productId is required")
		.isMongoId().withMessage("productId is not proper")
]




// category validation
exports.AddCategory = [
	check('categoryName')
		.exists()
		.withMessage("categoryName is required")
		.trim()
		.notEmpty()
		.withMessage("categoryName can't be emtpy")


]

exports.AddSubCategory = [ 
	param('categoryId')
		.exists().withMessage("category Id not provided in params")
		.isMongoId().withMessage("this is not proper category id please provide proper categoryId"),

	check("subCategoryName")
		.exists()
		.withMessage("subcategory Name is required")
		.trim()
		.notEmpty()
		.withMessage("subcategory name can't be empty")
]

exports.AddInputField = [
	param('categoryId')
		.exists()
		.withMessage("category Id not provided in params")
		.isMongoId()
		.withMessage("this is not proper category id please provide proper categoryId"),


	param('subCategoryId')
		.exists()
		.withMessage("subcategory Id not provided in params")
		.isMongoId()
		.withMessage("this is not proper sub category id please provide proper categoryId"),

	check("inputType")
		.trim()
		.exists()
		.withMessage("inputType  is required")
		.notEmpty()
		.withMessage("inputType  can't be empty"),

	check("inputName")
		.exists()
		.withMessage("inputName is required")
		.notEmpty()
		.withMessage("inputName can't be empty")
]

exports.editCategory = [
	param('categoryId')
		.exists()
		.withMessage("category Id not provided in params")
		.isMongoId()
		.withMessage("this is not proper category id please provide proper categoryId"),

	check('categoryName')
		.exists()
		.withMessage("categoryName is required")
		.trim()
		.notEmpty()
		.withMessage("categoryName can't be empty")
]


exports.editSubCategory = [
	param('categoryId')
		.exists()
		.withMessage("category Id not provided in params")
		.isMongoId()
		.withMessage("this is not proper category id please provide proper categoryId"),

	param('subCategoryId')
		.exists()
		.withMessage("subcategory Id not provided in params")
		.isMongoId()
		.withMessage("this is not proper sub category id please provide proper subCategoryId"),

	check('subCategoryName')
		.trim()
		.exists()
		.withMessage("subCategoryName is required")
		.notEmpty()
		.withMessage("subCategoryName can't be empty")

]


exports.editInputField = [
	param('categoryId')
		.exists()
		.withMessage("category Id not provided in params")
		.isMongoId()
		.withMessage("this is not proper category id please provide proper categoryId"),

	param('subCategoryId')
		.exists()
		.withMessage("subcategory Id not provided in params")
		.isMongoId()
		.withMessage("this is not proper sub category id please provide proper subCategoryId"),

	param('inputFieldId')
		.exists()
		.withMessage("inputFieldId not provided in params")
		.isMongoId()
		.withMessage("this is not proper inputFieldId please provide proper inputField"),

	check('inputType')
		.exists()
		.withMessage("subCategoryName is required")
		.notEmpty()
		.withMessage("subCategoryName can't be empty"),

	check('inputName')
		.trim()
		.exists()
		.withMessage("subCategoryName is required")
		.notEmpty()
		.withMessage("subCategoryName can't be empty")

]




// --------------------------- store ----------------------------- //

exports.addStore = [
	check('storeName')
		.exists()
		.withMessage("storeName is required")
		.trim()
		.notEmpty()
		.withMessage("storeName can't be empty"),
		check('mobile')
		.exists()
		.withMessage("Mobile is required"),
	check('storeInfo')
		.isString()
		.withMessage("storeInfo must be string")
		.trim()
		.notEmpty() 
		.withMessage("storeInfo can't be empty"),

	check('storeLogo')
		.isString()
		.withMessage("storeLogo must be string")
		.isURL()
		.withMessage("storeLogo must be image URL"),


		
		
	check("storeCategory")
		.exists()
		.withMessage("storeCategory is required")
		.isMongoId()
		.withMessage("storeCategory is not proper"),
		check("latitude")
		.exists()
		.withMessage("Latitude is required"),

		check("longitude") 
		.exists() 
		.withMessage("Longitude is required"),

	
	check("country")
		.exists()
		.withMessage("country required")
		.trim()
		.notEmpty()
		.withMessage("country can't be empty"),



	check("city")
		.exists()
		.withMessage("city required") 
		.trim()  
		.notEmpty() 
		.withMessage("city can't be empty"),

	check("locality")
		.exists()
		.withMessage("locality required")
		.trim()
		.notEmpty()
		.withMessage("locality can't be empty"),

	check("address")
		.isLength({ min: 3 })
		.withMessage("at least 3 character required"),

		check("email") 
		.exists()
		.withMessage("Email is required"),
		check("gst") 
		.exists()
		.withMessage("Please enter GST number"),
		check("pan") 
		.exists()
		.withMessage("Please enter PAN number"),
		check("managername") 
		.exists()
		.withMessage("Enter manager name"),
		check("manageremail") 
		.exists()
		.withMessage("Enter manager email"),
		check("managermobile") 
		.exists()
		.withMessage("Enter manager mobile "),
]


exports.editStore = [
	check('storeName')
		.exists()
		.withMessage("storeName is required")
		.trim()
		.notEmpty()
		.withMessage("storeName can't be empty"),
		check('mobile')
		.exists()
		.withMessage("Mobile is required"),
	check('storeInfo')
		.isString()
		.withMessage("storeInfo must be string")
		.trim()
		.notEmpty() 
		.withMessage("storeInfo can't be empty"),

	check('storeLogo')
		.isString()
		.withMessage("storeLogo must be string")
		.isURL()
		.withMessage("storeLogo must be image URL"),


		
		
	check("storeCategory")
		.exists()
		.withMessage("storeCategory is required")
		.isMongoId()
		.withMessage("storeCategory is not proper"),
		check("latitude")
		.exists()
		.withMessage("Latitude is required"),

		check("longitude") 
		.exists() 
		.withMessage("Longitude is required"),


	check("country")
		.exists()
		.withMessage("country required")
		.trim()
		.notEmpty()
		.withMessage("country can't be empty"),



	check("city")
		.exists()
		.withMessage("city required")
		.trim()
		.notEmpty()
		.withMessage("city can't be empty"),

	check("locality")
		.exists()
		.withMessage("locality required")
		.trim()
		.notEmpty()
		.withMessage("locality can't be empty"),

	check("address")
		.isLength({ min: 3 })
		.withMessage("at least 3 character required"),

		check("email") 
		.exists()
		.withMessage("Email is required"),
		check("gst") 
		.exists()
		.withMessage("Please enter GST number"),
		check("pan") 
		.exists()
		.withMessage("Please enter PAN number"),
		check("managername") 
		.exists()
		.withMessage("Enter manager name"),
		check("manageremail") 
		.exists()
		.withMessage("Enter manager email"),
		check("managermobile") 
		.exists()
		.withMessage("Enter manager mobile "),

]





// --------------------------- Product ----------------------- //
exports.addProductSchema = [
	check('vendorId')
	.exists()
	.withMessage("Vendor Field is required"),
	check('storeId')
	.exists()
	.withMessage('Store Name is required'),
	check('productId')
	.exists()
	.withMessage('Product Id is required'),

	check('productTitle')
		.exists()
		.withMessage("productTitle Field is required")
		.trim()
		.notEmpty()
		.withMessage("storeName can't be empty"),

	check('productDescription') 
		.trim()
		.notEmpty()
		.withMessage("productDescription can't be empty"),


	check('categoryId')
		.trim()
		.notEmpty()
		.withMessage("categoryId can't be empty")
		.isMongoId()
		.withMessage("please enter proper categoryId"),

	check('subCategoryId')
		.trim()
		.notEmpty()
		.withMessage("subCategoryId can't be empty")
		.isMongoId()
		.withMessage("please enter proper subCategoryId"),

	check('price')
		.exists()
		.withMessage("price is necessary")
		.isNumeric()
		.withMessage("price must be number"),

	check('qty')
		.exists()
		.withMessage("qty is necessary")
		.isInt()
		.withMessage("qty must be integer"),

	check('serviceCharge')
		.isNumeric({ min: 0, max: 100 })
		.withMessage("serviceCharge must be between 0 to 100"),

	check('isProductLaunched')
		.optional(true)
		.isBoolean()
		.withMessage("isProductLaunched must be boolean"),

	check("store.*")
		.isMongoId()
		.withMessage("please provide proper storeId in array"),


	check("tags.*")
		.optional(true)
		.isString()
		.withMessage("please provide tags in strings"),


	check("giftType") 
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("giftType must be string")

]
 

exports.editProductSchema = [
	check('vendorId')
	.exists()
	.withMessage("Vendor Field is required"),
	check('storeId')
	.exists()
	.withMessage('Store Name is required'),
	check('productId')
	.exists()
	.withMessage('Product Id is required'),
	param('productId')
		.isMongoId()
		.withMessage("please provide proper productId in params"),

	check('productTitle')
		.trim()
		.notEmpty()
		.withMessage("storeName can't be empty")
		.optional(true),

	check('productDescription')
		.trim()
		.notEmpty()
		.withMessage("productDescription can't be empty")
		.optional(true),


	check('categoryId')
		.trim()
		.notEmpty()
		.withMessage("categoryId can't be empty")
		.isMongoId()
		.withMessage("please enter proper categoryId")
		.optional(true),

	check('subCategoryId')
		.trim()
		.notEmpty()
		.withMessage("subCategoryId can't be empty")
		.isMongoId()
		.withMessage("please enter proper subCategoryId")
		.optional(true),

	check('price')
		.isNumeric()
		.withMessage("price must be number")
		.optional(true),

	check('qty')
		.isInt()
		.withMessage("qty must be integer")
		.optional(true),

	check('serviceCharge')
		.isNumeric({ min: 0, max: 100 })
		.withMessage("serviceCharge must be between 0 to 100")
		.optional(true),

	check('isProductLaunched')
		.isBoolean()
		.withMessage("isProductLaunched must be boolean")
		.optional(true),

	check("store.*")
		.isMongoId()
		.withMessage("please provide proper storeId in array")
		.optional(true),


	check("tags.*")
		.isString()
		.withMessage("please provide tags in strings")
		.optional(true),


	check("giftType")
		.trim()
		.notEmpty()
		.withMessage("giftType must be string")
		.optional(true)
]

exports.paymentMethodsValidate = [
	check('vendor')
	.exists()
	.withMessage("Vendor Id is required"),
	check('bankname')
	.exists()
	.withMessage("Bank Name is required"),
	check('bankholdername')
	.exists()
	.withMessage("Bank Holder Name is required"),  
	check('bankaccountnumber')
	.exists()
	.withMessage("Bank Account Number is required"),
	check('ifsccode')
	.exists()
	.withMessage("IFSC Code is required"),

]

// -------- Vendor | Auth ---------- //
exports.emailParamsSchema = [
	param("email")
		.isEmail().withMessage("please enter the valid email"),
]

exports.editVendorSchema = [
	check('email')
		.trim()
		.notEmpty()
		.withMessage("email can't be empty")
		.isEmail()
		.withMessage("please provide proper email")
		.optional(true),

	check('phone')
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("phone can't be empty")
		.isNumeric()
		.withMessage("phone must be interger"),

	check('fullName')
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("phone can't be empty")
		.isLength({ min: 3 })
		.withMessage("fullName must be have 3 characater"),

	check('age')
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("phone can't be empty")
		.isLength({ min: 3 })
		.withMessage("fullName must be have 3 characater"),


]


exports.passwordSchema = [

	check("newPassword")
	.exists()
	.withMessage("password field is requried")
	.trim() 
	.notEmpty()
	.withMessage("password can't be empty") 
	.isStrongPassword({ minUppercase: 1, minLowercase: 1, minLength: 6 })
	.withMessage("password is not strong enough protect your password by entering strong password"),
]


// -------- Vendor | OnBoard ---------- //
exports.onBoardEsignature = [
	check("image")
		.trim() 
		.notEmpty()
		.withMessage("eSignature can't be empty")
		.isLength({ min: 3 })
		.withMessage("eSignature must be have 3 characater"),
]

// ----------- offer ----------- //

exports.offerVal = [
	     check("Offername")
		.exists()
		.withMessage("Offer name is required"),
		check("OfferId")
		.exists()
		.withMessage("Offer Id is required"),
		check("StoreId")
		.exists()
		.withMessage("Store Id is required"),
		check("categoryId")
		.exists()
		.withMessage("Category Id is required"),
		check("subcategoryId")
		.exists()
		.withMessage("Sub Category Id is required"),
		check("offerType")
		.exists()
		.withMessage("Offer type is required"),
		check("startDate")
		.exists()
		.withMessage("Start Date is required"),
		check("endDate")
		.exists() 
		.withMessage("End Date is required"),
]


exports.addOffer = [
	check("offerName")
		.trim()
		.notEmpty()
		.withMessage("offerName can't be empty")
		.isLength({ min: 3 })
		.withMessage("offerName must be have 3 characater"),


	check("offerType")
		.trim()
		.notEmpty()
		.withMessage("offerType can't be empty")
		.isLength({ min: 3 })
		.withMessage("offerType must be have 3 characater"),


	check("startDate")
		.trim()
		.notEmpty()
		.withMessage("startDate can't be empty")
		.isDate()
		.withMessage("startDate must be date"),

	check("endDate")
		.trim()
		.notEmpty()
		.withMessage("startDate can't be empty")
		.isDate()
		.withMessage("startDate must be date"),

	check("dealImage")
		.trim()
		.notEmpty()
		.withMessage("dealImage is can't be empty"),

	check("maxUser")
		.exists()
		.withMessage("maxUser is required")
		.isInt()
		.withMessage("maxUser must be interger"),

	check("description")
		.notEmpty()
		.withMessage("can't be empty")
]

exports.marketingVal = [
	check("vendorId")
	.notEmpty()
	.withMessage("Vendor Id is required"),
	check("name")
	.notEmpty()
	.withMessage("Name is required"),
	check("promotionId")
	.notEmpty()
	.withMessage("promotionId is required"),
	check("categoryId")
	.notEmpty()
	.withMessage("categoryId is required"),
	check("subcategoryId")
	.notEmpty()
	.withMessage("subcategoryId is required"),
	check("description")
	.notEmpty()
	.withMessage("description is required"),

]

exports.productlaunchVal = [
	check("vendorId")
	.notEmpty()
	.withMessage("Vendor Id is required"),
	check("productId")
	.notEmpty()
	.withMessage("product Id is required"),
	check("partnerId")
	.notEmpty()
	.withMessage("partner Id is required"),
	check("categoryId")
	.notEmpty()
	.withMessage("category Id is required"),  
	check("subcategoryId")
	.notEmpty()
	.withMessage("subcategory Id is required"),
	check("launchDate")
	.notEmpty() 
	.withMessage("launch Date is required"),
]

exports.pickupVal=[
	check("recipientName")
	.notEmpty() 
	.withMessage("Recipient Name is required"),
	check("mobileNumber")
	.notEmpty() 
	.withMessage("Mobile number is required"),
	check("productId")
	.notEmpty() 
	.withMessage("Product Id is required"),
	check("productName")
	.notEmpty() 
	.withMessage("Product Name is required"),
	check("deliveredTo")
	.notEmpty() 
	.withMessage("Delivered to is required"),
	check("deliveredMobile")
	.notEmpty() 
	.withMessage("Delivered Mobile to is required"), 
	check("status")
	.notEmpty() 
	.withMessage("Status is required"),
	check("updateProductId")
	.notEmpty() 
	.withMessage("updateProduct Id is required"),
	check("orderId")
	.notEmpty() 
	.withMessage("order Id is required"),
	check("exchange")
	.notEmpty() 
	.withMessage("Exchange Field is required"),
	check("comment")
	.notEmpty() 
	.withMessage("Comment Field is required"), 
	check("vendorId")
	.notEmpty() 
	.withMessage("vendorId Field is required"),


]

exports.couponVal =[
	check("couponcode")
	.notEmpty() 
	.withMessage("Coupon Code Field is required"),
	check("purchasername")
	.notEmpty() 
	.withMessage("Purchaser Name Field is required"),
	check("productname")
	.notEmpty() 
	.withMessage("Product Name Field is required"),
	check("productId")
	.notEmpty() 
	.withMessage("Product Id Field is required"),
	check("price")
	.notEmpty() 
	.withMessage("Price Field is required"),
	check("discountpercentage")
	.notEmpty() 
	.withMessage("Discount Percentage Field is required"),
	check("orderid")
	.notEmpty() 
	.withMessage("Order Id Field is required"),  
	check("finalprice")   
	.notEmpty()   
	.withMessage("Final Price Field is required"),     

]

exports.instorepurchase = [ 
	    check("qrnumber")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("QR number is required"),
		check("purchasername")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("Purchaser name is required"),
		check("productname")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("Product name is required"),
		check("productId")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("Product Id is required"),
		check("actualprice")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("Actual price is required"),
		check("discountpercentage")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("Discount % is required"),
		check("orderId")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("Order Id is required"),
		check("finalprice")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("Final price is required"),
		check("vendorId")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("Vendor Id is required"),

]

exports.editOffer = [
	check("offerName")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("offerName can't be empty")
		.isLength({ min: 3 })
		.withMessage("offerName must be have 3 characater"),


	check("offerType")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("offerType can't be empty")
		.isLength({ min: 3 })
		.withMessage("offerType must be have 3 characater"),


	check("startDate")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("startDate can't be empty")
		.isDate()
		.withMessage("startDate must be date"),

	    check("endDate") 
		.optional(true) 
		.trim()
		.notEmpty() 
		.withMessage("startDate can't be empty") 
		.isDate() 
		.withMessage("startDate must be date"),

	check("dealImage")
		.optional(true)
		.trim()
		.notEmpty()
		.withMessage("dealImage is can't be empty"),

	check("maxUser")
		.optional(true)
		.isInt()
		.withMessage("maxUser must be interger"),

	    check("description")
		.optional(true)
		.notEmpty()
		.withMessage("can't be empty")
]

/* Admin */
exports.checkusertype = [
	check('firstName')
    .notEmpty()
    .withMessage('firstName is required'),
	check('lastName')
    .notEmpty()
    .withMessage('lastName is required'),
	check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
	check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long'),
	check('role')
    .notEmpty()
    .withMessage('Role is required'), 
	check('empid')  
    .notEmpty() 
    .withMessage('Empid is required'), 
	check('department') 
    .notEmpty() 
    .withMessage('Department is required'),  
	check('status') 
    .notEmpty() 
    .withMessage('Status is required'),

]

exports.updatecheckusertype = [
	check('firstName')
    .notEmpty()
    .withMessage('firstName is required'),
	check('lastName')
    .notEmpty()
    .withMessage('lastName is required'),
	check('email')
    .isEmail()
    .withMessage('Valid Email is required'),
	check('role')
    .notEmpty()
    .withMessage('Role is required'), 
	check('empid')  
    .notEmpty() 
    .withMessage('Empid is required'), 
	check('department') 
    .notEmpty() 
    .withMessage('Department is required'),  
	check('status') 
    .notEmpty() 
    .withMessage('Status is required'),

]





/* Vendor */










