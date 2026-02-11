import type { Server } from "bun";
import { feature } from "bun:bundle";

type FetchHandler = (
  req: Request,
  server: Server<unknown>,
) => Response | Promise<Response>;
type RequestContext = { req: Request; server: Server<unknown> };
type BeforeHook<T> = (ctx: RequestContext) => T;
type AfterHook<T> = (
  ctx: RequestContext,
  beforeValue: T,
  response?: Response,
) => void;

function wrapHandler<T>(
  handler: FetchHandler,
  before: BeforeHook<T>,
  after: AfterHook<T>,
): FetchHandler {
  return async (req: Request, server: Server<unknown>): Promise<Response> => {
    const ctx = { req, server };
    const beforeValue = before(ctx);
    let response: Response | undefined;
    try {
      response = await handler(req, server);
      return response;
    } finally {
      after(ctx, beforeValue, response);
    }
  };
}

/**
 * Wraps a fetch handler with feature-flagged transforms.
 * When a feature is disabled at build time, the wrapping code
 * is dead-code-eliminated — zero overhead.
 */
export function transform(handler: FetchHandler): FetchHandler {
  let result = handler;

  if (feature("req_perf")) {
    result = wrapHandler(
      result,
      (_ctx) => {
        return Bun.nanoseconds();
      },
      function (_ctx: any, _startNs: number, _response?: Response) {},
    );
  }

  return result;
}
