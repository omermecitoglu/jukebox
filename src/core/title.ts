export function fixTitle(title: string) {
  return title.replace(/(\([^)]+\)|\[[^\]]+\])/gi, "").trim();
}
