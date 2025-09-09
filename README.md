# Check Locale Paths
检查你的网站项目中是否意外的使用了本地路径。  

[![GitHub Release](https://img.shields.io/github/release/DuckDuckStudio/Check_Locale_Paths?style=flat)](https://github.com/DuckDuckStudio/Check_Locale_Paths/releases/latest)  
[反馈Bug🐛](https://github.com/DuckDuckStudio/Check_Locale_Paths/issues) | [使用示例🚀](#6-使用示例)  

## 可用参数

> [!TIP]
> 所有参数名使用**复数**形式  

| 参数 | 描述 | 默认值 | 是否必须 | 备注 |
|-----|-----|-----|-----|-----|
| `formats` | 需要检查的文件格式，以 `,` 分隔 | `html,css,js` | 否 | / |
| `skip_files` | 跳过的文件，以 `,` 分隔 | / | 否 | / |
| `skip_folders` | 跳过的文件夹，以 `,` 分隔 | / | 否 | / |

## 使用示例
```yaml
name: 检查本地路径

# GitHub Action DuckDuckStudio/Check_Locale_Paths 版本 1.0.0 示例工作流
# https://github.com/marketplace/actions/check-locale-paths
# 通过 [GNU Affero General Public License v3.0](https://github.com/DuckDuckStudio/Check_Locale_Paths/blob/main/LICENSE) 许可
# 此工作流最初通过 [GNU Affero General Public License v3.0](https://github.com/DuckDuckStudio/yazicbs.github.io/blob/main/LICENSE.txt) 从 DuckDuckStudio/yazicbs.github.io 获得许可。

on:
  push:
    branches:
      - main
  pull_request:

permissions: {}

jobs:
  check-local-paths:
    runs-on: ubuntu-latest

    steps:
      - name: 检查本地路径
        uses: DuckDuckStudio/Check_Locale_Paths@1.0.0
        with:
          skip_files: Tools/Fufu_Tools/minimum/index.html
          skip_folders: Tools/Fufu_Tools/wiki,node_modules
          formats: html,css,js,md
```

## 星星 🌟
如果您认为本项目对您有帮助，还请给本项目一个小小的 Star 。  
[![星标历史](https://api.star-history.com/svg?repos=DuckDuckStudio/Check_Locale_Paths&type=Date)](https://star-history.com/#DuckDuckStudio/Check_Locale_Paths&Date)  
