import { config } from "../config.js";
import { dispatchOutbox } from "../services/outboxService.js";
import { reconcilePendingTransactions } from "../services/reconciliationService.js";
import { enforceOverdueInvoices, issueRenewalInvoices } from "../services/subscriptionService.js";

interface Task {
  name: string;
  intervalSeconds: number;
  run: () => Promise<unknown>;
}

const timers: NodeJS.Timeout[] = [];
const running = new Set<string>();

function schedule(task: Task, log: (msg: string) => void): void {
  if (task.intervalSeconds <= 0) {
    log(`[worker] ${task.name} disabled`);
    return;
  }
  const timer = setInterval(async () => {
    if (running.has(task.name)) return; // overlap guard
    running.add(task.name);
    try {
      const result = await task.run();
      if (result && typeof result === "object" && Object.values(result).some((v) => Number(v) > 0)) {
        log(`[worker] ${task.name}: ${JSON.stringify(result)}`);
      } else if (typeof result === "number" && result > 0) {
        log(`[worker] ${task.name}: processed ${result}`);
      }
    } catch (err) {
      log(`[worker] ${task.name} error: ${(err as Error).message}`);
    } finally {
      running.delete(task.name);
    }
  }, task.intervalSeconds * 1000);
  timer.unref();
  timers.push(timer);
  log(`[worker] ${task.name} every ${task.intervalSeconds}s`);
}

export function startWorkers(log: (msg: string) => void = console.log): void {
  schedule({ name: "outbox-dispatcher", intervalSeconds: config.OUTBOX_POLL_INTERVAL, run: dispatchOutbox }, log);
  schedule(
    { name: "reconciliation", intervalSeconds: config.RECONCILIATION_INTERVAL, run: reconcilePendingTransactions },
    log,
  );
  schedule(
    { name: "subscription-renewals", intervalSeconds: config.SUBSCRIPTION_RENEWAL_INTERVAL, run: issueRenewalInvoices },
    log,
  );
  schedule(
    { name: "invoice-overdue", intervalSeconds: config.INVOICE_OVERDUE_INTERVAL, run: enforceOverdueInvoices },
    log,
  );
}

export function stopWorkers(): void {
  for (const t of timers) clearInterval(t);
  timers.length = 0;
}
