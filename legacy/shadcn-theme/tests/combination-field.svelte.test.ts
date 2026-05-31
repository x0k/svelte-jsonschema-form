import { describe } from 'vitest';
import { expect } from 'vitest';
import { combinationFieldTests } from 'theme-testing/fields/combination-field-tests';
import { page, userEvent, type Locator } from 'vitest/browser';

import * as defaultUi from '../src/lib/default-ui/index.js';
import * as newYorkUi from '../src/lib/new-york-ui/index.js';
import { THEME_CONTEXT } from '../src/lib/theme/internal.js';
import { theme } from '../src/lib/theme/index.js';

async function selectOption(locator: Locator, label: string) {
	await userEvent.click(locator.getByRole('button').first());
	await userEvent.click(page.getByRole('option', { name: label }).first());
}

async function assertSelectedOption(locator: Locator, label: string) {
	const button = locator.getByRole('button').first();
	await expect.element(button).toBeInTheDocument();
	expect(button.element().textContent).toContain(label);
}

async function assertOptionLabels(locator: Locator, labels: string[]) {
	await userEvent.click(locator.getByRole('button').first());
	for (const label of labels) {
		await expect.element(page.getByRole('option', { name: label }).first()).toBeInTheDocument();
	}
	await userEvent.keyboard('{Escape}');
}

const testOptions = {
	selectOption,
	assertSelectedOption,
	assertOptionLabels
};

describe('default-ui', () => {
	combinationFieldTests(theme, {
		...testOptions,
		context: new Map([[THEME_CONTEXT, { components: defaultUi }]])
	});
});

describe('new-york-ui', () => {
	combinationFieldTests(theme, {
		...testOptions,
		context: new Map([[THEME_CONTEXT, { components: newYorkUi }]])
	});
});
