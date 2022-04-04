import { Interface } from "readline";
import { logger, NodeLogColor } from 'node-scenario/src/utils/Logger';

export class ScenarioContext {
    protected current: { [key: string]: any } = {};
    
    constructor(caller: Function) {}

    setContext(context: { [key: string]: any }) {
        this.current = context;
    }

    logger() {
        console.log(' ');
        logger.divider2();
        logger.color(NodeLogColor.FgCyan, '<Current Scenario Context>');
        console.log(this.current);
        logger.divider2();
        console.log(' ');
    }

    async displayResults(cli: Interface) {
        return new Promise((resolve, reject) => {
            this.logger();
            cli.question('> ', (answer) => {
                resolve(undefined);
            });
        })
    }

    async save() {
        // switch(this.type) {
        // case ScenarioContextType.API:
        //     const data = JSON.stringify(this.current);
        //     if (data.length == 0) break;
        //     await ScenarioContextEntity.create({
        //         type: ScenarioContextType.API,
        //         data: JSON.stringify(this.current),
        //     }).save();
        //     break;
        // case ScenarioContextType.Other:
        // default: break
        // }
    }

    async restore() {
        // switch(this.type) {
        // case ScenarioContextType.API:
        //     const contexts = await ScenarioContextEntity.find({
        //         where: {
        //             type: ScenarioContextType.API,
        //         },
        //         take: 1,
        //         order: { createdAt: 'DESC' },
        //     });
        //     const data = contexts.length > 0 ? JSON.parse(contexts[0].data) : undefined;
        //     if (data) this.current = data;
        //     break;
        // case ScenarioContextType.Other:
        // default: break
        // }
    }
}