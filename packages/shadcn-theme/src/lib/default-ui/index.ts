import type { Component } from 'svelte';
import type { HTMLButtonAttributes } from 'svelte/elements';

import type { ThemeComponents } from '../theme';

import { Button } from './button';
import { Calendar } from './calendar';
import { Checkbox } from './checkbox';
import { Input } from './input';
import { Label } from './label';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger } from './select';
import { Slider } from './slider';
import { Switch } from './switch';
import { Textarea } from './textarea';

export const components: ThemeComponents = {
	Button: Button as Component<HTMLButtonAttributes>,
	Calendar,
	Checkbox,
	Input,
	Label,
	Popover,
	PopoverTrigger,
	PopoverContent,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectTrigger,
	SelectContent,
	SelectItem,
	Slider,
	Switch,
	Textarea
};
