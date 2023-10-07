/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import "client-only";

type FeatureOption = "yes" | "no" | 1 | 0;

type WindowFeatures = {
  popup?: FeatureOption,
  fullscreen?: FeatureOption,
  location?: FeatureOption,
  menubar?: FeatureOption,
  resizable?: FeatureOption,
  scrollbars?: FeatureOption,
  status?: FeatureOption,
  titlebar?: FeatureOption,
  toolbar?: FeatureOption,
};

export function openCentered(url: string, target: string, width: number, height: number, features: WindowFeatures) {
  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  const windowWidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const windowHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const originX = dualScreenLeft + (windowWidth / 2);
  const originY = dualScreenTop + (windowHeight / 2);

  const left = originX - (width / 2);
  const top = originY - (height / 2);

  const specs = Object.entries({
    ...features, width, height, top, left,
  }).map(([key, value]) => key + "=" + value);

  const newWin = window.open(url, target, specs.join(","));

  if (window.focus !== undefined && newWin) newWin.focus();

  if (!newWin || newWin.closed || typeof newWin.closed == "undefined") {
    throw new Error("POPUP BLOCKED");
  }

  return newWin;
}

export function idealHeight() {
  const height = window.screen.height;
  if (height > 900) {
    return 900;
  }
  if (height > 800) {
    return 700;
  }
  return 600;
}
