import { Interface } from "readline";
import { ScenarioProps } from "../src/props";
import { answerPropsQuestion } from "./answerProps";

export async function answerPropsBooleanQuestion<P extends ScenarioProps>(cli: Interface, {
    props,
    propsname,
    key,
    nullable,
}: {
    props: P,
    propsname: string,
    key: keyof P,
    nullable: boolean,
}): Promise<boolean> {
    return new Promise((resolve, reject) => {
        answerPropsQuestion(cli, {
            props,
            propsname,
            key,
            nullable,
        }).then(answer => {
            const result: boolean = answer == "true" || answer == "1"
            resolve(result);
        });
    })
}