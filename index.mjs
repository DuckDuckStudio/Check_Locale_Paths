import { readdirSync, readFileSync } from 'fs';
import { join, relative } from 'path';

/**
 * 匹配 Windows 驱动器前缀的正则。
 */
const pattern = /[A-Z]:\\/g;
const fileFormats = process.env.FORMATS.split(',').map(format => `**/*.${format.trim()}`);
const skipFiles = process.env.SKIP_FILES.split(',').map(file => file.trim());
const skipFolders = process.env.SKIP_FOLDERS.split(',').map(file => file.trim());

/**
 * 扫描指定目录及其子目录中的文件，查找绝对路径或包含驱动器的路径
 * @param {string} directory - 要扫描的目录
 */
function scanDirectory(directory) {
    let foundPath = false;

    // 读取目录中的所有条目（文件和文件夹）
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
        const filePath = join(directory, entry.name);
        const relativePath = relative(process.cwd(), filePath).replace(/\\/g, '/');

        // 检查是否在跳过的文件夹中
        if (skipFolders.some(folder => relativePath.startsWith(folder.replace(/\\/g, '/')))) {
            continue;
        }

        // 如果是目录，则递归扫描该目录
        if (entry.isDirectory()) {
            foundPath = scanDirectory(filePath) || foundPath;
            continue;
        }

        // 如果不是文件，或者文件后缀不在指定的格式列表中，则跳过
        if (!entry.isFile() || !fileFormats.some(format => entry.name.endsWith(`.${format}`))) {
            continue;
        }

        // 检查是否在跳过的文件列表中
        if (skipFiles.includes(relativePath)) {
            continue;
        }

        const content = readFileSync(filePath, 'utf8');
        for (const match of content.matchAll(pattern)) {
            // 输出匹配到的路径
            console.error(`✕ 在 ${filePath} 中发现本地路径: ${match[0]}`);
            foundPath = true;
        }
    }

    return foundPath;
}

// 在所有文件处理完成后输出结果
if (scanDirectory(process.cwd())) {
    process.exit(1); // 如果发现路径，退出并且有非零状态码
} else {
    console.log("✓ 所有文件检测完毕，未发现本地路径");
}
