import { Markup } from "telegraf";

// Удаление кнопок.
export const remove_keyboard = Markup.removeKeyboard();

export const test_inline = Markup.inlineKeyboard([
    Markup.button.url('❤️', 'http://telegraf.js.org'),
    Markup.button.callback('➡️ Next', 'next'),
])

export const document_final_keyboard = Markup.inlineKeyboard([
    Markup.button.callback('⚙️ Редактировать', 'document_reenter'),
    Markup.button.callback('🔖 Сохранить', 'document_save'),
])

// Кнопка для регистрации.
export const phone_register = Markup.keyboard([
    Markup.button.contactRequest('Зарегистрировать по номеру', false)
]).resize(true);