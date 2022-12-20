const puppeteer = require('puppeteer');
const hbs = require('hbs');
const fs = require('fs-extra'); 
const path = require('path');
const data = require('./data.json');
const generate = require('generate-serial-number')

// compile hbs template into pdf file
// process.cwd() = current working directry
const compile = async function(template_Name,data){
    const filePath = path.join(process.cwd(),'template',`${template_Name}.hbs`);
    const html = await fs.readFile(filePath, 'utf8');
    return hbs.compile(html)(data);
};

(async function(){ 
    try{
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        //set the content of the page
        const content = await compile('index',data); //await page.setContent('<h1>hello you are seeing created pdf</h1>')
        await page.setContent(content);

        //create a pdf page
        await page.pdf({
            path: `invoice${generate.generate(8)}.pdf`,
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