import { describe, it, expect } from 'vitest';
import { BlinkCamera } from '../index.js';
import type { HomescreenCamera } from '../base.js';

type Blink = ConstructorParameters<typeof BlinkCamera>[1];

function makeCamera(type: string): BlinkCamera {
  const data: HomescreenCamera = {
    id: 915774,
    network_id: 682119,
    name: 'Floodlight',
    serial: 'TEST0001',
    fw_version: '1.0.0',
    type,
    enabled: true,
    thumbnail: '',
    status: 'online',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  };
  return new BlinkCamera(data, {} as Blink);
}

describe('BlinkCamera device-type classification', () => {
  // Regression for issue #40: the Wired Floodlight reports type "superior"
  // and must route motion enable/disable through the owl config endpoint
  // rather than the legacy /network/.../camera/.../enable path (which 404s).
  it('treats a "superior" floodlight as a mini', () => {
    expect(makeCamera('superior').isCameraMini).toBe(true);
  });

  it('identifies a "superior" floodlight as a floodlight', () => {
    expect(makeCamera('superior').isFloodlight).toBe(true);
  });

  it('treats owl and hawk as minis', () => {
    expect(makeCamera('owl').isCameraMini).toBe(true);
    expect(makeCamera('hawk').isCameraMini).toBe(true);
  });

  it('does not treat a regular camera as a mini', () => {
    const camera = makeCamera('camera');
    expect(camera.isCameraMini).toBe(false);
    expect(camera.isFloodlight).toBe(false);
  });
});
