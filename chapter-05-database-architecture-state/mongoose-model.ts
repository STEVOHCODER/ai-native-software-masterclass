import { Schema, model, type HydratedDocument, type Model } from 'mongoose';

export interface TelemetryDocument {
  tenantId: string;
  actorId: string;
  event: string;
  source: 'web' | 'api' | 'agent' | 'worker';
  properties: Record<string, string | number | boolean | null>;
  createdAt: Date;
}

const telemetrySchema = new Schema<TelemetryDocument>(
  {
    tenantId: { type: String, required: true, index: true, immutable: true, trim: true, maxlength: 128 },
    actorId: { type: String, required: true, index: true, immutable: true, trim: true, maxlength: 128 },
    event: { type: String, required: true, index: true, trim: true, match: /^[a-z0-9][a-z0-9._-]{1,127}$/ },
    source: { type: String, required: true, enum: ['web', 'api', 'agent', 'worker'], index: true },
    properties: {
      type: Map,
      of: Schema.Types.Mixed,
      validate: {
        validator: (value: Map<string, unknown>) => value.size <= 50,
        message: 'properties cannot contain more than 50 keys',
      },
    },
    createdAt: { type: Date, required: true, default: Date.now, expires: 60 * 60 * 24 * 90 },
  },
  { versionKey: false, strict: 'throw' },
);

telemetrySchema.index({ tenantId: 1, createdAt: -1 });
export type Telemetry = HydratedDocument<TelemetryDocument>;
export const TelemetryModel: Model<TelemetryDocument> = model<TelemetryDocument>('Telemetry', telemetrySchema);

