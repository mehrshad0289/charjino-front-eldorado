"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getSessionUser } from "@/actions/auth.actions";

let cachedUser = undefined;
let inflight = null;
const listeners = new Set();

function emit(next) {
  cachedUser = next;
  for (const listener of listeners) listener();
}

export function subscribeSessionUser(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function peekSessionUser() {
  if (typeof window === "undefined") return undefined;
  return cachedUser;
}

export function writeSessionUser(user) {
  if (typeof window === "undefined") return;
  inflight = null;
  emit(user ?? null);
}

export function clearSessionUser() {
  if (typeof window === "undefined") return;
  inflight = null;
  emit(null);
}

export function loadSessionUser() {
  if (typeof window === "undefined") return Promise.resolve(undefined);
  if (cachedUser !== undefined) return Promise.resolve(cachedUser);
  if (!inflight) {
    inflight = getSessionUser()
      .then((row) => {
        emit(row ?? null);
        return cachedUser;
      })
      .catch(() => {
        emit(null);
        return null;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

function getClientSnapshot() {
  return cachedUser;
}

function getServerSnapshot() {
  return undefined;
}

export function useSessionUser() {
  const snapshot = useSyncExternalStore(
    subscribeSessionUser,
    getClientSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (cachedUser === undefined) loadSessionUser();
  }, []);

  return {
    user: snapshot ?? null,
    known: snapshot !== undefined,
  };
}
