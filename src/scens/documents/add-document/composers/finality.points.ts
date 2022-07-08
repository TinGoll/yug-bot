import { Composer } from "telegraf";
import { Document, MyContext } from "../../../../@types";
import { DocumentModel, ProofModel } from "../../../../data-base/models";
import i18n from "../../../../localization";
import { downloadFile, progressIterator } from "../../../../utils/other";
import { getPdf } from '../../../../pdf/index';

const editMassage = (originalMassage: string, extraText: string,  bar?: () => { value: string, done: boolean } ): string => {
    let barData;
    if (bar && typeof bar === "function") barData = bar();
    const txt = `${originalMassage}\n
    ${extraText}
    ${barData ? "Прогрес: " + (barData.done ? "☑️" : barData.value ): ""}`
    return txt
} 

const finalityPoints = new Composer<MyContext>();

finalityPoints.command("start", async (ctx) => {
    ctx.scene.session.currentDocument = null;
    await ctx.reply(i18n.t("ru", "document_canceled_txt"))
    return ctx.scene.enter("main-menu");
});

finalityPoints.action("document_reenter", async ctx => {
    ctx.reply("Сработала команда: document_reenter")   
})

finalityPoints.action("document_save", async ctx => {
    try {
        const document = (<Document | null> ctx.scene.session.currentDocument);
        if (!document) throw new Error("Сбой создания документа.");
        const msg = document.lastMsg;
        const number_operations = 3;
        const bar = progressIterator(number_operations + ((document?.photos?.length || 0) * 2));

          // Загрузка фотографий на сервер.
        for (const photo of document.photos || []) {
            await ctx.editMessageText(
                editMassage(msg?.text || "", `Загрузка ${photo.fileName}`, bar)
            )
            await downloadFile(photo.downloadURL, photo.path);
            
        }

        await ctx.editMessageText(editMassage(msg?.text || "", `Сохранение документа в базу данных...`, bar))
        const authorId = ctx.session?.userData?.id
        const entry = await DocumentModel.create({
            worker: document.worker ||"Не задано",
            date_violation: document.date_violation,
            reson: document.reson,
            amount: Number(document.amount), 
            time_violation: document.time_violation,
            authorId
        });

        const newId = entry.toJSON().id


        // Запись фотографий в базу данных.
        for (const photo of document.photos || []) {
            await ctx.editMessageText(
                editMassage(msg?.text || "", `Записываем доказательства в базу данных... ${photo.fileName}`, bar)
            )
            await ProofModel.create({ 
                documentId: newId,
                file_id: photo.media,
                fileName: photo.fileName,
                repositoryPath: photo.path,
            })
        }

        await ctx.editMessageText(
            editMassage(msg?.text || "", `Проверяем результат...`, bar)
        )
        const savedData = await DocumentModel.findOne({ where: { id: newId }, include: {
            all: true
        } })

        const doc = savedData?.toJSON()
    
        await ctx.editMessageText(
            editMassage(msg?.text || "", `Загрузка завершена.`, bar)
        );

        const blob = await getPdf(doc!);

        await ctx.telegram.sendDocument(ctx.from!.id, {
            source: blob,
            filename: `Документ_${doc?.id}.pdf`,
        }, {
            caption:`PDF документ от ${doc?.date_violation}`
        })

        return ctx.scene.enter("main-menu");
        
    } catch (e) {
        console.log('\x1b[36m%s\x1b[0m', (e as Error).message);
        await ctx.replyWithHTML(`Ошибка сохранения документа: <code>${(e as Error).message}</code>\nПожалуйста, обратитесь к разработчику.`);
        return ctx.scene.enter("main-menu");
    }
})

finalityPoints.hears(/\/\w+/, (ctx) => ctx.reply(i18n.t("ru", "value_must_not_be_a_command")));

finalityPoints.use((ctx) =>
    ctx.reply(i18n.t("ru", "scene_add_document_final_unknown_value"))
)


export default finalityPoints;