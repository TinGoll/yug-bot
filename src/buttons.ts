import { Markup } from "telegraf";

export const ADD_DENAULT = 'Написать донос';
export const MY_DENUSIONS = 'Мои доносы';
export const ALL_DENUSIONS = 'Все доносы';

// КНОПКИ
export const menu_keyboard = Markup.keyboard([
    ADD_DENAULT,
    MY_DENUSIONS,
    ALL_DENUSIONS,
]).resize(true).placeholder("Главное меню");
export const remove_keyboard = Markup.removeKeyboard();
export const phone_register = Markup.keyboard([
    Markup.button.contactRequest('Зарегистрировать по номеру', false)
]).resize(true);