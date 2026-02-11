import type { Serve } from "bun";

export type CableServerConfig<T = unknown> = Serve.Options<T> & {
  readonly acceptFromOrigin: string | string[];
};
