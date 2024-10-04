export function makeHandler(
  fn: () => void
) {
  return (e: Event) => {
    e.preventDefault();
    fn();
  };
}
