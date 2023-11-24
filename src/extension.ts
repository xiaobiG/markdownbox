// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
const os = require("os");
const fs = require("fs");
const path = require("path");
let createStatusBarItem: vscode.StatusBarItem;
let renameStatusBarItem: vscode.StatusBarItem;
let randomStatusBarItem: vscode.StatusBarItem;

function createMdFile() {
    const rootPath = vscode.workspace.rootPath;
    const timestampFolder = path.join(rootPath, "TimeStamp");
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}.md`;
    const filePath = path.join(timestampFolder, fileName);

    if (!fs.existsSync(timestampFolder)) {
        fs.mkdirSync(timestampFolder);
    }

    fs.writeFileSync(filePath, "", "utf-8");
    vscode.window.showInformationMessage(`Created file: ${fileName}`);

    vscode.workspace.openTextDocument(filePath).then((document) => {
        vscode.window.showTextDocument(document);
    });
}

function openRandomMdFile() {
    const mdFiles = vscode.workspace.findFiles("**/*.md", null, 100000);
    mdFiles.then((files) => {
        if (files.length > 0) {
            // Filter out already opened documents
            const visibleEditors = vscode.window.visibleTextEditors;
            const visibleDocuments = visibleEditors.map(
                (editor) => editor.document
            );
            const unopenedFiles = files.filter((file) => {
                return !visibleDocuments.some(
                    (document) => document.uri.fsPath === file.fsPath
                );
            });

            if (unopenedFiles.length > 0) {
                const randomIndex = Math.floor(
                    Math.random() * unopenedFiles.length
                );
                const randomFile = unopenedFiles[randomIndex];
                vscode.workspace
                    .openTextDocument(randomFile)
                    .then((document) => {
                        vscode.window.showTextDocument(document);
                    });
            } else {
                vscode.window.showInformationMessage(
                    "All .md files are already open in the workspace."
                );
            }
        } else {
            vscode.window.showInformationMessage(
                "No .md files found in the workspace."
            );
        }
    });
}

function renameMdFiles() {
    const rootPath = vscode.workspace.rootPath;
    const timestampFolder = path.join(rootPath, "TimeStamp");

    if (fs.existsSync(timestampFolder)) {
        const files = fs.readdirSync(timestampFolder);

        files.forEach((file: any) => {
            const filePath = path.join(timestampFolder, file);

            if (
                fs.statSync(filePath).isFile() &&
                path.extname(filePath) === ".md"
            ) {
                const fileContent = fs.readFileSync(filePath, "utf-8");
                // const lines = fileContent.split("\n");
                // https://github.com/microsoft/vscode/issues/127455
                const lines = fileContent.split(os.EOL); // 使用正确的行终止符

                if (lines.length > 0 && lines[0].startsWith("# ")) {
                    const title = lines[0].substring(2).trim();
                    const newFileName = sanitizeFileName(title) + ".md";
                    const newFilePath = path.join(timestampFolder, newFileName);

                    fs.renameSync(filePath, newFilePath);
                    vscode.window.showInformationMessage(
                        `Renamed file: ${file} to ${newFileName}`
                    );
                }
            }
        });
    } else {
        vscode.window.showInformationMessage("TimeStamp folder not found.");
    }
}

function sanitizeFileName(title: any) {
    const invalidChars = /[<>:"/\\|?*]/g;
    const sanitizedTitle = title.replace(invalidChars, "_");
    return sanitizedTitle;
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let createMdFileCommandId = "extension.createMdFile";
    let renameMdFilesCommandId = "extension.renameMdFiles";
    let openRandomMdFileCommandId = "extension.openRandomMdFile";

    const renameMdFilesDispose = vscode.commands.registerCommand(
        renameMdFilesCommandId,
        renameMdFiles
    );

    const createMdFileDispose = vscode.commands.registerCommand(
        createMdFileCommandId,
        createMdFile
    );
    const openRandomMdFileDispose = vscode.commands.registerCommand(
        openRandomMdFileCommandId,
        openRandomMdFile
    );

    context.subscriptions.push(
        createMdFileDispose,
        renameMdFilesDispose,
        openRandomMdFileDispose
    );

    // --------------------------------------------------------------
    // 创建状态栏按钮
    createStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        10000
    );
    createStatusBarItem.text = "快速创建";
    createStatusBarItem.command = createMdFileCommandId;
    context.subscriptions.push(createStatusBarItem);
    createStatusBarItem.show();

    randomStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        10000
    );
    randomStatusBarItem.text = "随机打开";
    randomStatusBarItem.command = openRandomMdFileCommandId;
    context.subscriptions.push(randomStatusBarItem);
    randomStatusBarItem.show();

    renameStatusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        10000
    );
    renameStatusBarItem.text = "自动命名";
    renameStatusBarItem.command = renameMdFilesCommandId;
    context.subscriptions.push(renameStatusBarItem);
    renameStatusBarItem.show();
}

// This method is called when your extension is deactivated
export function deactivate() {
    if (createStatusBarItem) {
        createStatusBarItem.dispose();
    }
}
