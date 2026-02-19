export function redirectTo(url: string) {
  // wrapper so we can mock navigation in tests
  window.location.assign(url);
}
