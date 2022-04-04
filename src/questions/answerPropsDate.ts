import { Interface } from "readline";
import { ScenarioProps } from "../src/props";

export async function answerPropsDateQuestion<P extends ScenarioProps>(cli: Interface, {
    props,
    propsname,
    key,
    nullable,
    yearSkippable = true,
    monthSkippable = true,
    daySkippable = true,
    hoursSkippable = true,
    minutesSkippable = true,
    secondsSkippable = true,
}: {
    props: P,
    propsname: string,
    key: keyof P,
    nullable: boolean,
    yearSkippable?: boolean,
    monthSkippable?: boolean,
    daySkippable?: boolean,
    hoursSkippable?: boolean,
    minutesSkippable?: boolean,
    secondsSkippable?: boolean,
}): Promise<Date | undefined> {
    return new Promise(async (resolve, reject) => {
        const now = new Date();
        let value = props[key] ? new Date(`${props[key]}`) : new Date();
        let year = value.getFullYear(); 
        let month = value.getMonth(); 
        let day = value.getDay(); 
        let hours = value.getHours(); 
        let minutes = value.getMinutes(); 
        let seconds = value.getSeconds(); 
        const inputYear = async (cli: Interface) => {
            return new Promise(($resolve, $reject) => {
                cli.question(`Please type year of ${key} in ${propsname} ( default: ${year} )\n> `, async (answer) => {
                    if (answer.length == 0 || !Number(answer)) {
                        if (yearSkippable) {
                            $resolve(year); 
                            return;
                        } else {
                            $resolve(inputYear(cli));
                        }
                    } else {
                        year = Number(answer);
                        $resolve(Number(answer));
                    }
                })
            });
        };
        const inputMonth = async (cli: Interface) => {
            return new Promise(($resolve, $reject) => {
                cli.question(`Please type month of ${key} in ${propsname} ( default: ${month} )\n> `, async (answer) => {
                    if (answer.length == 0 || !Number(answer)) {
                        if (monthSkippable) {
                            $resolve(year); 
                            return;
                        } else {
                            $resolve(inputMonth(cli));
                        }
                    } else {
                        month = Number(answer);
                        $resolve(Number(answer));
                    }
                })
            });
        };
        const inputDay = async (cli: Interface) => {
            return new Promise(($resolve, $reject) => {
                cli.question(`Please type day of ${key} in ${propsname} ( default: ${day} )\n> `, async (answer) => {
                    if (answer.length == 0 || !Number(answer)) {
                        if (daySkippable) {
                            $resolve(day); 
                            return;
                        } else {
                            $resolve(inputDay(cli));
                        }
                    } else {
                        day = Number(answer);
                        $resolve(Number(answer));
                    }
                })
            });
        };
        const inputHours = async (cli: Interface) => {
            return new Promise(($resolve, $reject) => {
                if (hoursSkippable) {
                    $resolve(year); 
                    return;
                }
                cli.question(`Please type hours of ${key} in ${propsname} ( default: ${hours} )\n> `, async (answer) => {
                    if (answer.length == 0 || !Number(answer)) {
                        if (hoursSkippable) {
                            $resolve(year); 
                            return;
                        } else {
                            $resolve(inputHours(cli));
                        }
                    } else {
                        hours = Number(answer);
                        $resolve(Number(answer));
                    }
                })
            });
        };
        const inputMinutes = async (cli: Interface) => {
            return new Promise(($resolve, $reject) => {
                cli.question(`Please type minutes of ${key} in ${propsname} ( default: ${minutes} )\n> `, async (answer) => {
                    if (answer.length == 0 || !Number(answer)) {
                        if (minutesSkippable) {
                            $resolve(year); 
                            return;
                        } else {
                            $resolve(inputMinutes(cli));
                        }
                    } else {
                        minutes = Number(answer);
                        $resolve(Number(answer));
                    }
                })
            });
        };
        const inputSeconds = async (cli: Interface) => {
            return new Promise(($resolve, $reject) => {
                cli.question(`Please type seconds of ${key} in ${propsname} ( default: ${seconds} )\n> `, async (answer) => {
                    if (answer.length == 0 || !Number(answer)) {
                        if (secondsSkippable) {
                            $resolve(year); 
                            return;
                        } else {
                            $resolve(inputSeconds(cli));
                        }
                    } else {
                        seconds = Number(answer);
                        $resolve(Number(answer));
                    }
                })
            });
        };
        if (nullable) {
            cli.question(`Do you want pick date of ${key} in ${propsname} 'yes' or 'no' or 'now' ( now: ${value} )\n> `, async (answer) => {
                if (answer == 'now') {
                    resolve(new Date());
                } else if (answer == 'yes') {
                    await inputYear(cli);
                    await inputMonth(cli);
                    await inputDay(cli);
                    await inputMinutes(cli);
                    await inputSeconds(cli);
                    resolve(new Date(year, month, day, minutes, seconds));
                } else {
                    resolve(undefined);
                }
            })
        } else {
            await inputYear(cli);
            await inputMonth(cli);
            await inputDay(cli);
            await inputMinutes(cli);
            await inputSeconds(cli);
            resolve(new Date(year, month, day, minutes, seconds));
        }
    });
};