import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Script } from 'node:vm';
import { HtmlValidate } from 'html-validate';
import { parse as parseCss } from 'css-tree';
import { ROOT, expandSnippet, loadAll, toVsCodeJson } from './lib.mjs';

// The presets leave some a11y rules off, so turn them on explicitly:
// every control needs a label, and every for / aria-labelledby /
// aria-describedby / aria-controls must point at a real id.
const strictRules = {
	'input-missing-label': 'error',
	'no-missing-references': 'error',
	'no-dup-id': 'error',
	'valid-id': 'error',
	'unique-landmark': 'error',
};
const validator = new HtmlValidate({
	extends: ['html-validate:recommended', 'html-validate:a11y'],
	rules: { ...strictRules, 'heading-level': 'error' },
});
// Fragments are pasted into a larger page, so document-level rules don't apply.
const fragmentValidator = new HtmlValidate({
	extends: ['html-validate:recommended', 'html-validate:a11y'],
	rules: { ...strictRules, 'missing-doctype': 'off', 'heading-level': 'off' },
});

const failures = [];
let checked = 0;

for (const { kind, output, snippets } of loadAll()) {
	// The committed JSON must match the source (run `npm run build` after editing src/).
	const built = JSON.parse(readFileSync(join(ROOT, output), 'utf8'));
	if (JSON.stringify(built) !== JSON.stringify(toVsCodeJson(snippets))) {
		failures.push(`${output} is out of date; run npm run build`);
	}

	for (const snippet of snippets) {
		checked += 1;
		const label = `${snippet.prefix[0]} (${snippet.title})`;
		let code;
		try {
			// An empty final tabstop leaves only indentation on its line; drop it.
			code = expandSnippet(snippet.body).replace(/[ \t]+$/gm, '');
		} catch (error) {
			failures.push(`${label}: ${error.message}`);
			continue;
		}

		if (kind === 'html') {
			const isDocument = code.startsWith('<!DOCTYPE');
			const report = await (isDocument ? validator : fragmentValidator).validateString(code);
			for (const result of report.results) {
				for (const m of result.messages) {
					failures.push(`${label}: [${m.ruleId}] ${m.message} (line ${m.line})`);
				}
			}
		}

		if (kind === 'css') {
			const errors = [];
			parseCss(code, { onParseError: (error) => errors.push(error.formattedMessage ?? error.message) });
			errors.forEach((e) => failures.push(`${label}: CSS ${e}`));
		}

		if (kind === 'js') {
			try {
				new Script(code);
			} catch (error) {
				failures.push(`${label}: JS ${error.message}`);
			}
		}
	}
}

if (failures.length) {
	console.error(failures.join('\n'));
	console.error(`\n${failures.length} problem(s) in ${checked} snippets`);
	process.exit(1);
}
console.log(`All ${checked} snippets expand and validate`);
