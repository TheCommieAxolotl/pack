import childprocess from "node:child_process";
import process from "node:process";
import util from "node:util";
import path from "node:path";

const exec = util.promisify(childprocess.exec);

export const getPackageManager = () => {
    const agent = process.env.npm_config_user_agent;

    if (agent) {
        if (agent.startsWith("yarn")) return "yarn";
        if (agent.startsWith("pnpm")) return "pnpm";
    }

    return "npm";
};

export const installDependencies = async (location: string, manager: string) => {
    const cwd = path.resolve(process.cwd(), location);

    switch (manager) {
        case "yarn":
            await exec("yarn install", { cwd });
            break;
        case "pnpm":
            await exec("pnpm install", { cwd });
            break;
        default:
            await exec("npm install", { cwd });
            break;
    }

    return true;
};
