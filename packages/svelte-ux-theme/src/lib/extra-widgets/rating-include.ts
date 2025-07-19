import { definitions } from '../definitions.js'

import Rating from './rating.svelte'
import './rating.svelte'

declare module "../definitions.js" {
  interface ExtraWidgets {
    ratingWidget: {}
  }
}

definitions.ratingWidget = Rating
