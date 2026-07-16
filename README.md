# img2webp

VS Code 扩展 — 右键图片一键转换为 WebP 格式。

## 功能

- 在资源管理器中右键图片文件，选择「转换为 WebP」
- 使用 [sharp](https://github.com/lovell/sharp) 进行真实的 WebP 编码（非改后缀）
- 转换完成后自动删除原图
- 支持格式：PNG、JPG、JPEG、GIF、BMP、TIFF、AVIF
- 可在设置中调整输出质量（默认 75）

## 使用

1. 在 VS Code 资源管理器中右键任意图片文件
2. 点击「转换为 WebP」
3. 等待转换完成，原图自动删除

## 设置

| 设置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `img2webp.quality` | number | 75 | WebP 输出质量 (1-100) |

## 安装

### 从 VSIX 安装

```bash
code --install-extension img2webp-0.1.0.vsix
```

### 从源码构建

```bash
git clone https://github.com/Mercury/img2webp.git
cd img2webp
npm install
npm run build
npx vsce package
code --install-extension img2webp-0.1.0.vsix
```

## License

MIT
