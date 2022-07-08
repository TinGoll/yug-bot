import { Composer } from "telegraf";
import fs from 'fs';
import request from 'request';
import path from 'path';
import { Document, MyContext } from "../../../../@types";
import i18n from "../../../../localization";
import { token } from "../../../../token";
import { document_final_keyboard, test_inline } from "../../../../keyboards/other.keyboards";


const proofsPoint = new Composer<MyContext>(); // Создаем новый композитор

// Если нажали start переходим в главное меню.
proofsPoint.command("start", async (ctx) => {
    ctx.scene.session.currentDocument = null;
    await ctx.reply(i18n.t("ru", "document_canceled_txt"))
    return ctx.scene.enter("main-menu");
});


// Если нажали команду next, переходим в следующую сцену.
proofsPoint.command("next", async (ctx) => {
    const document = <Document>ctx.scene.session.currentDocument;
    if (document.photos.length > 3) {
        return ctx.replyWithHTML(`<u>Максимальное количество фотографий - 3.</u>\nУдалите лишние ${document.photos.length  - 3}`)
    }
    
    const caption = i18n.t("ru", "scene_add_document_final", {
        date: `${document.date_violation}, ${document.time_violation}`,
        worker: document.worker,
        reson: document.reson,
        amount: Number(document.amount).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }),
        files: document.photos.map( p => `📎 <code>${p.fileName}</code>`).join("\n")
    })
    // Формируем массив фото, для отправки в медиагруп.
    const photos = document.photos.map((photo, index, arr) => {
        const media: { type: "photo", media: string, caption?: string } = {
            type: photo.type,
            media: photo.media,
        }
        if (index === 0) media.caption = `Прикрепленные файлы: ${arr.length} шт.`;
        return media
    });
    // Отправка фоток
    await ctx.replyWithMediaGroup(photos);
    // Отправка данных документа.
    const msg = await ctx.replyWithHTML(caption, document_final_keyboard);
    
    (<Document>ctx.scene.session.currentDocument).lastMsg = msg;
    return ctx.wizard.next();
});
//********************************************************************* */

proofsPoint.hears(/\/del/, (ctx) => {
    const id = Number(ctx.message.text.slice(4));
    (<Document>ctx.scene.session.currentDocument).photos = (<Document>ctx.scene.session.currentDocument).photos.filter(p => p.photoId !== id);
    const photos = (<Document>ctx.scene.session.currentDocument).photos;
    const files = photos.length
        ? `Файлы:\n\n${photos.map((p, index) => `📎 <code>${p.fileName}</code> [/del${p.photoId}]`).join(`\n`)}`
        : 'Файлов нет.';

    ctx.replyWithHTML(i18n.t("ru", "scene_add_document_proofs_delete_txt", {
        files
    }));
});

// Любые другие команды - отсекаем.
proofsPoint.hears(/\/\w+/, (ctx) => ctx.reply(i18n.t("ru", "value_must_not_be_a_command")));

// Если отправили фото.
proofsPoint.on("photo", async (ctx) => {

    const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id
    const immage = await ctx.telegram.getFile(file_id);
    const filePath = immage.file_path;
    const fileName = `photo_${Date.now().toString(16)}.jpg`
    const downloadURL = `https://api.telegram.org/file/bot${token}/${filePath}`;

    const repositoryPath = path.resolve(__dirname, "..", "..", "..", "..", "files", "photo", fileName);

    const photoId = (<Document>ctx.scene.session.currentDocument).photoId;
    (<Document>ctx.scene.session.currentDocument).photoId++;
    (<Document>ctx.scene.session.currentDocument).photos.push({
        type: "photo",
        downloadURL,
        fileName,
        media: file_id,
        path: repositoryPath,
        photoId
    })

    let notify: string = '';
    if ((<Document>ctx.scene.session.currentDocument).photos.length > 3) {
        notify = i18n.t("ru", "maximum_number_of_files_exceeded");
    }
    const files = `${(<Document>ctx.scene.session.currentDocument).photos.map((p, index) => `📎 <code>${p.fileName}</code> [/del${p.photoId}]`).join(`\n`)}`

    ctx.replyWithHTML(i18n.t("ru", "scene_add_document_proofs_add_txt", { notify, files }));
})

proofsPoint.use((ctx) =>
    ctx.reply(i18n.t("ru", "scene_add_document_proofs_txt"))
)

export default proofsPoint;
