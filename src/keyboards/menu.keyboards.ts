import { Markup } from "telegraf";
import i18n from "../localization";

export const MENU_BUTTON_ADD_DENAULT = i18n.t("ru", "menu_button_add_document");
export const MENU_BUTTON_MY_DENUSIONS = i18n.t(
  "ru",
  "menu_button_my_documents"
);
export const MENU_BUTTON_ALL_DENUSIONS = i18n.t(
  "ru",
  "menu_button_all_documents"
);
export const MENU_BUTTON_MY_PROFILE = i18n.t("ru", "menu_button_profile");

export const PLACEHOLDER = i18n.t("ru", "menu_txt");

// КНОПКИ
export const general_menu = Markup.keyboard([
  [
    MENU_BUTTON_ADD_DENAULT,
    MENU_BUTTON_MY_DENUSIONS,
    MENU_BUTTON_ALL_DENUSIONS,
  ],
])
  .resize(true)
  .oneTime(false)
  .placeholder(PLACEHOLDER)
  .selective(false);
