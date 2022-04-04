import { Interface } from "readline";
import { ScenarioProps } from "../src/props";

export async function answerPropsQuestion<P extends ScenarioProps>(cli: Interface, {
    props,
    propsname,
    key,
    nullable,
}: {
    props: P,
    propsname: string,
    key: keyof P,
    nullable: boolean,
}): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
        let value = props[key];
        cli.question(`Please type ${key} in ${propsname} ( default: ${value} )\n> `, async (answer) => {
            if (answer.length == 0 && nullable) {
                resolve(undefined);
            } else if (answer.length == 0 && !nullable) {
                resolve(answerPropsQuestion(cli, {
                    props,
                    propsname,
                    key,
                    nullable,
                }))
            } else {
                resolve(answer);
            }
        })
    })
}