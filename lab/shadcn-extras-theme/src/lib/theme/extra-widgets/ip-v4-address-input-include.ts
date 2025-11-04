import { definitions } from '../definitions.js';

import IpV4AddressInput from './ip-v4-address-input.svelte';
import './ip-v4-address-input.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		shadcnExtrasIPv4AddressInputWidget: {};
	}
}

definitions.shadcnExtrasIPv4AddressInputWidget = IpV4AddressInput;
