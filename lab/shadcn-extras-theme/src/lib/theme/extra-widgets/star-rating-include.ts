import { definitions } from '../definitions.js';

import StarRating from './star-rating.svelte';
import './star-rating.svelte';

declare module '../definitions.js' {
	interface ExtraWidgets {
		shadcnExtrasStarRatingWidget: {};
	}
}

definitions.shadcnExtrasStarRatingWidget = StarRating;
