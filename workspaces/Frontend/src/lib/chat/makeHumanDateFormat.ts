export default function makeHumanDateFormat(date:Date):string {

    let formated:string = "";

    const now = new Date();

    const dayMonthYear:string = date.toLocaleDateString();
    const today:string = now.toLocaleDateString();
    // console.log(date);

    if (dayMonthYear !== today)
        formated += dayMonthYear + " ";

    formated += addZero(date.getHours()) + ":" + addZero(date.getMinutes());

    return formated;
}

function addZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
}
