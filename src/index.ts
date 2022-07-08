/* eslint-disable @typescript-eslint/no-floating-promises */
import path from 'path';
import { Scenes, session, Telegraf } from 'telegraf';
import { MyContext, User } from './@types';
import { phone_register } from './buttons';

import sequelize from './data-base';
import { UserModel } from './data-base/models';


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

bot.use((ctx, next) => {
    if (!ctx.session) ctx.session = {
        userData: null
    }
    return next();
});

bot.on("contact", async (ctx, next) => {
    try {
        if (!ctx.session.userData) {
            const chat_id = ctx.message.chat.id;
            const candidate = await UserModel.findOne({ where: { chat_id } });
            if (candidate) {
                const userData = candidate.toJSON();
                ctx.session.userData = {
                    ...userData
                }
                return next();
            }else{
                const additionally = {
                    roles: ["USER"],
                }
                if (
                    ctx.message.contact.phone_number === "79884770946" || 
                    ctx.message.contact.phone_number === "79627676777"
                    ) {
                        additionally.roles = [...additionally.roles, 'ADMIN']
                    }

                const newUserDb = await UserModel.create({
                    chat_id,
                    userName: ctx.message.from.first_name,
                    data: JSON.stringify(additionally),
                    phone: String(ctx.message.contact.phone_number).replace(/[+]/g, "")
                });
                const newUser = newUserDb.toJSON();
                ctx.session.userData = {
                    ...newUser
                }
                await ctx.replyWithHTML(i18n.t("ru", "successful_registration", {
                    firstName: newUser.userName || "Пользователь"
                }))

                console.log("Зарегистрировался", newUser);
                return next();
            }
        }else{
            return next()
        }
    } catch (e) {
        await ctx.replyWithHTML(`Ошибка получения номера: <code>${(e as Error).message}</code>\nПожалуйста, обратитесь к разработчику.`);
    }
})

bot.use(async (ctx, next) => {
    if (!ctx.session.userData) {
        const chat_id = ctx.from?.id || ctx.chat?.id
        const userDb = await UserModel.findOne({
            where: {chat_id}
        });
        if (!userDb) {
            await ctx.replyWithHTML(i18n.t("ru", "register_first_text", {
                firstName: ctx.message?.from.first_name || "Пользователь"
            }), phone_register)
        }else{
            const user = userDb.toJSON();
            ctx.session.userData = { ...user };
            console.log("достали из БД", user);
            
            return next();
        }
    }else{
        return next();
    }
})


bot.use(stage.middleware())

/********************************************************************** */
bot.command("start", ctx => ctx.scene.enter("main-menu"));
/********************************************************************** */

bot.launch().then(() => {
    console.log('\x1b[34m%s\x1b[0m', "The bot was launched successfully");
    sequelize.sync({ /* force: true */ })
    sequelize.authenticate().then(() => {
        console.log('\x1b[32m%s\x1b[0m', "Database connection established");
    });
})

process.once('SIGINT', () => {
    bot.stop('SIGINT');
    sequelize.close();
})
process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    sequelize.close();
})