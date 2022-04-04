import { Interface } from "readline";
import { Scenario } from "./scenario";
import { logger, NodeLogColor } from 'node-scenario/src/utils/Logger';

export class ScenarioSection {
    public prefix: string = '';
    public description: string = '';
    public cases: Scenario<any, any>[] = [];

    constructor() {}

    async logger(index: number) {
        console.log(`   ${index + 1}. ${this.prefix}: ${this.description}`);
    }

    async question(cli: Interface): Promise<boolean> {
        logger.color(NodeLogColor.FgGreen, `👉  ${this.prefix}`);
        if (this.cases.length == 1) { 
            return await this.cases[0].question(cli).catch(e => { console.log(e); return true });
        }
        this.casesLogger(cli);
        return await this.chooseByQuestion(cli).catch(e => { console.log(e); return true });
    }

    async chooseByQuestion(cli: Interface): Promise<boolean> {
        return new Promise((resolve, reject) => {
            cli.question('You can choose scenario input [prefix] or [index]\n> ', async (answer) => {
                if (answer == 'exit' || answer == 'd') {
                    cli.close();
                    resolve(false);
                } else if (answer == 'back' || answer == 'b') {
                    resolve(true);
                } else if (!!Number(answer) && Number(answer) > 0 && Number(answer) <= this.cases.length + 1 ) {
                    const scenario = this.cases[Number(answer) - 1];
                    resolve(await scenario.question(cli).catch(e => { console.log(e); return true }));
                } else if (this.cases.filter(val => val.prefix == answer).length == 1) {
                    const scenario = this.cases.filter(val => val.prefix == answer)[0];
                    resolve(await scenario.question(cli).catch(e => { console.log(e); return true }));
                } else {
                    console.log('Oops! It seems something wrong...');
                    console.log('Please try again...');
                    resolve(await this.question(cli).catch(e => { console.log(e); return true }));
                }
            });
        });
    }

    casesLogger(cli: Interface) {
        logger.divider();
        logger.br();
        logger.color(NodeLogColor.FgGreen, '   👉 Let\'s choose scenario section!');
        logger.br();
        this.cases.forEach((scenario: Scenario<any, any>, index: number) => {
            scenario.logger(index);
        });
        logger.br();
        console.log(`   b. back: back to select books 📖`);
        console.log(`   d. exit: exit all scenario 👋`);
        logger.br();
        logger.divider();
    }
}