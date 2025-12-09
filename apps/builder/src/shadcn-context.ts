import { setThemeContext } from "@sjsf/shadcn4-theme";

import { Button } from "$lib/components/ui/button/index.js";
import { Checkbox } from "$lib/components/ui/checkbox/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "$lib/components/ui/select/index.js";
import { Textarea } from "$lib/components/ui/textarea/index.js";
import {
  RadioGroup,
  RadioGroupItem,
} from "$lib/components/ui/radio-group/index.js";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "$lib/components/ui/command/index.js";
import { Calendar } from "$lib/components/ui/calendar/index.js";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "$lib/components/ui/toggle-group/index.js";
import { Slider } from "$lib/components/ui/slider/index.js";
import { Switch } from "$lib/components/ui/switch/index.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "$lib/components/ui/popover/index.js";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldTitle,
  FieldSet,
} from "$lib/components/ui/field/index.js";
import { ButtonGroup } from '$lib/components/ui/button-group/index.js'
import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js'

export function setShadcnContext() {
  setThemeContext({
    components: {
      RangeCalendar,
      ButtonGroup,
      Field,
      FieldLabel,
      FieldError,
      FieldDescription,
      FieldGroup,
      FieldLegend,
      FieldTitle,
      FieldSet,
      Button,
      Checkbox,
      Input,
      Select,
      SelectContent,
      SelectItem,
      SelectTrigger,
      Textarea,
      RadioGroup,
      RadioGroupItem,
      Command,
      CommandEmpty,
      CommandGroup,
      CommandInput,
      CommandItem,
      CommandList,
      Calendar,
      ToggleGroup,
      ToggleGroupItem,
      Slider,
      Switch,
      Popover,
      PopoverContent,
      PopoverTrigger,
    },
  });
}
