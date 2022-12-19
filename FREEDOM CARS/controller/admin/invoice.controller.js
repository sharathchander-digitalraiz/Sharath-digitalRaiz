const fs = require("fs");
const readFile = require("util").promisify(fs.readFile);
const hbs = require("hbs");
const pdf = require("html-pdf");
//const { writeFile } = require("fs");
const Bookings = require("../../model/booking");
const generator = require("generate-serial-number");

exports.invoicePdf = async (req, res) => {
  const booking = await Bookings.findOne({ customerId: req.params.id });
  // exports.print = async (req, res) => {
  const invoiceItems = [
    { item: "Price", amount: booking.price },
    { item: "GST", amount: booking.gst },
    { item: "Transaction Charges", amount: booking.transactionCharges },
    { item: "Coupon", amount: booking.couponCode },
   // { item: "Total", amount: booking.totalprice },
  ];
  const invoiceData = {
    invoice_id: `#FC${generator.generate(8)}`,
    transaction_id: booking.booking_id,
    customer_name: booking.customerName,
    customer_phone: booking.phone,
    customer_email: booking.email,
    from:booking.fromDate,
    to:booking.toDate,
    creation_date: new Date().toISOString().slice(0, 10),
    total_amount: booking.totalprice,
  };

  const content = await readFile("views/invoice.hbs", "utf8");
  const template = hbs.compile(content);
  const html = template({ invoiceItems, invoiceData });

  const options = {
    base: `${req.protocol}://${req.get("host")}`, // http://localhost:5050
    format: "A4",
  };
  // writeFile("./report.pdf", pdf, {}, (err) => {
  //   if (err) {
  //     return console.error("error");
  //   }
  //   console.log("success!");
  // });
  pdf.create(html, options).toBuffer((err, buffer) => {
    if (err) return console.log(err);
    res.attachment("invoice.pdf");
    res.end(buffer);
  });
};

// // const fs  = require("fs");
// // const pdf = require("pdf-creator-node");
// // const path = require("path");
// // const options = require("../../helpers/options");
// // const customers = require("../../model/customer");

// // exports.homeview = (req,res,next)=>{
// //     res.render('home')
// // }

// // exports.generatePdf = async(req, res, next) => {
// // const html = fs.readFileSync(path.join(__dirname, '../../views/template.html'), 'utf-8');
// // const filename = Math.random() + '_doc' + '.pdf';
// // let array = [];

// // customers.forEach(d => {
// //     const prod = {
// //         Name: d.customerName,
// //         Phone: d.phone,
// //         Email: d.email,
// //         // Photo: d.profilePic,
// //         // price: d.price,
// //         // total: d.quantity * d.price,
// //         // imgurl: d.imgurl
// //     }
// //     array.push(prod);
// // });

// // let subtotal = 0;
// // array.forEach(i => {
// //     subtotal += i.total
// // });
// // const obj = {
// //     prodlist: array,
// // }
// // const document = {
// //     html: html,
// //     data: {
// //         products: obj
// //     },
// //     path: './docs/' + filename
// // }
// // pdf.create(document, options)
// //     .then(res => {
// //         console.log(res);
// //     }).catch(error => {
// //         console.log(error);
// //     });
// //     const filepath = 'http://127.0.0.1:5017' + filename;

// //     res.render('download', {
// //         path: filepath
// //     });
// // }
