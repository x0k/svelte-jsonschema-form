import * as ts from 'typescript';

interface StateNode {
  name: string;
  type: 'option' | 'internal' | 'public';
  reactiveType?: 'derived' | 'derived.by' | 'state' | 'constant';
  dependencies: Set<string>;
  isComplex?: boolean;
  importance?: number; // 0-3 scale for edge filtering
}

interface FlowAnalysis {
  nodes: Map<string, StateNode>;
  optionNodes: string[];
  internalNodes: string[];
  publicNodes: string[];
  optionUsage: Map<string, Set<string>>; // option -> internal nodes using it
}

interface FlowchartOptions {
  collapseComplex?: boolean;
  showReactiveTypes?: boolean;
  groupByType?: boolean;
  maxEdges?: number;
  collapseLevel?: 'none' | 'medium' | 'aggressive';
  hideInternals?: boolean;
  maxOptionsShown?: number;
  maxInternalsShown?: number;
  showPublicFlow?: boolean; // New option to show internal -> public flow
}

export class FormFlowAnalyzer {
  private sourceFile: ts.SourceFile;
  private analysis: FlowAnalysis = {
    nodes: new Map(),
    optionNodes: [],
    internalNodes: [],
    publicNodes: [],
    optionUsage: new Map()
  };

  constructor(sourceCode: string) {
    this.sourceFile = ts.createSourceFile(
      'form.ts',
      sourceCode,
      ts.ScriptTarget.Latest,
      true
    );
  }

  analyze(): FlowAnalysis {
    this.analyzeSourceFile();
    this.deduplicateNodes();
    this.cleanupDependencies();
    this.calculateImportance();
    this.buildOptionUsage();
    return this.analysis;
  }

  private analyzeSourceFile() {
    const visit = (node: ts.Node) => {
      if (ts.isFunctionDeclaration(node) && node.name?.text === 'createForm') {
        this.analyzeCreateFormFunction(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(this.sourceFile);
  }

  private analyzeCreateFormFunction(func: ts.FunctionDeclaration) {
    const params = func.parameters;
    
    if (params.length > 0) {
      this.extractOptionsProperties(params[0]);
    }

    if (func.body && ts.isBlock(func.body)) {
      this.analyzeBlockStatement(func.body);
    }
  }

  private extractOptionsProperties(param: ts.ParameterDeclaration) {
    const type = param.type;
    if (!type) return;

    if (ts.isTypeReferenceNode(type)) {
      const typeName = type.typeName;
      if (ts.isIdentifier(typeName) && typeName.text === 'FormOptions') {
        this.findAndExtractInterfaceProperties('FormOptions');
      }
    }
  }

  private findAndExtractInterfaceProperties(interfaceName: string) {
    const visit = (node: ts.Node) => {
      if (ts.isInterfaceDeclaration(node) && node.name.text === interfaceName) {
        node.members.forEach(member => {
          if (ts.isPropertySignature(member) && ts.isIdentifier(member.name)) {
            const optionName = member.name.text;
            this.analysis.nodes.set(optionName, {
              name: optionName,
              type: 'option',
              dependencies: new Set()
            });
            this.analysis.optionNodes.push(optionName);
          }
        });
      }
      ts.forEachChild(node, visit);
    };
    visit(this.sourceFile);
  }

  private analyzeBlockStatement(block: ts.Block) {
    block.statements.forEach(statement => {
      if (ts.isVariableStatement(statement)) {
        statement.declarationList.declarations.forEach(decl => {
          if (ts.isIdentifier(decl.name)) {
            const varName = decl.name.text;
            const reactiveType = this.getReactiveType(decl);
            const deps = this.extractDependencies(decl);

            this.analysis.nodes.set(varName, {
              name: varName,
              type: 'internal',
              reactiveType,
              dependencies: deps,
              isComplex: this.isComplexNode(decl)
            });
            this.analysis.internalNodes.push(varName);
          }
        });
      }

      if (ts.isFunctionDeclaration(statement) && statement.name) {
        const funcName = statement.name.text;
        const deps = this.extractFunctionDependencies(statement);
        
        this.analysis.nodes.set(funcName, {
          name: funcName,
          type: 'internal',
          reactiveType: 'constant',
          dependencies: deps,
          isComplex: true
        });
        this.analysis.internalNodes.push(funcName);
      }

      if (ts.isReturnStatement(statement) && statement.expression) {
        if (ts.isObjectLiteralExpression(statement.expression)) {
          this.analyzePublicState(statement.expression);
        }
      }

      if (ts.isVariableStatement(statement)) {
        statement.declarationList.declarations.forEach(decl => {
          if (ts.isIdentifier(decl.name) && 
              decl.name.text === 'formState' && 
              decl.initializer &&
              ts.isObjectLiteralExpression(decl.initializer)) {
            this.analyzePublicState(decl.initializer);
          }
        });
      }
    });
  }

  private getReactiveType(decl: ts.VariableDeclaration): StateNode['reactiveType'] {
    if (!decl.initializer) return 'constant';
    const text = decl.initializer.getText(this.sourceFile);
    if (text.includes('$derived.by(')) return 'derived.by';
    if (text.includes('$derived(')) return 'derived';
    if (text.includes('$state(')) return 'state';
    return 'constant';
  }

  private extractDependencies(decl: ts.VariableDeclaration): Set<string> {
    const deps = new Set<string>();
    if (!decl.initializer) return deps;

    const visit = (node: ts.Node) => {
      if (ts.isPropertyAccessExpression(node)) {
        if (ts.isIdentifier(node.expression) && node.expression.text === 'options') {
          if (ts.isIdentifier(node.name)) {
            deps.add(`options.${node.name.text}`);
          }
        }
      } else if (ts.isIdentifier(node)) {
        const name = node.text;
        if (this.analysis.nodes.has(name)) {
          deps.add(name);
        }
      }
      ts.forEachChild(node, visit);
    };

    visit(decl.initializer);
    return deps;
  }

  private extractFunctionDependencies(func: ts.FunctionDeclaration): Set<string> {
    const deps = new Set<string>();
    if (!func.body) return deps;

    const visit = (node: ts.Node) => {
      if (ts.isIdentifier(node)) {
        const name = node.text;
        if (this.analysis.nodes.has(name)) {
          deps.add(name);
        }
      }
      ts.forEachChild(node, visit);
    };

    visit(func.body);
    return deps;
  }

  private isComplexNode(decl: ts.VariableDeclaration): boolean {
    if (!decl.initializer) return false;
    const text = decl.initializer.getText(this.sourceFile);
    return text.length > 200 || 
           text.includes('createTask') ||
           (text.includes('=>') && text.includes('{'));
  }

  private analyzePublicState(objLiteral: ts.ObjectLiteralExpression) {
    objLiteral.properties.forEach(prop => {
      if ((ts.isPropertyAssignment(prop) || 
           ts.isShorthandPropertyAssignment(prop) ||
           ts.isGetAccessor(prop) ||
           ts.isMethodDeclaration(prop)) && 
          ts.isIdentifier(prop.name)) {
        
        const publicName = prop.name.text;
        const deps = new Set<string>();

        const visit = (node: ts.Node) => {
          if (ts.isIdentifier(node)) {
            const name = node.text;
            if (this.analysis.nodes.has(name)) {
              deps.add(name);
            }
          }
          ts.forEachChild(node, visit);
        };

        if (ts.isPropertyAssignment(prop) && prop.initializer) {
          visit(prop.initializer);
        } else if (ts.isGetAccessor(prop) && prop.body) {
          visit(prop.body);
        } else if (ts.isMethodDeclaration(prop) && prop.body) {
          visit(prop.body);
        } else if (ts.isShorthandPropertyAssignment(prop)) {
          deps.add(publicName);
        }

        this.analysis.nodes.set(publicName, {
          name: publicName,
          type: 'public',
          dependencies: deps
        });
        this.analysis.publicNodes.push(publicName);
      }
    });
  }

  private calculateImportance() {
    this.analysis.nodes.forEach(node => {
      let importance = 0;
      
      // Public nodes are most important
      if (node.type === 'public') importance = 3;
      // Options are important
      else if (node.type === 'option') importance = 2;
      // Internal nodes that are also in public API
      else if (node.type === 'internal' && this.analysis.publicNodes.includes(node.name)) {
        importance = 3;
      }
      // Key internal nodes
      else if (['submission', 'fieldsValidation', 'validator', 'merger', 'valueRef'].includes(node.name)) {
        importance = 2;
      }
      // Other internals
      else importance = 1;
      
      node.importance = importance;
    });
  }

  private buildOptionUsage() {
    this.analysis.nodes.forEach((node, name) => {
      if (node.type === 'internal') {
        node.dependencies.forEach(dep => {
          if (dep.startsWith('options.')) {
            const optionName = dep.substring(8); // Remove 'options.'
            if (!this.analysis.optionUsage.has(optionName)) {
              this.analysis.optionUsage.set(optionName, new Set());
            }
            this.analysis.optionUsage.get(optionName)!.add(name);
          }
        });
      }
    });
  }

  private deduplicateNodes() {
    // Handle nodes with same name in different contexts
    const namesByType = new Map<string, Set<string>>();
    
    this.analysis.nodes.forEach((node, name) => {
      const key = `${name}_${node.type}`;
      if (!namesByType.has(name)) {
        namesByType.set(name, new Set());
      }
      namesByType.get(name)!.add(node.type);
    });

    // For nodes that appear in multiple types:
    // - Keep all versions if showPublicFlow will be used
    // - Only keep internal version otherwise
    namesByType.forEach((types, name) => {
      if (types.size > 1) {
        // Keep internal version primary, but don't remove from public
        // Public duplicates will be handled during rendering based on showPublicFlow option
        if (types.has('internal') && types.has('option')) {
          const optionIndex = this.analysis.optionNodes.indexOf(name);
          if (optionIndex > -1) {
            this.analysis.optionNodes.splice(optionIndex, 1);
          }
        }
      }
    });
  }

  private cleanupDependencies() {
    // Remove self-references and invalid dependencies
    this.analysis.nodes.forEach((node, name) => {
      const cleanedDeps = new Set<string>();
      
      node.dependencies.forEach(dep => {
        // Skip self-references
        if (dep === name) return;
        
        // Skip if points to same node in options form
        const optionForm = `options.${name}`;
        if (dep === optionForm && node.type === 'internal') return;
        
        // Keep valid dependencies
        if (dep.startsWith('options.') || this.analysis.nodes.has(dep)) {
          cleanedDeps.add(dep);
        }
      });
      
      node.dependencies = cleanedDeps;
    });
  }

  generateMermaidFlowchart(options: FlowchartOptions = {}): string {
    const { 
      collapseComplex = true,
      showReactiveTypes = false,
      groupByType = true,
      maxEdges = 100,
      collapseLevel = 'medium',
      hideInternals = false,
      maxOptionsShown = 50,
      maxInternalsShown = 50,
      showPublicFlow = true // Default to showing the flow
    } = options;

    let mermaid = 'flowchart LR\n';
    mermaid += '  classDef optionStyle fill:#e1f5ff,stroke:#0288d1,stroke-width:2px\n';
    mermaid += '  classDef internalStyle fill:#fff3e0,stroke:#f57c00,stroke-width:2px\n';
    mermaid += '  classDef publicStyle fill:#e8f5e9,stroke:#388e3c,stroke-width:2px\n';
    mermaid += '  classDef groupStyle fill:#f5f5f5,stroke:#9e9e9e,stroke-width:1px\n\n';

    const edges: Array<[string, string, number]> = [];
    const renderedNodes = new Set<string>();
    const internalRenderedNodes = new Set<string>(); // Track what's in Internal section

    // Collapse strategies based on level
    const shouldRenderInternal = (name: string): boolean => {
      if (hideInternals) return false;
      if (collapseLevel === 'none') return true;
      
      const node = this.analysis.nodes.get(name)!;
      
      // Always render nodes that are exposed in public API
      if (showPublicFlow && this.analysis.publicNodes.includes(name)) {
        return true;
      }
      
      if (collapseLevel === 'aggressive') {
        return node.importance! >= 2 && !node.isComplex;
      }
      return !node.isComplex || node.importance! >= 2;
    };

    // Group options with collapse
    if (collapseLevel === 'aggressive') {
      mermaid += '  OptionsGroup["📥 Options (all)"]:::groupStyle\n';
      renderedNodes.add('OptionsGroup');
    } else {
      if (groupByType) {
        mermaid += '  subgraph Options["📥 Input Options"]\n';
        const optionsToRender = this.analysis.optionNodes.slice(0, maxOptionsShown);
        optionsToRender.forEach(name => {
          // Skip if already rendered in internal (duplicate name)
          if (!this.analysis.internalNodes.includes(name)) {
            mermaid += `    ${this.sanitizeId(name)}["${name}"]\n`;
            renderedNodes.add(name);
          }
        });
        if (this.analysis.optionNodes.length > maxOptionsShown) {
          mermaid += `    OptionsMore["... ${this.analysis.optionNodes.length - maxOptionsShown} more"]:::groupStyle\n`;
          renderedNodes.add('OptionsMore');
        }
        mermaid += '  end\n\n';
      }
    }

    // Render key internal nodes
    if (!hideInternals) {
      const keyInternals = this.analysis.internalNodes.filter(shouldRenderInternal);
      
      if (keyInternals.length > 0 && groupByType) {
        mermaid += '  subgraph Internal["⚙️ Internal State"]\n';
        keyInternals.forEach(name => {
          // Skip if already rendered or is in public with same name
          if (renderedNodes.has(name)) return;
          
          const node = this.analysis.nodes.get(name)!;
          const label = showReactiveTypes && node.reactiveType 
            ? `${name}\\n[${node.reactiveType}]` 
            : name;
          mermaid += `    ${this.sanitizeId(name)}["${label}"]\n`;
          renderedNodes.add(name);
        });
        
        if (this.analysis.internalNodes.length > keyInternals.length) {
          const hiddenCount = this.analysis.internalNodes.length - keyInternals.length;
          mermaid += `    InternalMore["... ${hiddenCount} more internals"]:::groupStyle\n`;
          renderedNodes.add('InternalMore');
        }
        mermaid += '  end\n\n';
      }
    }

    // Render public API
    if (groupByType && showPublicFlow) {
      // Filter to nodes that also exist in internal (to show the flow)
      const publicNodesToRender = this.analysis.publicNodes
        .filter(name => internalRenderedNodes.has(name));
      
      if (publicNodesToRender.length > 0) {
        mermaid += '  subgraph Public["📤 Public API"]\n';
        publicNodesToRender.forEach(name => {
          const nodeId = `${name}_public`;
          mermaid += `    ${this.sanitizeId(nodeId)}["${name}"]:::publicStyle\n`;
        });
        mermaid += '  end\n\n';
        
        // Add edges from internal to public versions
        mermaid += '  %% Internal to Public Flow\n';
        publicNodesToRender.forEach(name => {
          const internalId = `${name}_internal`;
          const publicId = `${name}_public`;
          mermaid += `  ${this.sanitizeId(internalId)} -.->|"exposed"| ${this.sanitizeId(publicId)}\n`;
        });
        mermaid += '\n';
      } else {
        // Debug info
        const allPublic = this.analysis.publicNodes;
        const inInternal = allPublic.filter(n => this.analysis.internalNodes.includes(n));
        mermaid += `  %% Debug: ${allPublic.length} public nodes, ${inInternal.length} also in internal, ${internalRenderedNodes.size} tracked\n`;
        if (internalRenderedNodes.size === 0 && inInternal.length > 0) {
          mermaid += `  %% Issue: Nodes in both internal and public but not tracked: ${inInternal.join(', ')}\n`;
        }
        mermaid += '\n';
      }
    }

    // Build edges with importance scoring
    this.analysis.nodes.forEach((node, name) => {
      // For nodes with internal/public split, use the internal version as source
      const sourceName = (showPublicFlow && 
                         internalRenderedNodes.has(name) && 
                         this.analysis.publicNodes.includes(name))
        ? `${name}_internal`
        : name;
      
      if (!renderedNodes.has(name)) return;
      
      node.dependencies.forEach(dep => {
        let depName = dep;
        const targetName = sourceName;
        
        // Skip self-references
        if (depName === name || depName === targetName) return;
        
        // Handle options dependencies
        if (dep.startsWith('options.')) {
          const optionName = dep.substring(8);
          
          // Skip if option has same name as target
          if (optionName === name) return;
          
          if (collapseLevel === 'aggressive') {
            depName = 'OptionsGroup';
          } else if (renderedNodes.has(optionName)) {
            depName = optionName;
          } else if (renderedNodes.has('OptionsMore')) {
            depName = 'OptionsMore';
          } else {
            return;
          }
        } else if (!renderedNodes.has(dep)) {
          if (renderedNodes.has('InternalMore')) {
            depName = 'InternalMore';
          } else {
            return;
          }
        } else {
          // If dependency is also split into internal/public, use internal version
          if (showPublicFlow && 
              internalRenderedNodes.has(dep) && 
              this.analysis.publicNodes.includes(dep)) {
            depName = `${dep}_internal`;
          }
        }
        
        // Final check: no self-references after transformation
        if (depName === targetName) return;
        
        const sourceNode = this.analysis.nodes.get(dep.startsWith('options.') ? dep.substring(8) : dep);
        const targetNode = this.analysis.nodes.get(name);
        const importance = Math.max(
          sourceNode?.importance ?? 0,
          targetNode?.importance ?? 0
        );
        
        edges.push([depName, targetName, importance]);
      });
    });

    // Sort edges by importance and limit
    edges.sort((a, b) => b[2] - a[2]);
    
    // Deduplicate edges
    const edgeSet = new Set<string>();
    const uniqueEdges: Array<[string, string, number]> = [];
    edges.forEach(([source, target, importance]) => {
      const key = `${source}->${target}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        uniqueEdges.push([source, target, importance]);
      }
    });
    
    const limitedEdges = uniqueEdges.slice(0, maxEdges);

    mermaid += '  %% Dependencies\n';
    limitedEdges.forEach(([source, target]) => {
      mermaid += `  ${this.sanitizeId(source)} --> ${this.sanitizeId(target)}\n`;
    });

    if (uniqueEdges.length > maxEdges) {
      mermaid += `\n  %% Note: ${uniqueEdges.length - maxEdges} edges hidden\n`;
    }

    return mermaid;
  }

  private sanitizeId(name: string): string {
    return name.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  generateReport(): string {
    let report = '# Form Reactive Flow Analysis\n\n';
    
    report += `## Summary\n`;
    report += `- Options: ${this.analysis.optionNodes.length}\n`;
    report += `- Internal State: ${this.analysis.internalNodes.length}\n`;
    report += `- Public API: ${this.analysis.publicNodes.length}\n`;
    report += `- Total Potential Edges: ${this.countPotentialEdges()}\n\n`;

    report += '## Public API Nodes\n';
    if (this.analysis.publicNodes.length > 0) {
      this.analysis.publicNodes.forEach(name => {
        const isAlsoInternal = this.analysis.internalNodes.includes(name);
        const node = this.analysis.nodes.get(name);
        const importance = node?.importance ?? 0;
        const isComplex = node?.isComplex ?? false;
        report += `- **${name}**${isAlsoInternal ? ' (also in internal)' : ''}`;
        report += ` [importance: ${importance}, complex: ${isComplex}]\n`;
      });
    } else {
      report += 'No public nodes detected\n';
    }

    report += '\n## Key Internal Nodes\n';
    const keyNodes = this.analysis.internalNodes
      .filter(name => this.analysis.nodes.get(name)!.importance! >= 2)
      .slice(0, 10);
    keyNodes.forEach(name => {
      const node = this.analysis.nodes.get(name)!;
      const isPublic = this.analysis.publicNodes.includes(name);
      report += `- **${name}** [${node.reactiveType}]${isPublic ? ' (also public)' : ''}\n`;
    });

    report += '\n## Most Used Options\n';
    const topOptions = Array.from(this.analysis.optionUsage.entries())
      .sort((a, b) => b[1].size - a[1].size)
      .slice(0, 10);
    topOptions.forEach(([option, users]) => {
      report += `- **${option}**: used by ${users.size} nodes\n`;
    });

    return report;
  }

  private countPotentialEdges(): number {
    let count = 0;
    this.analysis.nodes.forEach(node => {
      count += node.dependencies.size;
    });
    return count;
  }
}

// Example usage
export function analyzeFormCode(formCode: string) {
  const analyzer = new FormFlowAnalyzer(formCode);
  analyzer.analyze();
  
  console.log(analyzer.generateReport());
  console.log('\n## Simplified Flowchart (Medium Collapse)\n');
  console.log('```mermaid');
  console.log(analyzer.generateMermaidFlowchart({
    collapseLevel: 'medium',
    maxEdges: 50,
    maxOptionsShown: 20,
    maxInternalsShown: 20,
    showReactiveTypes: false
  }));
  console.log('```');
  
  console.log('\n## Detailed Flowchart (No Collapse)\n');
  console.log('```mermaid');
  console.log(analyzer.generateMermaidFlowchart({
    collapseLevel: 'none',
    maxEdges: 400,
    maxOptionsShown: 100,  // Show all options
    maxInternalsShown: 100, // Show all internals
    showReactiveTypes: true,
    showPublicFlow: true  // Show internal -> public flow
  }));
  console.log('```');
  
  console.log('\n## High-Level Overview (Aggressive Collapse)\n');
  console.log('```mermaid');
  console.log(analyzer.generateMermaidFlowchart({
    collapseLevel: 'aggressive',
    maxEdges: 30,
    hideInternals: false
  }));
  console.log('```');
}