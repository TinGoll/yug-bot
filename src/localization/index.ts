import path from 'path';
import TelegrafI18n from 'telegraf-i18n';

const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    allowMissing: false,
    directory: path.resolve(__dirname, 'locales')
})

export default i18n;