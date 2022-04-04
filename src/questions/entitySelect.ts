import { Class } from "@guildion/core";
import { logger, NodeLogColor } from "@guildion/node/src/extension/Logger";
import { Interface } from "readline";
import { BaseEntity, FindConditions } from "typeorm";

export async function entitySelectQuestion<M extends BaseEntity & { id: string }>(
    cli: Interface,
    entityStatic: Class<M> & { findOne: typeof BaseEntity.findOne, find: typeof BaseEntity.find },
    { where, count, offset, attribute, entities, allowNull }: { where?: FindConditions<M>, count?: number, offset?: number, attribute: keyof M, entities?: M[], allowNull?: boolean },
): Promise<M | undefined> {
    entities ||= [];
    where ||= {};
    entities = entities.concat(await entityStatic.find({ where, take: count, skip: offset }));
    logger.divider2();
    console.log(' ');
    logger.color(NodeLogColor.FgGreen, '   👉 Let\'s choose record!');
    console.log(' ');
    for (const [index, entity] of entities.entries()) {
        console.log(`   ${index + 1}. id: ${entity.id} - ${attribute}: ${entity[attribute]}`)
    }
    console.log(' ');
    console.log('   i. Increment records');
    if (allowNull) console.log('   e. End choose record');
    console.log(' ');
    logger.divider2();
    return new Promise((resolve, reject) => {
        cli.question(`Choose record of ${entityStatic.name} to type [index] ( default: 1 )\n> `, async (answer) => {
            const i = Number(answer);
            if (!!i && i > 0 && entities!.length >= i) {
                const entity = entities![i - 1];
                resolve(entity);
            } else if (answer == 'i') {
                entitySelectQuestion(cli, entityStatic, { where, count, offset: entities?.length, attribute, entities, allowNull }).then(result => {
                    resolve(result);
                });
            } else if (answer == 'e' && allowNull) {
                resolve(undefined);
            } else {
                console.log('Oops! It seems something wrong...');
                console.log('Please try again...');
                entitySelectQuestion(cli, entityStatic, { where, count, offset, attribute, entities, allowNull }).then(result => {
                    resolve(result);
                });
            }
        });
    });
}