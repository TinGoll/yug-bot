import { Composer } from "telegraf";
import { Document, MyContext } from "../../../../@types";
import i18n from "../../../../localization";
import fs from 'fs';
import { dateParser } from "../../../../utils/other";



const datePoint = new Composer<MyContext>();

datePoint.command("start", async (ctx) => {
    ctx.scene.session.currentDocument = null;
    await ctx.reply(i18n.t("ru", "document_canceled_txt"))
    return ctx.scene.enter("main-menu");
});

datePoint.command('current_time', async (ctx) => {
    if (ctx.scene.session.currentDocument) {
        const date = new Date();
        (<Document>ctx.scene.session.currentDocument).timestamp = date;
        (<Document>ctx.scene.session.currentDocument).date_violation = date.toLocaleDateString();
        (<Document>ctx.scene.session.currentDocument).time_violation = date.toLocaleTimeString();
    }
    await ctx.reply(i18n.t("ru", "scene_add_document_worker_txt"));
    return ctx.wizard.next()
})

datePoint.on("text", async (ctx) => {
    try {
        console.log(ctx.message);
        
        if (ctx.message.text) {
            const processedDate = dateParser(ctx.message.text);
            if (processedDate.valid) {
                // Если все верно - переход на следующий вопрос.
                ctx.scene.session.currentDocument.timestamp = new Date();
                (<Document>ctx.scene.session.currentDocument).date_violation = processedDate.date;
                (<Document>ctx.scene.session.currentDocument).time_violation = processedDate.time;

                await ctx.reply(i18n.t("ru", "scene_add_document_worker_txt"));
                return ctx.wizard.next()
            }else{
                if (processedDate.reson === "Invalid Date") {
                    return ctx.reply(`Введи дату в формате "${new Date().toLocaleString()}"`)
                }
                if (processedDate.reson === "Too Late") {
                    return ctx.reply(`Указанная дата уже просрочена.`)
                }
                if (processedDate.reson === "Time has not yet come") {
                    return ctx.reply(`Указанная дата еще не наступила.`)
                }
                if (processedDate.reson === "No time specified") {
                    return ctx.reply(`Кроме даты, необходимо указать и время. Введи дату в формате "${new Date().toLocaleString()}"`)
                }
                return ctx.reply(`Введи дату в формате "${new Date().toLocaleString()}"`);
            }
        }else {
            await ctx.reply(`Введи дату в формате "${new Date().toLocaleString()} 10:00"`)
        }
    } catch (e) {
        console.log(e);
    }
})

datePoint.use((ctx) =>
    ctx.reply(i18n.t("ru", "scene_add_document_date_txt"))
)

export default datePoint;
