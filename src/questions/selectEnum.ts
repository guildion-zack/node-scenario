import { allCases, allKeys, CaseIterable, ValueOfCaseIterable } from "@guildion/core";
import { logger, NodeLogColor } from "@guildion/node/src/extension/Logger";
import { Interface } from "readline";

export async function selectEnumQuestion<P extends CaseIterable<ValueOfCaseIterable<P>>>(
    cli: Interface,
    {
        props,
        propsname,
        key,
        nullable,
        defaultValue,
    }: {
        props: P,
        propsname: string,
        key: keyof P,
        nullable: boolean,
        defaultValue: ValueOfCaseIterable<P>,
    }
): Promise<ValueOfCaseIterable<P>> {
    const cases = allCases(props);
    const keys = allKeys(props);
    logger.divider2();
    console.log(' ');
    logger.color(NodeLogColor.FgGreen, '   👉 Let\'s choose enum value!');
    console.log(' ');
    for (const [index, key] of keys.entries()) {
        console.log(`   ${index + 1}. ${key}: ${props[key]}`)
    }
    console.log(' ');
    logger.divider2();
    return new Promise((resolve, reject) => {
        cli.question(`Choose value of ${propsname} ( default: ${props[key]} )\n> `, async (answer) => {
            const i = Number(answer);
            if (!!i && i > 0 && cases!.length >= i) {
                const val = cases[i - 1];
                resolve(val);
            } else if (props[answer]) {
                resolve(props[answer])
            } else {
                if (nullable) {
                    resolve(defaultValue);
                } else {
                    console.log('Oops! It seems something wrong...');
                    console.log('Please try again...');
                    selectEnumQuestion(cli, {
                        props,
                        propsname,
                        key,
                        nullable,
                        defaultValue,
                    }).then(result => {
                        resolve(result);
                    });
                }
            }
        });
    });
}