export interface Fraction {
  num: number;
  den: number;
}

export interface File {
  path: string;
  name: string;
  parent: string;
  type: 'folder' | 'file';
  children: string[];
}

export interface SocketConfig {
  host: string;
  port: number;
}

export interface PlaycastConnectionConfig {
  host?: string;
  port?: number;
}

export interface PlaycastBaseResponse {
  success: boolean;
  message?: string;
}

export interface PlaycastPrimaryConfig {
  enabled: boolean;
  host: string;
  port: number;
  remoteChannel: number;
}

export interface PlaycastUnitConfig {
  id: string;
  number: number;
  label: string;
  host: string;
  port: number;
  rootDirectory: string;
  pgmUrl: string;
  primary: PlaycastPrimaryConfig;
}

interface PlaycastEventBase {
  id: string;
  index: number;
  virtualIndex: number;
  name: string;
  refId: string;
  isHidden: boolean;
  startTime: number;
  endTime: number;
  expectedStartTime: number;
  expectedEndTime: number;
  anchored: boolean;
}

export type PlaycastClipStatus =
  | 'DELETED'
  | 'READY'
  | 'NEXT'
  | 'PREROLL'
  | 'PLAYING'
  | 'PLAYED';

export interface PlaycastClip extends PlaycastEventBase {
  filepath: string;
  position: number;
  inPoint: number;
  outPoint: number;
  actualLength: number;
  repeat: number;
  status: PlaycastClipStatus;
}

export type PlaycastActionType = 'action' | 'label' | 'pause' | 'custom-action';

export interface PlaycastAction extends PlaycastEventBase {
  type: PlaycastActionType;
  args: Record<string, unknown>;
  preroll: number;
  scheduledTimestamp: number;
  scheduledDuration: number;
  canceled: boolean;
}

export type PlaycastEvent = PlaycastClip | PlaycastAction;

export interface NewPlaycastClip {
  filepath?: string;
  refId?: string;
  name?: string;
  inPoint?: number;
  outPoint?: number;
  repeat?: number;
  isHidden?: boolean;
  anchored?: boolean;
}

export interface NewPlaycastAction {
  type?: PlaycastActionType;
  refId?: string;
  name?: string;
  args?: Record<string, unknown>;
  preroll?: number;
  scheduledTimestamp?: number;
  scheduledDuration?: number;
  isHidden?: boolean;
  anchored?: boolean;
}

export type NewPlaycastEvent = NewPlaycastClip | NewPlaycastAction;

export type PlaycastBlockType = 'regular' | 'scte';

export interface PlaycastBlock {
  id: string;
  name: string;
  type: PlaycastBlockType;
  events: string[];
  syncHash: string;
  duration: number;
  startEvent: string;
  endEvent: string;
}

export interface NewPlaycastBlock {
  name?: string;
  type?: string;
}

export interface Geometry {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PlaycastWatermarkStatus {
  filepath: string;
  geometry: Geometry;
  enabled: boolean;
}

interface PlaycastUnitProfile {
  description: string;
  frameRate: Fraction;
  width: number;
  height: number;
  progressive: boolean;
  sampleAspectRatio: Fraction;
  displayAspectRatio: Fraction;
  colorspace: number;
}

export type PlaycastUnitState = 'playing' | 'paused' | 'stopped' | 'not_loaded';
export type PlaycastUnitEof = 'pause' | 'pause-clip' | 'stop' | 'loop';

export interface PlaycastUnitStatus {
  unit: number;
  fps: number;
  generation: number;
  state: PlaycastUnitState;
  eof: PlaycastUnitEof;
  syncHash: string;
  isConnected: boolean;
  currentId: string;
  currentIndex: number;
  watermark: PlaycastWatermarkStatus;
  blocks: Record<string, PlaycastBlock>;
  playlist: PlaycastEvent[];
  profile: PlaycastUnitProfile;
}

export interface PlaycastCommandQueue {
  progress: { current: number; total: number } | null;
  commands: string[];
}
