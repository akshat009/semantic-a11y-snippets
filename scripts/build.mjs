import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { ALIASES, ROOT, loadAll, toVsCodeJson } from './lib.mjs';

const sets = loadAll();

// Prefixes must be unique across every file, and follow the a11y- scheme.
const seen = new Map();
for (const { snippets, source } of sets) {
	for (const { prefix, title } of snippets) {
		for (const p of prefix) {
			if (seen.has(p)) throw new Error(`Prefix "${p}" used by "${seen.get(p)}" and "${title}"`);
			if (!p.startsWith('a11y-') && !ALIASES.has(p)) throw new Error(`${source}: prefix "${p}" should start with a11y-`);
			seen.set(p, title);
		}
	}
}

// 1. Snippet JSON files.
for (const { output, snippets } of sets) {
	const file = join(ROOT, output);
	mkdirSync(dirname(file), { recursive: true });
	writeFileSync(file, `${JSON.stringify(toVsCodeJson(snippets), null, '\t')}\n`);
}

// 2. package.json snippet contributions.
const pkgPath = join(ROOT, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
pkg.contributes = {
	...pkg.contributes,
	snippets: sets.flatMap(({ output, languages }) => languages.map((language) => ({ language, path: `./${output}` }))),
};
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, '\t')}\n`);

// 3. README snippet reference, between markers.
const languageLabel = { html: 'HTML and PHP files', css: 'CSS, SCSS and Less files', js: 'JavaScript files' };
const escape = (text) => text.replace(/\|/g, '\\|');
let table = '';
for (const { kind, snippets } of sets) {
	const groups = [...new Set(snippets.map((s) => s.group))];
	for (const group of groups) {
		table += `### ${group}\n\n_Available in ${languageLabel[kind]}._\n\n| Prefix | Inserts |\n| --- | --- |\n`;
		for (const s of snippets.filter((item) => item.group === group)) {
			table += `| ${s.prefix.map((p) => `\`${p}\``).join(' ')} | **${escape(s.title)}**: ${escape(s.description)} |\n`;
		}
		table += '\n';
	}
}
const readmePath = join(ROOT, 'README.md');
const readme = readFileSync(readmePath, 'utf8');
const start = '<!-- snippets:start -->';
const end = '<!-- snippets:end -->';
if (!readme.includes(start) || !readme.includes(end)) throw new Error('README is missing the snippet markers');
const total = sets.reduce((sum, set) => sum + set.snippets.length, 0);
writeFileSync(
	readmePath,
	readme
		.replace(new RegExp(`${start}[\\s\\S]*${end}`), `${start}\n\n${table.trimEnd()}\n\n${end}`)
		.replace(/<!-- count -->\d*<!-- \/count -->/g, `<!-- count -->${total}<!-- /count -->`),
);

console.log(`Built ${total} snippets: ${sets.map((s) => `${s.snippets.length} ${s.kind}`).join(', ')}`);
