<script lang="ts">
	import { StyleFromScheme } from 'm3-svelte';
	import { ComponentsAndWidgets } from 'testing/demo'

	import { theme } from '../lib/index.js';

</script>

<StyleFromScheme
  lightScheme={{"primary":4278216820,"onPrimary":4294967295,"primaryContainer":4288606205,"onPrimaryContainer":4278210392,"inversePrimary":4286764000,"secondary":4283064935,"onSecondary":4294967295,"secondaryContainer":4291684332,"onSecondaryContainer":4281551695,"tertiary":4283588221,"onTertiary":4294967295,"tertiaryContainer":4292535039,"onTertiaryContainer":4282074724,"error":4290386458,"onError":4294967295,"errorContainer":4294957782,"onErrorContainer":4287823882,"background":4294310651,"onBackground":4279704862,"surface":4294310651,"onSurface":4279704862,"surfaceVariant":4292601062,"onSurfaceVariant":4282337354,"inverseSurface":4281020723,"inverseOnSurface":4293718771,"outline":4285495674,"outlineVariant":4290758858,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4292205532,"surfaceBright":4294310651,"surfaceContainerLowest":4294967295,"surfaceContainerLow":4293916150,"surfaceContainer":4293521392,"surfaceContainerHigh":4293126634,"surfaceContainerHighest":4292797413,"surfaceTint":4278216820}}
  darkScheme={{"primary":4286764000,"onPrimary":4278203965,"primaryContainer":4278210392,"onPrimaryContainer":4288606205,"inversePrimary":4278216820,"secondary":4289842128,"onSecondary":4280038456,"secondaryContainer":4281551695,"onSecondaryContainer":4291684332,"tertiary":4290430698,"onTertiary":4280561741,"tertiaryContainer":4282074724,"onTertiaryContainer":4292535039,"error":4294948011,"onError":4285071365,"errorContainer":4287823882,"onErrorContainer":4294957782,"background":4279112725,"onBackground":4292797413,"surface":4279112725,"onSurface":4292797413,"surfaceVariant":4282337354,"onSurfaceVariant":4290758858,"inverseSurface":4292797413,"inverseOnSurface":4281020723,"outline":4287206036,"outlineVariant":4282337354,"shadow":4278190080,"scrim":4278190080,"surfaceDim":4279112725,"surfaceBright":4281612859,"surfaceContainerLowest":4278783760,"surfaceContainerLow":4279704862,"surfaceContainer":4279968034,"surfaceContainerHigh":4280625964,"surfaceContainerHighest":4281349687,"surfaceTint":4286764000}} />

<ComponentsAndWidgets {theme} />
