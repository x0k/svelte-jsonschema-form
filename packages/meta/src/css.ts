export interface AtRule {
  name: string;
  params: string;
}

export interface AtRuleOptions {
  nodeModulesPath: string;
  sandbox: boolean;
}

export function renderAtRule(rule: AtRule) {
  return `@${rule.name} "${rule.params}";`;
}
