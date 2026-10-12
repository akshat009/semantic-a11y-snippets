import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Each source file becomes one snippets JSON file, contributed to these languages. */
export const SOURCES = [
	{ kind: 'html', source: 'src/html.snippets', output: 'snippets/html.json', languages: ['html', 'php'] },
	{ kind: 'css', source: 'src/css.snippets', output: 'snippets/css.json', languages: ['css', 'scss', 'less'] },
	{ kind: 'js', source: 'src/js.snippets', output: 'snippets/javascript.json', languages: ['javascript'] },
];

/** Prefixes that don't follow the a11y- naming scheme. */
export const ALIASES = new Set(['html5s']);

/**
 * Parses the plain-text snippet format:
 *   === Group name
 *   --- Snippet title :: prefix another-prefix
 *   One-line description
 *   body lines (2-space indentation becomes tabs)
 */
export function parseSnippets(text, file) {
	const snippets = [];
	let group = null;
	let current = null;

	const finish = () => {
		if (!current) return;
		const lines = [...current.lines];
		while (lines.length && !lines[0].trim()) lines.shift();
		while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
		if (!current.description) throw new Error(`${file}: "${current.title}" has no description`);
		if (!lines.length) throw new Error(`${file}: "${current.title}" has an empty body`);
		current.body = lines.map((line) => line.replace(/^(?: {2})+/, (indent) => '\t'.repeat(indent.length / 2)));
		delete current.lines;
		snippets.push(current);
		current = null;
	};

	text.split(/\r?\n/).forEach((line, index) => {
		if (line.startsWith('=== ')) {
			finish();
			group = line.slice(4).trim();
			return;
		}
		if (line.startsWith('--- ')) {
			finish();
			const [title, prefixes] = line.slice(4).split('::').map((part) => part?.trim());
			if (!title || !prefixes) throw new Error(`${file}:${index + 1}: expected "--- Title :: prefix"`);
			current = { group, title, prefix: prefixes.split(/\s+/), description: null, lines: [] };
			return;
		}
		if (!current) {
			if (line.trim()) throw new Error(`${file}:${index + 1}: text outside a snippet`);
			return;
		}
		if (current.description === null) {
			current.description = line.trim();
			return;
		}
		current.lines.push(line);
	});
	finish();
	return snippets;
}

export function loadAll() {
	return SOURCES.map((config) => ({
		...config,
		snippets: parseSnippets(readFileSync(join(ROOT, config.source), 'utf8'), config.source),
	}));
}

export function toVsCodeJson(snippets) {
	const out = {};
	for (const { title, prefix, body, description } of snippets) {
		out[title] = { prefix: prefix.length === 1 ? prefix[0] : prefix, body, description };
	}
	return out;
}

const SAMPLE_VARIABLES = {
	CURRENT_YEAR: '2026',
	CURRENT_MONTH: '10',
	CURRENT_DATE: '12',
	CURRENT_MONTH_NAME: 'October',
};

/**
 * Expands a snippet body the way VS Code would if the user accepted every default:
 * placeholders take their default, choices take the first option, mirrors copy
 * their tabstop, and empty tabstops ($0, $1) disappear.
 */
export function expandSnippet(body) {
	let text = body.join('\n').replace(/\t/g, '  ');

	text = text.replace(/\$\{([A-Z_]+)\}|\$([A-Z_]+)/g, (_, braced, bare) => {
		const name = braced || bare;
		if (!(name in SAMPLE_VARIABLES)) throw new Error(`Unknown snippet variable ${name}`);
		return SAMPLE_VARIABLES[name];
	});

	const defaults = new Map();
	const record = (n, value) => {
		if (defaults.has(n) && defaults.get(n) !== value) {
			throw new Error(`Tabstop ${n} has two different defaults: "${defaults.get(n)}" and "${value}"`);
		}
		defaults.set(n, value);
		return value;
	};

	let previous;
	do {
		previous = text;
		text = text
			.replace(/\$\{(\d+)\|([^|]*)\|\}/g, (_, n, choices) => record(n, choices.split(',')[0]))
			.replace(/\$\{(\d+):([^${}]*)\}/g, (_, n, value) => record(n, value));
	} while (text !== previous);

	text = text.replace(/\$\{(\d+)\}|\$(\d+)/g, (_, braced, bare) => defaults.get(braced || bare) ?? '');

	if (/\$\{/.test(text)) throw new Error(`Unexpanded snippet syntax in:\n${text}`);
	return text.replace(/\\([$}\\])/g, '$1');
}
