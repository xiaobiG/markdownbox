# markdownbox 

### 开发准备

要创建一个 sVisual Studio Code 插件，实现上述功能，你需要按照以下步骤进行操作：

1. 安装必要的开发工具和依赖项：
   - 安装 Node.js：确保你的计算机上安装了 Node.js。你可以从 Node.js 官方网站下载并安装最新版本。
   - 安装 Yeoman 和 Visual Studio Code 插件生成器：在命令行中运行以下命令安装 Yeoman 和插件生成器：
     ```
     npm install -g yo generator-code
     ```
   - 安装 TypeScript：在命令行中运行以下命令安装 TypeScript：
     ```
     npm install -g typescript
     ```

2. 创建插件项目：
   - 打开命令行终端，并导航到你想要创建插件的目录。
   - 运行以下命令生成插件项目：
     ```
     yo code
     ```
   - 在生成器提示中，选择 "New Extension (TypeScript)" 选项，并按照提示进行设置。




### 打包

```
npm i

npm install --global @vscode/vsce

vsce package
```