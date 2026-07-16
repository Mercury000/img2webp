import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

let sharp: any;
try {
  sharp = require('sharp');
} catch (e) {
  // sharp will be undefined, handled below
}

const SUPPORTED_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.tif', '.avif'
]);

function getQuality(): number {
  const config = vscode.workspace.getConfiguration('img2webp');
  return config.get<number>('quality', 75);
}

export function activate(context: vscode.ExtensionContext) {
  if (!sharp) {
    vscode.window.showErrorMessage('img2webp: 加载 sharp 模块失败，请尝试重新安装扩展。');
    return;
  }

  const convertCommand = vscode.commands.registerCommand(
    'img2webp.convert',
    async (uri?: vscode.Uri) => {
      if (!uri) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          uri = editor.document.uri;
        }
      }

      if (!uri) {
        vscode.window.showErrorMessage('未选中图片文件。');
        return;
      }

      const ext = path.extname(uri.fsPath).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.has(ext)) {
        vscode.window.showErrorMessage(`不支持的图片格式: ${ext}`);
        return;
      }

      const outputPath = uri.fsPath.replace(/\.[^.]+$/, '.webp');

      if (fs.existsSync(outputPath)) {
        const overwrite = await vscode.window.showWarningMessage(
          `文件 ${path.basename(outputPath)} 已存在，是否覆盖？`,
          '覆盖',
          '取消'
        );
        if (overwrite !== '覆盖') {
          return;
        }
      }

      const quality = getQuality();

      try {
        await vscode.window.withProgress(
          {
            location: vscode.ProgressLocation.Notification,
            title: `正在转换为 WebP（质量: ${quality}）`,
            cancellable: false,
          },
          async (progress) => {
            progress.report({ message: '读取图片...' });
            const inputBuffer = fs.readFileSync(uri!.fsPath);

            progress.report({ message: '转换中...', increment: 30 });
            const webpBuffer = await sharp(inputBuffer)
              .webp({ quality })
              .toBuffer();

            progress.report({ message: '写入文件...', increment: 60 });
            fs.writeFileSync(outputPath, webpBuffer);

            progress.report({ message: '删除原图...', increment: 90 });
            fs.unlinkSync(uri!.fsPath);

            progress.report({ message: '完成！', increment: 100 });
          }
        );

        vscode.window.showInformationMessage(
          `已转换 ${path.basename(uri!.fsPath)} → ${path.basename(outputPath)}（质量: ${quality}）`
        );
      } catch (err: any) {
        vscode.window.showErrorMessage(`转换失败: ${err.message}`);
      }
    }
  );

  context.subscriptions.push(convertCommand);
}

export function deactivate() {}
