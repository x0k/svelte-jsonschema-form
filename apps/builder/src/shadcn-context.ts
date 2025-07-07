import { setThemeContext } from "@sjsf/shadcn4-theme";

import { Button } from "$lib/components/ui/button/index.js";
import { Checkbox } from "$lib/components/ui/checkbox/index.js";
import { Input } from "$lib/components/ui/input/index.js";
import { Label } from "$lib/components/ui/label/index.js";
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

export function setShadcnContext() {
  setThemeContext({
    components: {
      Button,
      Checkbox,
      Input,
      Label,
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
      // @ts-ignore ???
      Popover,
      PopoverContent,
      PopoverTrigger,
    },
  });
}
