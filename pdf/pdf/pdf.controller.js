const fs = require('fs');
const readFile = require('util').promisify(fs.readFile);
const hbs = require('hbs');
const pdf = require('html-pdf'); 
const { writeFile } = require("fs");
 
exports.print = async (req, res) => {  
    const invoiceItems = [
        { 'item': 'Price', 'amount': 50.50 },
        { 'item': 'GST', 'amount': 80.50 },
        { 'item': 'Tran', 'amount': 80.50 },
        { 'item': 'Discount', 'amount': 10.50 }
    ]
    const invoiceData = {
        'invoice_id': 123,
        'transaction_id': 1234567,
        'customer_name': 'Ram',
        'creation_date': new Date().toISOString().slice(0,10),
        'total_amount': 141.50
    }

    const content  = await readFile('views/invoice.hbs','utf8');  
    const template = hbs.compile(content);
    const html     = template({ invoiceItems, invoiceData });

    const options = {
        base: `${req.protocol}://${req.get('host')}`, // http://localhost:3000
        format: 'A4'
    }
    writeFile("./report.pdf", pdf, {}, (err) => {
        if (err) {
          return console.error("error");
        }
        console.log("success!");
      });
    pdf.create(html, options).toBuffer((err, buffer) => { 
        if (err) return console.log(err);
        res.attachment('invoice.pdf')
        res.end(buffer);
    });
    
}




// const cust = require("./customer.model");

// app.get("/", async (req, res) => {
//   const passengers = await cust.find({});
//   const filePath = path.join(__dirname, "print.ejs");
//   ejs.renderFile(filePath, { passengers }, (err, html) => {
//     if (err) {
//       res.send("");
//     }
//     res.send(html);
//   });
// });


// const viewOrder = async (req, res) => {
//     const order = await Order.findOne({ _id: req.params.id })
//       .populate({ path: 'user', model: User })
//       .populate({ path: 'shippingAddress', model: Address })
//       .populate({ path: 'billingAddress', model: Address })
//       .exec();
  
//     res.render('invoice', { ordetoJSON() });
//   };