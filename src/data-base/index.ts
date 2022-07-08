import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('bot-db', 'user', 'pass', {
    dialect: "sqlite",
    host: "./bot.sqlite",
    define: {
        timestamps: false
    },
    logging: false
});

export default sequelize;