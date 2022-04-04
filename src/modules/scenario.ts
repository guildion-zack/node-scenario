import { Interface } from "readline";
import $progress, { SingleBar } from 'cli-progress';
import $colors from 'colors';
import { logger, NodeLogColor } from 'node-scenario/src/utils/Logger';
import { ScenarioCli } from "./cli";
import { ScenarioProps } from "./props";
import { ScenarioFinale } from "./finale";
import { Class } from "../types/Class";

export class Scenario<Props extends ScenarioProps, Finale extends ScenarioFinale> {
    public prefix: string = '';
    public description: string = '';
    public isDefault: boolean = false;
    public cli!: Class<ScenarioCli<Props>>;

    constructor() {}

    async logger(index: number) {
        console.log(`   ${index + 1}. ${this.prefix}: ${this.description}`);
    }

    async exec(props: Props): Promise<Finale> {
        const bar = new $progress.Bar({
            format: '|' + $colors.cyan('{bar}') + '| {percentage}% || {value}/{total}',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        });
        return await this.run(props, { bar });
    }

    async run(props: Props, {
        bar,
    }: {
        bar: SingleBar,
    }): Promise<Finale> {
        // bar.start(1, 0, { speed: "N/A" });
        throw new Error('NotOverrideError');
    }

    async question(cli: Interface): Promise<boolean> {
        const props = await (new this.cli).question(cli);
        const result = await this.exec(props);
        logger.br();
        result ? logger.color(NodeLogColor.FgGreen, '✅ SUCCESS') : logger.color(NodeLogColor.FgRed, '❌ FAILED');
        logger.br();
        return true;
    }
}