import { Composer } from "telegraf";
import { MyContext } from "../../../../@types";
import i18n from "../../../../localization";


const resonPoint = new Composer<MyContext>();

resonPoint.command("start", async (ctx) => {
    ctx.scene.session.currentDocument = null;
    await ctx.reply(i18n.t("ru", "document_canceled_txt"))
    return ctx.scene.enter("main-menu");
});

resonPoint.hears(/\/\w+/, (ctx) => ctx.reply(i18n.t("ru", "value_must_not_be_a_command")));
resonPoint.on("text", async (ctx) => {
    try {
        if (isNaN(ctx.message.text as any)) {
            ctx.scene.session.currentDocument.reson = ctx.message.text;
            await ctx.replyWithHTML(i18n.t("ru", "scene_add_document_retention_amount_txt"))
            return ctx.wizard.next();
        }else{
            ctx.reply(i18n.t("ru", "scene_add_document_reson_txt_error"));
        }
    } catch (e) {
        console.log(e);
    }
})
resonPoint.use((ctx) =>
    ctx.reply(i18n.t("ru", "scene_add_document_reson_txt_error"))
)


export default resonPoint;