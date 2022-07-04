import { Composer } from "telegraf";
import { MyContext } from "../../../../@types";
import i18n from "../../../../localization";


const workerPoint = new Composer<MyContext>();

workerPoint.command("start", async (ctx) => {
    ctx.scene.session.currentDocument = null;
    await ctx.reply(i18n.t("ru", "document_canceled_txt"))
    return ctx.scene.enter("main-menu");
});
workerPoint.hears(/\/\w+/, (ctx) => ctx.reply(i18n.t("ru", "value_must_not_be_a_command")));
workerPoint.on("text", async (ctx) => {
    try {
        if (isNaN(ctx.message.text as any)) {
            ctx.scene.session.currentDocument.worker = ctx.message.text;
            await ctx.reply(i18n.t("ru", "scene_add_document_reson_txt"));
            return ctx.wizard.next();
        }else{
            ctx.reply(i18n.t("ru", "scene_add_document_worker_txt_error"));
        }
    } catch (e) {
        console.log(e);
    }
})

workerPoint.use((ctx) =>
    ctx.reply(i18n.t("ru", "scene_add_document_worker_txt_error"))
)


export default workerPoint;