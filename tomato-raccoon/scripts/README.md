# `scripts/` 运维与发布脚本目录说明文档

本目录存放用于**自动化构建、发布、依赖安全审计**的辅助 Shell 脚本。
这些脚本供 CI/CD 流水线（如 GitHub Actions、阿里云效流水线）或在 Linux/macOS 环境下本地执行。

---

## 脚本清单与功能说明

| 脚本文件名 | 运行方式 | 功能描述与用途 |
| :--- | :--- | :--- |
| **`api.sh`** | `sh scripts/api.sh` | **接口自动化测试探针**：使用 curl 测试本地或预发环境的 API 接口可用性。 |
| **`audit.sh`** | `sh scripts/audit.sh` | **安全与依赖合规审计**：调用包管理器扫描当前项目 `node_modules` 是否存在高危 CVE 安全漏洞。 |
| **`check-shell.sh`**| `sh scripts/check-shell.sh` | **脚本语法检查**：调用 ShellCheck 检查所有 `.sh` 脚本是否符合 POSIX 规范，防止跨平台兼容性报错。 |
| **`publish.sh`** | `sh scripts/publish.sh` | **自动化打包发布流程**：依次执行类型检查 (`tsc --noEmit`)、项目打包 (`pnpm run build`) 和发布触发。 |

> **提示**：日常在 Windows / WebStorm 下本地开发时，直接使用 `pnpm run dev` 或 `pnpm run build` 即可，无需单独执行此目录下的 Shell 脚本。
