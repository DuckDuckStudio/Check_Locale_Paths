import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { scanDirectory, type ScanOptions } from "../scanner.mjs";

/**
 * 默认扫描选项。
 */
const defaultOptions: ScanOptions = {
    fileFormats: ["html", "css", "js", "mjs", "ts", "mts"],
    skipFiles: [],
    skipFolders: ["node_modules"],
};

/**
 * 临时目录路径。
 */
let temporaryDirectory: string;

/**
 * 创建一个临时工作区目录。
 * @returns 临时目录的路径。
 */
function createWorkspace(): string {
    temporaryDirectory = mkdtempSync(join(tmpdir(), "check-locale-paths-"));
    return temporaryDirectory;
}

/**
 * 写入文件。
 * @param root 根目录。
 * @param relativePath 相对路径。
 * @param content 文件内容。
 */
function writeFile(root: string, relativePath: string, content: string): void {
    const filePath = join(root, relativePath);
    mkdirSync(join(filePath, ".."), { recursive: true });
    writeFileSync(filePath, content);
}

afterEach(() => {
    // 清理临时目录和恢复所有模拟。
    if (temporaryDirectory) {
        rmSync(temporaryDirectory, { recursive: true, force: true });
    }
    vi.restoreAllMocks();
});

describe("scanDirectory", () => {
    it("在 HTML 文件中找出本地路径", () => {
        const root = createWorkspace();
        writeFile(root, "nested/page.html", "C:\\Users\\person\\site");

        const error = vi.spyOn(console, "error").mockImplementation(() => {});

        expect(scanDirectory(root, defaultOptions)).toBe(true);
        expect(error).toHaveBeenCalledTimes(1);
    });

    it("忽略未指定的格式和隐藏文件及文件夹", () => {
        const root = createWorkspace();
        writeFile(root, "notes.txt", "C:\\Users\\person");
        writeFile(root, ".hidden/page.html", "C:\\Users\\person");

        expect(scanDirectory(root, defaultOptions)).toBe(false);
    });

    it("跳过指定的文件和文件夹", () => {
        const root = createWorkspace();
        writeFile(root, "nested/ignored.html", "C:\\Users\\person");
        writeFile(root, "vendor/package.js", "C:\\Users\\person");
        const error = vi.spyOn(console, "error").mockImplementation(() => {});
        const options = {
            ...defaultOptions,
            skipFiles: ["nested/ignored.html"],
            skipFolders: ["vendor"],
        };

        expect(scanDirectory(root, options)).toBe(false);
        expect(error).not.toHaveBeenCalled();
    });

    it("完整匹配跳过目录名，而不是只匹配前缀", () => {
        const root = createWorkspace();
        writeFile(root, "vendor-copy/page.js", "C:\\Users\\person");
        vi.spyOn(console, "error").mockImplementation(() => {});

        expect(scanDirectory(root, { ...defaultOptions, skipFolders: ["vendor"] })).toBe(true);
    });
});
