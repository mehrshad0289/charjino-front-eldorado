import { startNavProgress } from "./lib/nav-progress";

export function onRouterTransitionStart() {
  startNavProgress();
}
