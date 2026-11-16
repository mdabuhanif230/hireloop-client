"use client"

import * as React from "react"

/** Minimal fetch layer for the seeker dashboard: every page owns its query
 *  string, so `path` changing is what re-runs the request. No caching library
 *  here on purpose — the endpoints are cheap and the UI needs refetch-after-
 *  mutate (un-bookmark, save profile) more than it needs a cache.
 *
 *  Also reused by the public pages (browse jobs, checkout): same shapes, same
 *  loading/error contract, so nothing has to learn a second data layer.
 *
 *  `loading`/`data` are derived from the key of the last *successful*
 *  request instead of being flipped inside the effect: a path change shows
 *  the skeleton on the very next render, with no extra render pass. */

type Result<T> = { key: string; data: T | null; error: string | null }

export type ApiState<T> = {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useApi<T>(path: string): ApiState<T> {
  const [result, setResult] = React.useState<Result<T> | null>(null)
  const [nonce, setNonce] = React.useState(0)

  const key = `${path}::${nonce}`

  React.useEffect(() => {
    const controller = new AbortController()
    let active = true

    fetch(path, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`)
        }
        return (await response.json()) as T
      })
      .then((data) => {
        if (active) setResult({ key, data, error: null })
      })
      .catch((cause: unknown) => {
        if (!active || controller.signal.aborted) return
        setResult({
          key,
          data: null,
          error:
            cause instanceof Error ? cause.message : "Something went wrong",
        })
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [path, key])

  const fresh = result !== null && result.key === key

  return {
    data: fresh ? result.data : null,
    loading: !fresh,
    error: fresh ? result.error : null,
    refetch: React.useCallback(() => setNonce((value) => value + 1), []),
  }
}

/** Server error message when the body carries one, otherwise the status. */
async function errorMessage(response: Response) {
  try {
    const body = (await response.json()) as { error?: unknown }
    if (typeof body.error === "string" && body.error) return body.error
  } catch {
    // Non-JSON error body — fall through to the status line.
  }
  return `Request failed (${response.status})`
}

/** PATCH helper for the mutations (settings form). Returns the parsed body so
 *  the caller can keep its local state in sync with what the server stored. */
export async function patchJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(await errorMessage(response))
  }

  return (await response.json()) as T
}

/** POST helper — used by checkout to create a payment session. */
export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(await errorMessage(response))
  }

  return (await response.json()) as T
}

/** DELETE helper — used by the "remove from saved jobs" buttons. */
export async function deleteJson(path: string): Promise<void> {
  const response = await fetch(path, { method: "DELETE" })

  if (!response.ok) {
    throw new Error(await errorMessage(response))
  }
}
