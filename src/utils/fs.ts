import promises from "node:fs/promises";
import fs from "node:fs";

export const empty = async (path: string) => {
    try {
        const dir = await promises.opendir(path);
        const e = await dir.read();
        await dir.close();

        return e === null;
    } catch (e) {
        if (!fs.existsSync(path)) {
            return true;
        }

        return false;
    }
};

export const copy = async (source: string, destination: string) => {
    const dir = await promises.opendir(source);

    for await (const dirent of dir) {
        const sourcePath = `${source}/${dirent.name}`;
        const destinationPath = `${destination}/${dirent.name}`;

        if (dirent.isDirectory()) {
            await promises.mkdir(destinationPath, { recursive: true });
            await copy(sourcePath, destinationPath);
        } else {
            await promises.copyFile(sourcePath, destinationPath);
        }
    }
};
