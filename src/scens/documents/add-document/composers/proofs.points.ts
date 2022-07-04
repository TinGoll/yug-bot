import { Composer } from "telegraf";
import fs from 'fs';
import request from 'request';
import path from 'path';
import { Document, MyContext } from "../../../../@types";
import i18n from "../../../../localization";
import { token } from "../../../../token";
import { document_final_keyboard, test_inline } from "../../../../keyboards/other.keyboards";


const download = (url: string, path: string, callback: () => void) => {
    request.head(url, (err, res, body) => {
        request(url)
            .pipe(fs.createWriteStream(path))
            .on('close', callback);
    });
};

const proofsPoint = new Composer<MyContext>();

proofsPoint.command("start", async (ctx) => {
    ctx.scene.session.currentDocument = null;
    await ctx.reply(i18n.t("ru", "document_canceled_txt"))
    return ctx.scene.enter("main-menu");
});


proofsPoint.command("next", async (ctx) => {
    const document = <Document> ctx.scene.session.currentDocument;

    const caption = i18n.t("ru", "scene_add_document_final", {
        date: document.timestamp?.toLocaleString(),
        worker: document.worker,
        reson: document.reson,
        amount: Number(document.amount).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }),
        files: "Файл 1, файл2"
    })

    const photos = document.photos.map((photo, index, arr) => {
        const media: { type: "photo", media: string, caption?: string} = {
            type: photo.type,
            media: photo.media,
        }
        if (index === 0) media.caption = `Прикрепленные файлы: ${arr.length} шт.`;
        return media
    });

    await ctx.replyWithMediaGroup(photos);
    await ctx.replyWithHTML(caption, document_final_keyboard)
    return ctx.wizard.next();
})

proofsPoint.hears(/\/del/, (ctx) => {
    const id = Number(ctx.message.text.slice(4));
    (<Document>ctx.scene.session.currentDocument).photos = (<Document>ctx.scene.session.currentDocument).photos.filter(p => p.photoId !== id);

    const photos = (<Document>ctx.scene.session.currentDocument).photos;

    const files = photos.length 
        ? `Файлы:\n\n${photos.map((p, index) => `📎 <code>${p.fileName}</code> [/del${p.photoId}]`).join(`\n`)}`
        : 'Файлов нет.'

    ctx.replyWithHTML(i18n.t("ru", "scene_add_document_proofs_delete_txt", {
        files
    }));
})

proofsPoint.hears(/\/\w+/, (ctx) => ctx.reply(i18n.t("ru", "value_must_not_be_a_command")));

proofsPoint.on("photo", async (ctx) => {

    const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id
    const immage = await ctx.telegram.getFile(file_id);
    const filePath = immage.file_path;
    const fileName = `photo_${Date.now().toString(16)}.jpg`
    const downloadURL = `https://api.telegram.org/file/bot${token}/${filePath}`;
    
    const repositoryPath = path.resolve("src", "files", "photo", fileName);

    download(downloadURL, repositoryPath, () => {
        const photoId = (<Document>ctx.scene.session.currentDocument).photoId;
        (<Document>ctx.scene.session.currentDocument).photoId++;
        (<Document>ctx.scene.session.currentDocument).photos.push({ type: "photo", path: repositoryPath, media: file_id, fileName, photoId });

        ctx.replyWithHTML(i18n.t("ru", "scene_add_document_proofs_add_txt", {
            files: `${(<Document>ctx.scene.session.currentDocument).photos.map((p, index) => `📎 <code>${p.fileName}</code> [/del${photoId}]`).join(`\n`)}`
        }));
        //return ctx.wizard.next(); 
    });

    // console.log("Перешел");

    // const filePath = path.join(path.resolve(), "src", "templates", `test.pdf`);
    // console.log(filePath);

    // const dt = await  ctx.replyWithDocument({ source: filePath }, test_inline)

    // console.log(dt);
    
    //return await ctx.scene.leave()
})

proofsPoint.use((ctx) =>
    ctx.reply(i18n.t("ru", "scene_add_document_proofs_txt"))
)


export default proofsPoint;




    
// fs.readFile(filePath, { encoding: 'utf-8' }, function (err, data) {
//     console.log(data);
//     // ctx.telegram.sendDocument(ctx.message!.from.id, {
//     //     source: data,
//     //     filename: 'test1.txt',
//     // }).catch(function (error) { console.log(error); })
// })

// const fs = require('fs');
// const request = require('request');
// require('dotenv').config();
// const path = require('path');
// const fetch = require('node-fetch');

// // this is used to download the file from the link
// const download = (url, path, callback) => {
//     request.head(url, (err, res, body) => {
//         request(url).pipe(fs.createWriteStream(path)).on('close', callback);
//     });
// };
// // handling incoming photo or any other file
// bot.on('photo', async (doc) => {

//     // there's other ways to get the file_id we just need it to get the download link
//     const fileId = doc.update.message.photo[0].file_id;

//     // an api request to get the "file directory" (file path)
//     const res = await fetch(
//         `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${fileId}`
//     );
//     // extract the file path
//     const res2 = await res.json();
//     const filePath = res2.result.file_path;

//     // now that we've "file path" we can generate the download link
//     const downloadURL =
//         `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${filePath}`;

//     // download the file (in this case it's an image)
//     download(downloadURL, path.join(__dirname, `${fileId}.jpg`), () =>
//         console.log('Done!')
//     );
// }); 