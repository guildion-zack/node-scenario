import { Interface } from "readline";
import { ScenarioProps } from "../src/props";
import { logger, NodeLogColor } from '@guildion/node/src/extension/Logger';

export async function selectPropsQuestion<V, P extends ScenarioProps>(cli: Interface, objects: { [key: string]: V }, {
    props,
    propsname,
    key,
    nullable,
}: {
    props: P,
    propsname: string,
    key: keyof P,
    nullable: boolean,
}): Promise<V | undefined> {
    return new Promise((resolve, reject) => {
        let value = props[key];
        logger.divider();
        logger.br();
        logger.color(NodeLogColor.FgGreen, '   👉 Let\'s choose scenario section!');
        Object.keys(objects).forEach((k, index) => {
            console.log(`   ${index + 1}. ${k}`);
        });
        logger.br();
        logger.divider();
        cli.question(`Please select ${key} in ${propsname} ( default: ${value} )\n> `, async (answer) => {
            if (answer.length == 0 && nullable) {
                resolve(undefined);
            } else if (answer.length == 0 && !nullable) {
                resolve(selectPropsQuestion(cli, objects, {
                    props,
                    propsname,
                    key,
                    nullable,
                }))
            } else if (!!Object.keys(objects).find(k => answer == k)) {
                resolve(objects[Object.keys(objects).find(k => answer == k)!]);
            } else {
                resolve(selectPropsQuestion(cli, objects, {
                    props,
                    propsname,
                    key,
                    nullable,
                }))
            }
        })
    })
}