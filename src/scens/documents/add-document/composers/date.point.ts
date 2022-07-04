import { Composer } from "telegraf";
import { MyContext } from "../../../../@types";
import i18n from "../../../../localization";
import fs from 'fs';


const datePoint = new Composer<MyContext>();

datePoint.command("start", async (ctx) => {
    ctx.scene.session.currentDocument = null;
    await ctx.reply(i18n.t("ru", "document_canceled_txt"))
    return ctx.scene.enter("main-menu");
});

datePoint.command('current_time', async (ctx) => {
    if (ctx.scene.session.currentDocument) {
        ctx.scene.session.currentDocument.timestamp = new Date();
    }
    await ctx.reply(i18n.t("ru", "scene_add_document_worker_txt"));
    return ctx.wizard.next()
})

datePoint.on("text", async (ctx) => {
    try {
        if (ctx.message.text && !isNaN(Date.parse(ctx.message.text))) {
            ctx.scene.session.currentDocument.timestamp = Date.parse(ctx.message.text);
            await ctx.reply(i18n.t("ru", "scene_add_document_worker_txt"));
            return ctx.wizard.next()
        }else {
            ctx.reply(`Введи дату в формате ${new Date().toLocaleString()}` )
        }
    } catch (e) {
        console.log(e);
    }
})

datePoint.use((ctx) =>
    ctx.reply(i18n.t("ru", "scene_add_document_date_txt"))
)

export default datePoint;

