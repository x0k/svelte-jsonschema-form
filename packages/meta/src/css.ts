export interface AtRule {
  name: string;
  params: string;
}

export interface AtRuleOptions {
  nodeModulesPath: string;
}

export function renderAtRule(rule: AtRule) {
  return `@${rule.name} "${rule.params}";`;
}
