// Handles logging out the user when the tab/window is actually closed.
// We provide a small API:
// - setupLogOutOnClose(store) -> installs listeners and returns a cleanup function
// - markInternalNavigation() -> call this from in-app navigation handlers to avoid
//   treating an internal navigation as a tab close.

import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase_config";
import { logOut } from "../store/authSlice";

let _ignoreNextUnload = false;

export function markInternalNavigation() {
  // Briefly ignore the next unload event.
  _ignoreNextUnload = true;
  // Reset after a short delay — enough to let navigation happen
  setTimeout(() => (_ignoreNextUnload = false), 200);
}

export function setupLogOutOnClose(store) {
  if (!store || typeof store.dispatch !== "function") return () => {};

  const dispatch = store.dispatch;

  const handleBeforeUnload = (event) => {
    // If internal navigation flagged recently, skip logout.
    if (_ignoreNextUnload) return;

    // Try to sign out. Note: asynchronous signOut may not complete before unload,
    // but calling it ensures auth state will be reset where possible.
    try {
      // Dispatch Redux state update so UI reacts immediately (if the page isn't yet unloading)
      dispatch(logOut());
      // Attempt to sign out from Firebase
      signOut(auth).catch(() => {
        /* ignore errors during unload */
      });
    } catch (e) {
      console.error("Error during logout on close:", e);
      // swallow errors during unload
    }
    // No need to call preventDefault; we only want to perform signOut work.
  };

  const handlePageHide = (event) => {
    if (_ignoreNextUnload) return;
    try {
      dispatch(logOut());
      // Best-effort: signOut is async
      signOut(auth).catch(() => {});
    } catch (e) {}
  };

  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("pagehide", handlePageHide);

  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
    window.removeEventListener("pagehide", handlePageHide);
  };
}

export default setupLogOutOnClose;
