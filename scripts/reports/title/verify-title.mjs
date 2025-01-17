import _lint from '@commitlint/lint';
import _load from '@commitlint/load';
import {getPullRequestTitle} from '../github-client.mjs';

/** @type {import('@commitlint/lint').default} */
const lint = _lint['default'];
/** @type {import('@commitlint/load').default} */
const load = _load['default'];

const specUrl = 'https://www.conventionalcommits.org/en/v1.0.0/#summary';

async function analyze(title) {
  const {rules, parserPreset} = await getLinterConfiguration();
  return await lint(title, rules, parserPreset || {});
}

async function getLinterConfiguration() {
  const conventionalConfig = {extends: ['@commitlint/config-conventional']};
  return await load(conventionalConfig);
}

function buildReport(isTitleValid) {
  const message = isTitleValid ? buildSuccessMessage() : buildErrorMessage();

  return `
  **PR Title**

  ${message}
  `;
}

function buildSuccessMessage() {
  return `
  :white_check_mark: Title follows the [conventional commit](${specUrl}) spec.
  `;
}

function buildErrorMessage() {
  return `
  :x: Title should follow the [conventional commit](${specUrl}) spec:
  
  <type>(optional scope): <description>

  Example:
  
  feat(headless): add result-list controller
  `;
}

export async function buildTitleReport() {
  const prTitle = (await getPullRequestTitle()) || '';
  const {valid} = await analyze(prTitle);
  const isTitleValid = prTitle && valid;

  return buildReport(isTitleValid);
}
