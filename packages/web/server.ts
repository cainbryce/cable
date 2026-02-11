import { serve, type Server } from "bun";
import type { CableServerConfig } from "./types";
export default class CableWebserver {
  server: Server<unknown> | undefined = undefined;
  config: CableServerConfig | undefined = undefined;

  constructor(config: CableServerConfig) {
    this.config = config;
  }

  preStart(config: CableServerConfig): Function {
    return () => {
      this.server = serve(config);
    };
  }

  async start(): Promise<void> {
    if (this.config !== undefined) {
      try {
        await this.preStart(this.config)();
        console.info(`
                DEV?:${this.server?.development}
                PORT?:${this.server?.port}
                URL?:${this.server?.url}
                    `);
      } catch (error) {
        console.error("Error starting server:", error);
      }
    }
  }
}
