import { Interface } from "readline";
import { ScenarioProps } from "../src/props";
import { answerPropsQuestion } from "./answerProps";

export async function answerPropsNumberQuestion<P extends ScenarioProps>(cli: Interface, {
    props,
    propsname,
    key,
    nullable,
}: {
    props: P,
    propsname: string,
    key: keyof P,
    nullable: boolean,
}): Promise<number> {
    return new Promise((resolve, reject) => {
        answerPropsQuestion(cli, {
            props,
            propsname,
            key,
            nullable,
        }).then(answer => {
            resolve(Number(answer));
        });
    })
}