import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TelemetryService {
  private readonly sessionId = crypto.randomUUID();
  private readonly userId = 'gestor-demo-001';

  emit(event: string, metadata: Record<string, unknown> = {}): void {
    console.info(`[telemetry] ${event}`, {
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }
}
