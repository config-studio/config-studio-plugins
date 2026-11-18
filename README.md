# Config Studio Official Plugins Registry 🧩

Official extension registry and catalog feed for [Config Studio](https://github.com/config-studio/config-studio).

Hosted automatically via **GitHub Pages**:
- [`**Registry Endpoint**`](https://config-studio.github.io/config-studio-plugins/registry.json)
- [`**Showcase Portal**`](https://config-studio.github.io/config-studio-plugins/)

## 🚀 How it works
Config Studio synchronizes this catalog directly from GitHub Pages in real-time. When a new plugin or language pack is published, users can install it in **1 click** without needing to recompile the main Config Studio binary!

Packages (`.cspkg`) are hosted as release assets on the official GitHub Releases of each individual plugin repository. The registry contains declarative metadata, SHA-256 checksums, and direct release download endpoints with zero binary blobs stored in git.

## 📦 How to submit a Plugin to the Registry
1. Ensure your plugin follows the [Plugin Specification](https://github.com/config-studio/config-studio-plugin-docs).
2. Fork this repository.
3. Add your plugin entry to `registry.json`.
4. Create a Pull Request. Once merged, your plugin instantly appears for all Config Studio users!

## 📄 License
MIT License © 2026 Edvard Baldanov
