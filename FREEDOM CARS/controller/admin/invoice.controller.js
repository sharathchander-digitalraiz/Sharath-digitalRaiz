const fs = require("fs-extra");
// const readFile = require("util").promisify(fs.readFile);
const hbs = require("hbs");
const pdf = require("html-pdf");
const path = require('path');
//const { writeFile } = require("fs");
const Bookings = require("../../model/booking");
const Payment = require("../../model/payment");
const generator = require("generate-serial-number");
const puppeteer = require("puppeteer");

exports.invoicePdf = async (req, res) => {
  try {
    const Booking_id = req.params.id;
    const booking = await Bookings.findOne(
      { _id: Booking_id }
      // {  booking_id: 1 ,customerName:1, phone:1, email:1, fromDate:1, toDate:1 }
    );
    const payment = await Payment.findOne({ bookingId: Booking_id });
    // exports.print = async (req, res) => {
    // const invoiceItems = [
//       { item: "Price", amount:  45000 },
//       { it      { item: "GST", amount:  0 },
// em: "Transaction Charges", amount: 0 },
//       { item: "Discount", amount:  0 },
//       //{ item: "Total", amount: payment.totalprice },
//     ];
    const invoiceData = { 
      invoice_id: `#FC${generator.generate(8)}`,
      booking_id: 21212, //booking.booking_id,
      payment_mode: "cash", //payment.paymethod,
      customer_name:  "sai",
      customer_phone:  51514651,
      customer_email:  "sai@gmail.com",
      from:  "22-2-2022",
      to:  "24-2-2022",
      creation_date: new Date().toISOString().slice(0, 10),
      total_amount:  4500,
    };
    console.log(invoiceData)
    const compile = async function (template_Name, data) {
      const filePath = path.join(
        process.cwd(),
        "views",
        `${template_Name}.hbs`
      );
      const html = await fs.readFile(filePath, "utf8");
      return hbs.compile(html)(data);
    };
    //const content = await readFile("views/invoice.hbs", "utf8");
    //const template = hbs.compile(content);
    //const html = template({ invoiceItems,invoiceData });

    (async function(){ 
      try{
          const browser = await puppeteer.launch();
          const page = await browser.newPage();
          const content = await compile('invoice',{invoiceData}); //await page.setContent('<h1>hello you are seeing created pdf</h1>')
          await page.setContent(content);
          //create a pdf page
          await page.pdf({
              path: `invoice${generator.generate(8)}.pdf`,
              format: 'A4',
              printBackground: true
          })
          console.log('page created successfully');
          await browser.close();
          process.exit();
      }
      catch(error){
              console.log(error);
      }
  })()
    
    // const content = await compile("index", data); //await page.setContent('<h1>hello you are seeing created pdf</h1>')
    // await page.setContent(content);
    // writeFile("./report.pdf", pdf, {}, (err) => {
    //   if (err) {
    //     return console.error("error");
    //   }
    //   console.log("success!");
    // });
    // pdf.create(html, options).toBuffer((err, buffer) => {
    //   if (err) return console.log(err);
    //   res.attachment("invoice.pdf");
    //   res.end(buffer);
    // //   res.attachment("invoice.pdf");
    //   res.end(buffer);
    // });
  } catch (err) {
    res
      .status(400)
      .json({ success: true, message: "Something went wrong..!", error: err });
  }
}
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
