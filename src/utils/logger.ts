import pkj from '../../package.json' assert { type: 'json' };

import chalkAnimation from 'chalk-animation';
import chalk from 'chalk';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const wordmark = async () => {
    const animation = chalkAnimation.glitch(chalk.magentaBright(`pack@${pkj.version}`), 0.5);

    await sleep(2000);

    animation.stop();

    console.clear();

    console.log(chalk.magentaBright(`pack@${pkj.version}`));

    return true;
};

export const gap = () => {
    console.log(chalk.reset(''));
};

export const separator = () => {
    console.log(chalk.gray('----------------------------------------------------------------'));
};
