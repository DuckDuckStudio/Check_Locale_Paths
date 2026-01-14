import { readFileSync } from 'fs';
import { sync } from 'glob';
import { relative } from 'path';

// 匹配绝对路径或包含驱动器的路径
const pattern = /(?:[A-Z]:\\)/g;
const fileFormats = process.env["FORMATS"]?.split(',').map(format => `**/*.${format.trim()}`);

if (!fileFormats || fileFormats.length === 0) {
    console.error("✕ 请通过环境变量 'FORMATS' 指定要检查的文件格式");
    process.exit(1);
}

const skipFiles = process.env["SKIP_FILES"]?.split(',').map(file => file.trim()) || [];
const skipFolders = process.env["SKIP_FOLDERS"]?.split(',').map(file => file.trim()) || [];

let foundPath = false; // 用于跟踪是否已经找到路径

fileFormats.forEach(globPattern => {
    const filePaths = sync(globPattern, { nodir: true });
    filePaths.forEach(filePath => {
        // 获取相对路径，并标准化路径分隔符
        const relativePath = relative(process.cwd(), filePath).replace(/\\/g, '/');

        // 检查是否在跳过的文件夹中
        if (skipFolders.some(folder => relativePath.startsWith(folder.replace(/\\/g, '/')))) {
            return;
        }

        // 检查是否在跳过的文件列表中
        if (skipFiles.includes(relativePath)) {
            return;
        }

        const content = readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach(line => {
            let match;
            while ((match = pattern.exec(line)) !== null) {
                // 检测是否是绝对路径
                if (/^[A-Z]:\\/.test(match[0]) || /^\/[^/:*?"<>|\r\n]/.test(match[0])) {
                    // 打印检测到的路径
                    console.error(`✕ 在 ${filePath} 检测到本地路径: ${match[0]}`);
                    foundPath = true;
                    return; // 找到路径后，跳过该文件的其他行
                }
            }
        });
    });
});

// 在所有文件处理完成后输出结果
if (foundPath) {
    process.exit(1); // 如果发现路径，退出并且有非零状态码
} else {
    console.log("✓ 所有文件检测完毕，未发现本地路径");
}
