export function fixTitle(title: string) {
  const blacklist = ["official", "original", "lyric", "video"];
  const pattern = blacklist.join("|");
  const regex = new RegExp(`[\\(\\[].*?(${pattern}).*?[\\)\\]]`, "gi");
  const words = title.replace(regex, "").split(" ");
  return words.map(w => w.trim()).filter(w => w.length).join(" ");
}
