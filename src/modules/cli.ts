import { Interface } from "readline";
import { ScenarioProps } from "./props";

export class ScenarioCli<Props extends ScenarioProps> {
    constructor() {}

    async question(cli: Interface): Promise<Props> {
        throw new Error('NotOverrideError');
    }
}