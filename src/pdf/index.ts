import Handlebars from "handlebars";
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from "path";
import { Document, User } from "../@types";
import { DocumentDb } from "../data-base/models";


const  blobToFile = (theBlob: Blob, fileName: string) => {
  try {
      var b: any = theBlob;
      //A Blob() is almost a File() - it just missing the two properties below which we will add
      b.lastModifiedDate = new Date();
      b.name = fileName;
      //Cast to a File() type
      return theBlob;
  } catch (e) {
    throw e;
  }
}

async function printPDF2(html: string, templateName: string) {
   try {
       const browser = await puppeteer.launch();     // запускаем браузер
       const page = await browser.newPage();         // создаем новую вкладку
       await page.goto(html, { waitUntil: 'networkidle0' });
       // const pdf = await page.pdf({ format: "A4", path: path.resolve(__dirname, templateName) }); // с сохранением файла.
       const pdf = await page.pdf({ format: "A4"}); 
       await browser.close();
       return pdf
   } catch (e) {
    throw e;
   }
}

/**
 * Создание PDF
 * @param document 
 * @returns 
 */
export const getPdf = async (document: DocumentDb) => {
    try {
        const fileContent = fs.readFileSync(path.resolve(__dirname, "tempalte.hbs"), 'utf8');

        const template = Handlebars.compile(fileContent);
        const  { id, date_violation, time_violation, worker, reson, amount, status, isPaid, proofs } = document;
        const data = {
            id,
            date_violation,
            time_violation, 
            worker, 
            reson, 
            amount: amount.toFixed(2),
            photos: proofs,
        }

        const html = template(data);
        const templateName = `template_${Date.now().toString(16)}`;

        fs.writeFileSync(path.resolve(__dirname, templateName + '.html'), html);
        const pdfBlob = await printPDF2(path.resolve(__dirname, templateName + '.html'), templateName + '.pdf');
        fs.unlink(path.resolve(__dirname, templateName + '.html'), function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Файл удалён");
            }
        });
        return pdfBlob;
    } catch (e) {
        throw e;
    }
}