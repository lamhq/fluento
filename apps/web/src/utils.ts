export function getAbsoluteURL(route: string) {
  return `${window.location.protocol}//${window.location.host}${route}`;
}
