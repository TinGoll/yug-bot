//************************************************************************** */
import { Scenes, Context } from "telegraf";
import { Message } from "telegraf/typings/core/types/typegram";

export interface User {
  id: number;
  chat_id: number;
  userName: string;
  phone: string;
  data: string;
  ts: Date;
}

export interface Document {
  date_violation: string;
  time_violation: string;
  timestamp: Date;
  worker: string;
  reson: string;
  amount: number;
  photos: Photo;
  photoId: number;
  lastMsg: Message.TextMessage | null; 
}

export type Photo = Array<{
  type: "photo";
  media: string;
  path: string;
  fileName: string;
  photoId: number;
  downloadURL: string;
}>;

/**
 * Можно расширить объект сеанса, доступный каждому мастеру.
 * Это можно сделать, расширив `WizardSessionData` и, в свою очередь, передав
 * собственный интерфейс в качестве переменной типа для `WizardContextWizard`.
 */
export interface MyWizardSession extends Scenes.WizardSessionData {
  userData?: User | null;
  currentDocument: Document | null;
}

/**
 * Мы можем определить наш собственный объект контекста.
 * Теперь мы должны установить объект сцены в свойстве `scene`. По мере того, как мы расширяем
 * сеанс сцены, нам нужно передать тип как переменную типа.
 * Мы также должны установить объект мастера в свойстве `wizard`.
 */
export interface MyContext extends Context {
  [x: string]: any;
  ctx: any;
  // будет доступен под `ctx.myContextProp`
  myContextProp: any;
  // объявить тип сцены
  scene: Scenes.SceneContextScene<MyContext, MyWizardSession>;
  // объявить тип мастера
  wizard: Scenes.WizardContextWizard<MyContext>;
}

/************************************************************************************* */
