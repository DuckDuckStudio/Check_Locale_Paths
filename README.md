# Check Locale Paths
检查你的网站项目中是否意外的使用了本地路径。

[![GitHub Release](https://img.shields.io/github/release/DuckDuckStudio/Check_Locale_Paths?style=flat)](https://github.com/DuckDuckStudio/Check_Locale_Paths/releases/latest)
[反馈Bug🐛](https://github.com/DuckDuckStudio/Check_Locale_Paths/issues) | [使用示例🚀](#使用示例)

## 可用参数

> [!TIP]
> 所有参数名使用**复数**形式

| 参数 | 描述 | 默认值 | 是否必须 | 备注 |
|-----|-----|-----|-----|-----|
| `formats` | 需要检查的文件格式，以 `,` 分隔 | `html,css,js,mjs,ts,mts` | 否 | / |
| `skip_files` | 跳过的文件，以 `,` 分隔 | / | 否 | / |
| `skip_folders` | 跳过的文件夹，以 `,` 分隔 | `node_modules` | 否 | / |

## 使用示例

```yaml
name: 检查本地路径

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
      # 在 4.0.0 及以上版本需要另行检出代码
      - name: 检出代码
        uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false

      - name: 检查本地路径
        uses: DuckDuckStudio/Check_Locale_Paths@4.0.0
        with:
          skip_files: skiped.html
          # 默认
          # skip_folders: node_modules
          # formats: html,css,js,mjs,ts,mts
```

## 星星 🌟
如果您认为本项目对您有帮助，还请给本项目一个小小的 Star 。
[![星标历史](https://api.star-history.com/svg?repos=DuckDuckStudio/Check_Locale_Paths&type=Date)](https://star-history.com/#DuckDuckStudio/Check_Locale_Paths&Date)
