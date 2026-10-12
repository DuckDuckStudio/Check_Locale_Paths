import { scanDirectory } from './scanner.mjs';
/** 需要检查的文件的后缀 */
const fileFormats = process.env["INPUT_FORMATS"].split(",").map(format => format.trim());
/** 跳过的文件 */
const skipFiles = process.env["INPUT_SKIP_FILES"].split(",").map(file => file.trim().replace(/\\/g, "/"));
/** 跳过的文件夹 */
const skipFolders = process.env["INPUT_SKIP_FOLDERS"].split(",").map(folder => folder.trim().replace(/\\/g, "/"));
// 在所有文件处理完成后输出结果
if (scanDirectory(process.cwd(), { fileFormats, skipFiles, skipFolders })) {
    process.exit(1); // 如果发现路径，退出并且有非零状态码
}
else {
    console.log("✓ 所有文件检查完毕，未发现本地路径");
}
