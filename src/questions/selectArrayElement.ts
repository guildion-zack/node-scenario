import { logger, NodeLogColor } from "@guildion/node/src/extension/Logger";
import { Interface } from "readline";

export async function selectArrayElementQuestion<E, P extends Array<E>>(
    cli: Interface,
    {
        props,
        propsname,
        nullable,
        defaultValue,
        key,
    }: {
        props: P,
        propsname: string,
        nullable: boolean,
        defaultValue: E,
        key?: keyof E,
    }
): Promise<E> {
    logger.divider2();
    console.log(' ');
    logger.color(NodeLogColor.FgGreen, '   👉 Let\'s choose array value!');
    console.log(' ');
    props.map((val, index) => {
        console.log(`   ${index + 1}. ${key ? (val as any)[key] : JSON.stringify(val)}`);
    })
    console.log(' ');
    logger.divider2();
    return new Promise((resolve, reject) => {
        cli.question(`Choose value of ${propsname} ( default: ${key && defaultValue ? (defaultValue as any)[key] : JSON.stringify(defaultValue)} )\n> `, async (answer) => {
            const i = Number(answer);
            if (!!i && i > 0 && props!.length >= i) {
                const val = props[i - 1];
                resolve(val);
            } else if (!!i && props[i - 1]) {
                resolve(props[i - 1])
            } else {
                if (nullable) {
                    resolve(defaultValue);
                } else {
                    console.log('Oops! It seems something wrong...');
                    console.log('Please try again...');
                    selectArrayElementQuestion(cli, {
                        props,
                        propsname,
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