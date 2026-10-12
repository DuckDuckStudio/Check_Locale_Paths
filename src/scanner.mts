import { readdirSync, readFileSync } from "fs";
import { join, relative } from "path";

/**
 * 匹配 Windows 驱动器前缀的正则。
 */
const pattern = /[A-Z]:\\/g;

/**
 * 扫描选项接口。
 *
 * @example
 * const options: ScanOptions = {
 *    fileFormats: ["html", "css", "js", "mjs", "ts", "mts"],
 *    skipFiles: [],
 *    skipFolders: ["node_modules"]
 * };
 */
export interface ScanOptions {
    /**
     * 要扫描的文件格式列表。
     */
    fileFormats: string[];

    /**
     * 要跳过的文件列表。
     */
    skipFiles: string[];

    /**
     * 要跳过的文件夹列表。
     */
    skipFolders: string[];
}

/**
 * 扫描指定目录及其子目录中的文件，查找 Windows 本地路径。
 * @param directory 要扫描的目录路径。
 * @param options 扫描选项（{@link ScanOptions}）。
 * @param rootDirectory 根目录路径，用于计算相对路径。默认为 `directory`。
 * @returns 如果找到绝对路径，则返回 `true`，否则返回 `false`。
 */
export function scanDirectory(directory: string, options: ScanOptions, rootDirectory = directory): boolean {
    let foundPath = false;

    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (entry.name.startsWith(".")) {
            continue;
        }

        const filePath = join(directory, entry.name);
        const relativePath = relative(rootDirectory, filePath).replace(/\\/g, "/");

        if (options.skipFolders.some(folder => relativePath === folder || relativePath.startsWith(`${folder}/`))) {
            continue;
        }

        if (entry.isDirectory()) {
            foundPath = scanDirectory(filePath, options, rootDirectory) || foundPath;
            continue;
        }

        if (!entry.isFile() || !options.fileFormats.some(format => entry.name.endsWith(`.${format}`))) {
            continue;
        }

        if (options.skipFiles.includes(relativePath)) {
            continue;
        }

        const content = readFileSync(filePath, "utf8");
        for (const match of content.matchAll(pattern)) {
            console.error(`✕ 在 ${filePath} 匹配到本地路径: ${match[0]}`);
            foundPath = true;
        }
    }

    return foundPath;
}
