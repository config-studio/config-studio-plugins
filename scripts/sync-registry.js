const fs = require('fs');
const path = require('path');

function stripBOM(content) {
  if (typeof content === 'string' && content.charCodeAt(0) === 0xFEFF) {
    return content.slice(1);
  }
  return content;
}

const registryPath = path.join(__dirname, '..', 'registry.json');
const rawRegistry = stripBOM(fs.readFileSync(registryPath, 'utf8'));
const registry = JSON.parse(rawRegistry);

async function fetchJSON(url) {
  const headers = { 'User-Agent': 'ConfigStudio-RegistrySync' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  const text = stripBOM(await res.text());
  return JSON.parse(text);
}

async function sync() {
  let changed = false;
  for (const plugin of registry.plugins) {
    if (plugin.homepage && plugin.homepage.includes('github.com/')) {
      const parts = plugin.homepage.split('github.com/')[1].split('/');
      const owner = parts[0];
      const repo = parts[1];

      // Check if this plugin uses internal repository packages vs release assets
      const isInternalPackage = plugin.downloadUrl && plugin.downloadUrl.includes('/config-studio-plugins/main/packages/');

      try {
        const latestRel = await fetchJSON(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
        const latestTag = latestRel.tag_name || '';
        const cleanVersion = latestTag.replace(/^v/, '');

        if (!isInternalPackage && cleanVersion && cleanVersion !== plugin.version) {
          console.log(`[${plugin.id}] Version updated from ${plugin.version} -> ${cleanVersion}`);
          plugin.version = cleanVersion;
          changed = true;
        }

        const expectedLatestUrl = `https://github.com/${owner}/${repo}/releases/latest/download/${plugin.id}.cspkg`;
        if (!isInternalPackage && plugin.downloadUrl !== expectedLatestUrl) {
          console.log(`[${plugin.id}] Updating downloadUrl to: ${expectedLatestUrl}`);
          plugin.downloadUrl = expectedLatestUrl;
          changed = true;
        }
      } catch (err) {
        // Repository might not have releases yet (e.g. 404), keep existing configuration safely
        console.warn(`[${plugin.id}] Notice: release sync skipped (${err.message})`);
      }

      // Try to fetch latest plugin.json from main branch
      try {
        const rawManifest = await fetchJSON(`https://raw.githubusercontent.com/${owner}/${repo}/main/plugin.json`);
        if (rawManifest.name && plugin.name !== rawManifest.name) {
          console.log(`[${plugin.id}] Name updated: ${plugin.name} -> ${rawManifest.name}`);
          plugin.name = rawManifest.name;
          changed = true;
        }
        if (rawManifest.description && plugin.description !== rawManifest.description) {
          plugin.description = rawManifest.description;
          changed = true;
        }
        if (rawManifest.locales) {
          plugin.locales = rawManifest.locales;
          changed = true;
        }
      } catch (e) {
        console.warn(`[${plugin.id}] Notice: plugin.json sync:`, e.message);
      }
    }
  }

  if (changed) {
    registry.updatedAt = new Date().toISOString();
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf8');
    console.log('✓ Successfully synchronized registry.json with GitHub latest releases!');
  } else {
    console.log('registry.json is already up to date with all latest releases.');
  }
}

sync().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
