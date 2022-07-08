import { DataTypes, ModelDefined, Optional } from 'sequelize';
import sequelize from '.';

interface UserAttributes {
    id: number;
    chat_id: number;
    userName: string;
    phone: string;
    data: string;
    ts: Date;
}

interface DocumentAttributes {
    id: number;
    timestamp: Date;
    date_violation: string;
    time_violation: string;
    worker: string;
    reson: string;
    amount: number;
    status: string;
    isPaid: boolean;
    rules: string;
    authorId: number;
    author: UserAttributes;
    proofs: ProofAttributes[]
}

interface ProofAttributes {
    id: number;
    file_id: string;
    fileName: string;
    repositoryPath: string;
    documentId: number;
}

export interface DocumentDb extends Required<DocumentAttributes> {}

type ProofCreationAttributes = Optional<ProofAttributes, 'id'>;
type UserCreationAttributes = Optional<UserAttributes, 'id' | "ts">;
type DocumentCreationAttributes = Optional<DocumentAttributes, 'id' | 'status' | 'isPaid' | 'rules' | 'timestamp' | "author" | "proofs">;

export const UserModel: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define("user", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chat_id: { type: DataTypes.INTEGER, allowNull: false},
    userName: { type: DataTypes.STRING(256) },
    phone: { type: DataTypes.STRING(512) },
    data: { type: DataTypes.JSON, defaultValue: "{}"},
    ts: { type: DataTypes.DATE, defaultValue: new Date()},
}, {
    tableName: 'users',
});

export const DocumentModel: ModelDefined<DocumentAttributes, DocumentCreationAttributes> = sequelize.define("document", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    timestamp: { type: DataTypes.DATE, defaultValue: new Date() }, 
    date_violation: { type: DataTypes.STRING },
    time_violation: { type: DataTypes.STRING },
    worker: { type: DataTypes.STRING },
    reson: { type: DataTypes.STRING(512) },
    amount: { type: DataTypes.DOUBLE(10, 2) },
    status: { type: DataTypes.STRING, defaultValue: "" },
    isPaid: {type: DataTypes.BOOLEAN, defaultValue: false},
    rules: { type: DataTypes.JSON, defaultValue: "{}" }
}, {
    tableName: 'documents'
});

export const ProofModel: ModelDefined<ProofAttributes, ProofCreationAttributes>  = sequelize.define("proof", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    file_id: { type: DataTypes.STRING(256) },
    fileName: { type: DataTypes.STRING(512) },
    repositoryPath: { type: DataTypes.STRING(512) },
}, {
    tableName: 'proofs',
});

UserModel.hasMany(DocumentModel, {
    sourceKey: 'id',
    foreignKey: 'authorId',
    as: 'documents'
});

DocumentModel.belongsTo(UserModel, {
    as: "author"
});

DocumentModel.hasMany(ProofModel, {
    sourceKey: 'id',
    foreignKey: 'documentId',
    as: 'proofs'
});

ProofModel.belongsTo(DocumentModel);

export const models = {
    DocumentModel, ProofModel
}






// import { Model, DataTypes } from "sequelize/types";
// import sequelize from ".";


// export class DocumentModel extends Model {
//     declare id: number; 
//     declare date_violation: string;
//     declare time_violation: string;
//     declare worker: string;
//     declare reson: string;
//     declare amount: number;
// }

// DocumentModel.init({
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     date_violation: {
//         type: DataTypes.STRING,
//     },
//     time_violation: {
//         type: DataTypes.STRING,
//     },
//     worker: {
//         type: DataTypes.STRING,
//     },
//     reson: {
//         type: DataTypes.TEXT,
//     },
//     amount: {
//         type: DataTypes.DOUBLE(10, 2)
//     }
// }, { sequelize });

// //*********************************************************** */

// export class ProofModel extends Model {
//     declare id: number;
//     declare file_id: string;
//     declare filePath: string;
//     declare repositoryPath: string;
// }

// ProofModel.init({
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     file_id: {
//         type: DataTypes.STRING,
//     },
//     filePath: {
//         type: DataTypes.STRING,
//     },
//     repositoryPath: {
//         type: DataTypes.STRING,
//     },
    
// }, { sequelize });


// export const models = {
//     DocumentModel, ProofModel
// }


