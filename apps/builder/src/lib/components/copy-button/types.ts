import type { Snippet } from 'svelte';
import type { HTMLAttributes } from 'svelte/elements';
import type { WithChildren, WithoutChildren } from 'bits-ui';

import type { ButtonProps } from '$lib/components/ui/button/button.svelte';

export type CopyButtonPropsWithoutHTML = WithChildren<
	Pick<ButtonProps, 'size' | 'variant'> & {
		ref?: HTMLButtonElement | null;
		text: () => string;
		icon?: Snippet<[]>;
		animationDuration?: number;
		onCopy?: (status: "success" | "failure" | "idle") => void;
	}
>;

export type CopyButtonProps = CopyButtonPropsWithoutHTML &
	WithoutChildren<HTMLAttributes<HTMLButtonElement>>;
