import fs from 'fs';
import path from 'path';

const localesDir = path.resolve('public/locales');
const languages = ['en','zh','ru'];
const namespaces = ['common','global','home','map-combo','data-editor'];

function flatten(obj, prefix = '') {
  const res = {};
  for (const [key, val] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(res, flatten(val, newKey));
    } else {
      res[newKey] = val;
    }
  }
  return res;
}

function loadJson(language, ns) {
  const file = path.join(localesDir, language, `${ns}.json`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function compare() {
  const enMaps = {};
  for (const ns of namespaces) {
    enMaps[ns] = flatten(loadJson('en', ns));
  }
  for (const lang of languages.filter(l=>l!=='en')) {
    const missing = [];
    const emptyVals = [];
    for (const ns of namespaces) {
      const target = flatten(loadJson(lang, ns));
      const enMap = enMaps[ns];
      for (const key of Object.keys(enMap)) {
        if (!(key in target)) missing.push(`${lang}:${ns}:${key}`);
        else if (target[key] === '' || target[key] == null) emptyVals.push(`${lang}:${ns}:${key}`);
      }
    }
    console.log(`\n=== ${lang} ===`);
    console.log(`Missing keys (${missing.length}):`);
    for (const k of missing) console.log('  -', k);
    console.log(`Empty values (${emptyVals.length}):`);
    for (const k of emptyVals) console.log('  -', k);
  }
}

compare();