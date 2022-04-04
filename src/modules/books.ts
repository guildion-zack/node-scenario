import { Interface } from "readline";
import { ScenarioBook } from "./book";
import { logger, NodeLogColor } from 'node-scenario/src/utils/Logger';

export class ScenarioBooks {
    public books: ScenarioBook[] = [];
    public displayScenario: () => Promise<void> = async () => {};

    async question(cli: Interface) {
        this.casesLogger(cli);
        const result = await this.chooseByQuestion(cli).catch(e => {
            console.log(e);
            return true
        });
        if (result) {
            await this.question(cli)
        } else {
            process.exit();
        };
    }

    async chooseByQuestion(cli: Interface): Promise<boolean> {
        return new Promise((resolve, reject) => {
            cli.question('You can choose book input [Prefix] or [index]\n> ', async (answer) => {
                if (answer == 'exit' || answer == 'd') {
                    cli.close();
                    resolve(false);
                } else if (answer == 'i') {
                    await this.displayScenario();
                    resolve(true);
                } else if (!!Number(answer) && Number(answer) > 0 && Number(answer) <= this.books.length + 1 ) {
                    const book = this.books[Number(answer) - 1];
                    resolve(await book.question(cli).catch(e => { console.log(e); return true }));
                } else if (this.books.filter(book => book.prefix == answer).length == 1) {
                    const book = this.books.filter(book => book.prefix == answer)[0];
                    resolve(await book.question(cli).catch(e => { console.log(e); return true }));
                } else {
                    console.log('Oops! It seems something wrong...');
                    console.log('Please try again...');
                    resolve(true);
                }
            });
        });
    }

    casesLogger(cli: Interface) {
        logger.divider();
        logger.br();
        logger.color(NodeLogColor.FgGreen, '   📖 Let\'s choose scenario book!');
        logger.br();
        this.books.forEach((book: ScenarioBook, index: number) => {
            book.logger(index);
        });
        logger.br();
        console.log(`   i. info: display context information ℹ️ `);
        console.log(`   d. exit: exit all scenario 👋`);
        logger.br();
        logger.divider();
    }
}