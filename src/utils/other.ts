import fs from "fs";
import request from "request";
import i18n from "../localization";

export const downloadFile = (url: string, path: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        try {
            request.head(url, (err, res, body) => {
                if (err) return reject(err);
                request(url).pipe(fs.createWriteStream(path)).on("close", resolve);
            });
        } catch (e) {
            reject(e);
        }
    });
};


export const progressIterator = (count: number): () => { value: string, done: boolean } => {
    const step = 100 / count;
    let prgrs = 0;
    return () => {
        prgrs += step;
        return {
            value: progressBar(prgrs),
            done: (prgrs >= 100)
        }
    }
}

export const progressBar = (progress: number): string => {

    const maxElement = 12;
    const element = `${i18n.t("ru", "progress_symbol") } `;
    const step = Math.floor(100 / maxElement);
    if (progress < 0) progress = 0;
    if(progress > 100) progress = 100;
    const value = Math.floor(progress / step)
    if (progress === 0) return '';
    return `${'..'.repeat(value)}${element}`;
}

//******************************************************************** */
//************************* Дата парсер ****************************** */
//******************************************************************** */

interface DateValue {
    date: string;
    time: string;
    valid: boolean;
    reson: Reson;
}

type Reson = "Too Late" | "Invalid Date" | "Time has not yet come" | "Unknown error" | "No time specified" | "";

export const dateParser = (dataTxt: string): DateValue => {
    try {
        const toLate = 3; // Количество дней, через которые событие считается просроченым.
        const defaultTime = '00:00:00';
        const data: DateValue = {
            date: "",
            time: "",
            valid: false,
            reson: ""
        }
        dataTxt = dataTxt.trim()
            .replace(/\s+/g, ' ')
            .replace(/[a-zа-яё]/gi, '')
            .replace(/[,]/g, ".");

        const dataAndTimeArray = dataTxt.split(" ");
        if (dataAndTimeArray && Array.isArray(dataAndTimeArray)) {
            if (dataAndTimeArray.length === 1) {
                dataAndTimeArray.push(defaultTime)
            }
        }
        const dateArray = dataAndTimeArray[0].split(".");
        if (dateArray.length === 2) {
            dateArray.push(String(new Date().getFullYear()));
        } else {
            if (Number(dateArray[2]) <= 0) {
                dateArray[2] = String(new Date().getFullYear())
            }
        }

        if (dateArray[0].length === 1) dateArray[0] = `0${dateArray[0]}`
        if (dateArray[1].length === 1) dateArray[0] = `0${dateArray[0]}`
        const parseDate = new Date(`${dateArray[1]}.${dateArray[0]}.${dateArray[2]} ${dataAndTimeArray[1]}`);
        if (String(parseDate) === "Invalid Date") {
            data.valid = false;
            data.reson = "Invalid Date"
        } else {
            data.date = parseDate.toLocaleDateString();
            data.time = parseDate.toLocaleTimeString();
            data.reson = "";
            data.valid = true;

            const timeDiff = Date.now() - parseDate.valueOf();
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (data.time === defaultTime) {
                data.reson = "No time specified"
                data.valid = false;
            }

            if (timeDiff < 0) {
                data.reson = "Time has not yet come";
                data.valid = false;
            } else if (diffDays > toLate) {
                data.reson = "Too Late";
                data.valid = false;
            }
        }

        return data;
    } catch (e) {
        return {
            date: '',
            time: '',
            valid: false,
            reson: "Unknown error"
        }
    }

}