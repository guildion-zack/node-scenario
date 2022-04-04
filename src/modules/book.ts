import { Interface } from "readline";
import { ScenarioSection } from "./section";
import { logger, NodeLogColor } from 'node-scenario/src/utils/Logger';

export class ScenarioBook {
    public prefix: string = '';
    public description: string = '';
    public cases: ScenarioSection[] = [];

    constructor() {};

    async question(cli: Interface): Promise<boolean> {
        this.casesLogger(cli);
        return await this.chooseByQuestion(cli).catch(e => { console.log(e); return true });
    }

    async chooseByQuestion(cli: Interface): Promise<boolean> {
        return new Promise((resolve, reject) => {
            cli.question('You can choose section input [prefix] or [index]\n> ', async (answer) => {
                if (answer == 'exit' || answer == 'd') {
                    cli.close();
                    resolve(false);
                } else if (answer == 'back' || answer == 'b') {
                    resolve(true);
                } else if (!!Number(answer) && Number(answer) > 0 && Number(answer) <= this.cases.length + 1 ) {
                    const section = this.cases[Number(answer) - 1];
                    resolve(await section.question(cli).catch(e => { console.log(e); return true }));
                } else if (this.cases.filter(section => section.prefix == answer).length == 1) {
                    const section = this.cases.filter(section => section.prefix == answer)[0];
                    resolve(await section.question(cli).catch(e => { console.log(e); return true }));
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
        this.cases.forEach((section: ScenarioSection, index: number) => {
            section.logger(index);
        });
        logger.br();
        console.log(`   b. back: back to select books 📖`);
        console.log(`   d. exit: exit all scenario 👋`);
        logger.br();
        logger.divider();
    }

    logger(index: number) {
        console.log(`   ${index + 1}. ${this.prefix}: ${this.description}`);
    }
}