import { createTheme } from '@sjsf/form';

import { definitions } from './definitions';

export * from './context';

export * as components from './components/exports';
export * as widgets from './widgets/exports';

export const theme = createTheme(definitions);
