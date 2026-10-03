import { config } from "../config.js";
import { ValidationError } from "../lib/errors.js";
import { ChapaGateway } from "./chapa.js";
import { MockGateway } from "./mock.js";
import type { PaymentGateway } from "./types.js";

const registry = new Map<string, PaymentGateway>();

function register(gateway: PaymentGateway): void {
  registry.set(gateway.name, gateway);
}

register(new ChapaGateway());
register(new MockGateway());
// Future direct rails (require enterprise agreements):
// register(new TelebirrGateway());
// register(new CbeBirrGateway());

export function getGateway(name?: string): PaymentGateway {
  const resolved = name ?? config.DEFAULT_GATEWAY;
  if (resolved === "mock" && config.NODE_ENV === "production") {
    throw new ValidationError("The mock gateway is not available in production");
  }
  const gateway = registry.get(resolved);
  if (!gateway) throw new ValidationError(`Unknown payment gateway: ${resolved}`);
  return gateway;
}

export function availableGateways(): string[] {
  return [...registry.keys()].filter((name) => !(name === "mock" && config.NODE_ENV === "production"));
}
