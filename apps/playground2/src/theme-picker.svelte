<script lang="ts">
  let { theme = $bindable() }: { theme: "system" | "light" | "dark" } = $props();

  function updateTheme() {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
</script>

<select
  bind:value={theme}
  onchange={() => {
    if (theme === "system") {
      localStorage.removeItem("theme");
    } else {
      localStorage.theme = theme;
    }
    updateTheme();
  }}
>
  <option value="system">System</option>
  <option value="light">Light</option>
  <option value="dark">Dark</option>
</select>
