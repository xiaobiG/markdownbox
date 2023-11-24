// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const fs = require("fs");
    const path = require("path");

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
        const workspacePath = vscode.workspace.rootPath;
        const mdFiles = vscode.workspace.findFiles("**/*.md", null, 1);
        mdFiles.then((files) => {
            if (files.length > 0) {
                const randomIndex = Math.floor(Math.random() * files.length);
                const randomFile = files[randomIndex];
                vscode.workspace
                    .openTextDocument(randomFile)
                    .then((document) => {
                        vscode.window.showTextDocument(document);
                    });
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
                    const lines = fileContent.split("\n");

                    if (lines.length > 0 && lines[0].startsWith("# ")) {
                        const title = lines[0].substring(2).trim();
                        const newFileName = sanitizeFileName(title) + ".md";
                        const newFilePath = path.join(
                            timestampFolder,
                            newFileName
                        );

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

    const renameMdFilesCommand = vscode.commands.registerCommand(
        "extension.renameMdFiles",
        renameMdFiles
    );
    context.subscriptions.push(renameMdFilesCommand);

    const createMdFileCommand = vscode.commands.registerCommand(
        "extension.createMdFile",
        createMdFile
    );
    const openRandomMdFileCommand = vscode.commands.registerCommand(
        "extension.openRandomMdFile",
        openRandomMdFile
    );

    context.subscriptions.push(createMdFileCommand, openRandomMdFileCommand);
}

// This method is called when your extension is deactivated
export function deactivate() {}
