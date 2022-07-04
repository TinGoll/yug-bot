import { Scenes } from "telegraf"
import { general_menu, PLACEHOLDER } from "../../keyboards/menu.keyboards"
import menuComposer from "./composers/menu.composer"


const menuScene = new Scenes.WizardScene(
    'main-menu',
    async (ctx) => {
        await ctx.reply( PLACEHOLDER, general_menu)
        return ctx.wizard.next()
    },
    menuComposer,
    async (ctx) => {
        await ctx.reply("Воспользуйтесь кнопками меню")
        return ctx.scene.reenter();
    }
)

export default menuScene;

