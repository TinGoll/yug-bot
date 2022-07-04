import { Scenes } from "telegraf"
import { remove_keyboard } from "../../../buttons"
import fs from 'fs';
import { general_menu } from "../../../keyboards/menu.keyboards"
import i18n from "../../../localization"
import datePoint from "./composers/date.point"
import proofsPoint from "./composers/proofs.points"
import resonPoint from "./composers/reson.point"
import workerPoint from "./composers/worker.point"
import path from "path";
import amountPoint from "./composers/amount.point";


const addDocumentScene = new Scenes.WizardScene(
    'add-document',
    async (ctx) => {
        if (!ctx.scene.session.currentDocument) {
            // Инициализируем новый документ.
            ctx.scene.session.currentDocument = {
                timestamp: new Date(),
                worker: "",
                reson: "",
                amount: 0,
                photos: [],
                photoId: 1
            }
        }
        await ctx.reply(i18n.t("ru", "scene_add_document_date_txt"), remove_keyboard);
        return ctx.wizard.next()
    },
    datePoint,
    workerPoint,
    resonPoint,
    amountPoint,
    proofsPoint,
    async (ctx) => {

        return await ctx.scene.leave()
    }
)

export default addDocumentScene;
