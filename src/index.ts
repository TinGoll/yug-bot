/* eslint-disable @typescript-eslint/no-floating-promises */
import path from 'path';
import { Scenes, session, Telegraf } from 'telegraf';
import { MyContext } from './@types';
import i18n from './localization';
import addDocumentScene from './scens/documents/add-document/add-document.scene';

import menuScene from './scens/menu/menu.scene';
import { token } from './token';

const bot = new Telegraf<MyContext>(token);

const stage = new Scenes.Stage<MyContext>([menuScene, addDocumentScene], {
    default: "main-menu"
})

bot.use(session()) // Создаем сесии
bot.use(i18n.middleware()); // Устанавливаем промежуточное по локализации.
bot.use(stage.middleware())

/********************************************************************** */
bot.command("start", ctx => ctx.scene.enter("main-menu"));
/********************************************************************** */

bot.launch().then(() => console.log("Запуск"))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))