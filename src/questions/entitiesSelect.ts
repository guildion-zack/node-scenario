import { Class } from "@guildion/core";
import { logger, NodeLogColor } from "@guildion/node/src/extension/Logger";
import { Interface } from "readline";
import { BaseEntity, FindConditions } from "typeorm";

export async function entitiesSelectQuestion<M extends BaseEntity & { id: string }>(
    cli: Interface,
    entityStatic: Class<M> & { findOne: typeof BaseEntity.findOne, find: typeof BaseEntity.find },
    { where, count, offset, attribute, entities, selecteds, noQuery }: { where?: FindConditions<M>, count?: number, offset?: number, attribute: keyof M, entities?: M[], selecteds?: M[], noQuery?: boolean },
): Promise<M[]> {
    entities ||= [];
    selecteds ||= [];
    where ||= {};
    if (!noQuery) {
        entities = entities.concat(
            await entityStatic.find({ 
                where,
                take: count,
                skip: offset 
            })
        );
    }
    logger.divider2();
    console.log(' ');
    logger.color(NodeLogColor.FgGreen, '   👉 Let\'s choose record!');
    console.log(' ');
    for (const [index, entity] of entities.entries()) {
        console.log(`   ${index + 1}. id: ${entity.id} - ${attribute}: ${entity[attribute]}`)
    }
    console.log(' ');
    console.log('   i. Increment records');
    console.log('   e. End select records');
    if (selecteds.length > 0) console.log(`   ${selecteds.length} of records selected`);
    console.log(' ');
    logger.divider2();
    return new Promise((resolve, reject) => {
        cli.question(`Choose record of ${entityStatic.name} to type [index] ( default: 1 )\n> `, async (answer) => {
            const i = Number(answer);
            if (!!i && i > 0 && entities!.length >= i) {
                const entity = entities![i - 1];
                selecteds?.push(entity);
                entitiesSelectQuestion(cli, entityStatic, { where, count, offset, attribute, entities, selecteds, noQuery: true }).then(result => {
                    resolve(result);
                });
            } else if (answer == 'i') {
                entitiesSelectQuestion(cli, entityStatic, { where, count, offset: entities?.length, attribute, entities, selecteds }).then(result => {
                    resolve(result);
                });
            } else if (answer == 'e') {
                resolve(selecteds!);
            } else {
                console.log('Oops! It seems something wrong...');
                console.log('Please try again...');
                entitiesSelectQuestion(cli, entityStatic, { where, count, offset, attribute, entities, selecteds, noQuery: true }).then(result => {
                    resolve(result);
                });
            }
        });
    });
}