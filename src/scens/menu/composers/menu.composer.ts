import { Composer } from "telegraf";
import { MyContext } from "../../../@types";
import {
  MENU_BUTTON_ADD_DENAULT,
  MENU_BUTTON_ALL_DENUSIONS,
  MENU_BUTTON_MY_DENUSIONS,
  MENU_BUTTON_MY_PROFILE,
} from "../../../keyboards/menu.keyboards";

const menuComposer = new Composer<MyContext>();

menuComposer.hears(MENU_BUTTON_ADD_DENAULT, async (ctx) => {
    return ctx.scene.enter("add-document"); 
});

menuComposer.hears(MENU_BUTTON_MY_DENUSIONS, async (ctx) => {
    ctx.reply(MENU_BUTTON_MY_DENUSIONS)
});

menuComposer.hears(MENU_BUTTON_ALL_DENUSIONS, async (ctx) => {
    ctx.reply(MENU_BUTTON_ALL_DENUSIONS)
});

menuComposer.hears(MENU_BUTTON_MY_PROFILE, async (ctx) => {
    ctx.reply(MENU_BUTTON_MY_PROFILE)
});

// Переход в главное меню.
menuComposer.command('start', ctx => ctx.scene.enter("main-menu"));

menuComposer.use((ctx) =>
  ctx.replyWithMarkdown(
    "Пожалуйста, воспользуйтесь кнопками."
  )
);

export default menuComposer;
