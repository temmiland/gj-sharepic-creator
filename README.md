<!--
  gj-sharepic-creator
  Copyright (c) 2025-2026 temmiland

  Licensed under the Affero General Public License (AGPL) Version 3.0;
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at:
    - https://gjsharepics.temmi.land/license
-->

# 🏳️‍🌈 GJ Sharepic Creator

[![License](https://img.shields.io/github/license/temmiland/gj-sharepic-creator)](./LICENSE)
[![Stars](https://img.shields.io/github/stars/temmiland/gj-sharepic-creator?style=social)](https://github.com/temmiland/gj-sharepic-creator/stargazers)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![CI](https://github.com/temmiland/gj-sharepic-creator/actions/workflows/lint-and-test.yml/badge.svg)](https://github.com/temmiland/gj-sharepic-creator/actions/workflows/lint-and-test.yml)

> A web application for **GRÜNE JUGEND Sachsen** to create on-brand sharepics and story overlays — directly in the browser, no design tools needed.

## ✨ Features

- 🎨 **Corporate Design Templates** — Ready-made templates following the GJ Sachsen brand.
- 🖼️ **Sharepic Generator** — Create social media graphics with text, images, logos, and pictograms.
- 📱 **Story Overlay Generator** — Build Instagram-style story overlays with ease.
- ✏️ **Live Editor** — Drag, resize, rotate, and style elements directly on the canvas.
- 🎭 **Color Sets & Highlights** — Switch color schemes and highlight styles with one click.
- 💾 **Template Import/Export** — Save and share your designs as JSON templates.
- ☁️ **Supabase Backend** — Persistent template sharing via URL.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/temmiland/gj-sharepic-creator.git
cd gj-sharepic-creator
```

### 2. Install dependencies

```bash
bun i
```

### 3. Start the dev server

```bash
bun run dev
```

Open [localhost:5173](http://localhost:5173) in your browser.

## 🐳 Docker

```bash
docker compose up
```

Or build manually:

```bash
docker build -f docker/Dockerfile -t gj-sharepic-creator .
```

## 🧪 Testing & Linting

```bash
bun run test       # watch mode
bun run test:run   # single run
bun run lint       # ESLint
```

## 🌐 Live App

The application is publicly available at **[gjsharepics.temmi.land](https://gjsharepics.temmi.land)**.

## 🐛 Known Issues

Open bugs can be found in the [GitHub Issues](https://github.com/temmiland/gj-sharepic-creator/labels/bug).

## 📋 Changelog

All releases are documented in [GitHub Releases](https://github.com/temmiland/gj-sharepic-creator/releases).

## 🤝 Contributing

Pull requests are welcome! If you make any changes or improvements, please open a PR to merge your changes into the upstream.

## 💚 Support

If you find this project useful:

- ⭐ Star it on GitHub
- 🐞 Report issues or suggest features
- 🔄 Share it with others

[![Buy Me A Coffee](https://raw.githubusercontent.com/temmiland/temmiland/refs/heads/main/assets/bmc-button.png)](https://www.buymeacoffee.com/temmiland)

## 📝 License

This project is licensed under the **GNU Affero General Public License v3.0**. See [LICENSE](./LICENSE) for details.
