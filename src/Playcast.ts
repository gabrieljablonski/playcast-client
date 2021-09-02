import Socket from "./Socket";
import { File, Geometry, NewPlaycastBlock, NewPlaycastEvent, PlaycastBaseResponse, PlaycastBlockType, PlaycastCommandQueue, PlaycastConnectionConfig, PlaycastEvent, PlaycastUnitConfig, PlaycastUnitEof, PlaycastUnitStatus, PlaycastWatermarkStatus } from "./types";

export default class Playcast {
  private _socket: Socket;

  constructor(connectionConfig: PlaycastConnectionConfig = { host: 'localhost', port: 8383 }) {
    this._socket = new Socket({
      host: connectionConfig.host,
      port: connectionConfig.port,
    })
  }

  connect(): Promise<void>{
    return this._socket.connect();
  }

  disconnect(){
    this._socket.disconnect();
  }

  ping(): Promise<PlaycastBaseResponse> {
    return this._socket.emit('ping');
  }

  getVersion(): Promise<PlaycastBaseResponse & { version?: string }> {
    return this._socket.emit('version');
  }

  getConfig(): Promise<PlaycastBaseResponse & { config?: string }> {
    return this._socket.emit('get-config');
  }

  setupControls(autoRoll: { after: number; enabled: boolean; }): Promise<PlaycastBaseResponse & { controls?: object }> {
    return this._socket.emit('setup-controls', { autoRoll });
  }

  setupPrimary(unit: number, primary: { host: string; port: number; remoteChannel: number; enabled: boolean; }): Promise<PlaycastBaseResponse & { primary?: object }> {
    return this._socket.emit('setup-primary', { unit, primary });
  }

  statusRegister(units: number[]): Promise<PlaycastBaseResponse> {
    return this._socket.emit('status-register', { units });
  }

  onStatusUpdate(callback: (status: { unit?: PlaycastUnitStatus; updates: PlaycastEvent[]; commandQueue: PlaycastCommandQueue; }) => void) {
    this._socket.on('status-update', callback);
  }

  onStatusResync(callback: (status: { unit?: PlaycastUnitStatus; commandQueue: PlaycastCommandQueue; }) => void) {
    this._socket.on('status-resync', callback);
  }

  statusUpdateRange(unit: number, range: { lower: number; upper: number; }): Promise<PlaycastBaseResponse> {
    return this._socket.emit('status-update-range', { unit, range });
  }

  statusResync(): Promise<PlaycastBaseResponse> {
    return this._socket.emit('status-resync');
  }

  updateFiles(unit: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('update-files', { unit });
  }

  onUpdateFiles(callback: (fsInfo: { rootPath: string; files: Record<string, File> }) => void) {
    this._socket.on('update-files', callback);
  }

  getStatus(): Promise<PlaycastBaseResponse & { configuredUnits?: PlaycastUnitConfig; units?: PlaycastUnitStatus; }> {
    return this._socket.emit('status');
  }

  setUnitEof(unit: number, eof: PlaycastUnitEof): Promise<PlaycastBaseResponse> {
    return this._socket.emit('set-unit-eof', { unit, eof });
  }

  listUnit(unit: number): Promise<PlaycastBaseResponse & { unit?: PlaycastUnitStatus }> {
    return this._socket.emit('list-unit', { unit });
  }

  listUnits(): Promise<PlaycastBaseResponse & { units?: Record<number, PlaycastUnitStatus> }> {
    return this._socket.emit('list-unit');
  }

  append(unit: number, event: NewPlaycastEvent): Promise<PlaycastBaseResponse & { event?: PlaycastEvent }> {
    return this._socket.emit('append', { unit, event });
  }

  appendMany(unit: number, events: NewPlaycastEvent[]): Promise<PlaycastBaseResponse & { events?: PlaycastEvent[] }> {
    return this._socket.emit('append-many', { unit, events });
  }

  insert(unit: number, event: NewPlaycastEvent, targetEvent?: string): Promise<PlaycastBaseResponse & { event?: PlaycastEvent }> {
    return this._socket.emit('insert', { unit, event, targetEvent });
  }

  insertMany(unit: number, events: { event: NewPlaycastEvent; targetEvent: string; }[], targetEvent?: string): Promise<PlaycastBaseResponse & { events?: { event: PlaycastEvent; targetEvent?: string; }[] }> {
    return this._socket.emit('insert-many', { unit, events, targetEvent });
  }

  load(unit: number, event: NewPlaycastEvent): Promise<PlaycastBaseResponse & { event?: PlaycastEvent }> {
    return this._socket.emit('load', { unit, event });
  }

  update(unit: number, event: NewPlaycastEvent & { id: string }): Promise<PlaycastBaseResponse & { event?: PlaycastEvent }> {
    return this._socket.emit('update', { unit, event });
  }

  remove(unit: number, eventId: string): Promise<PlaycastBaseResponse & { event?: PlaycastEvent }> {
    return this._socket.emit('remove', { unit, eventId });
  }

  removeMany(unit: number, eventIds: string[], keepPlaying?: boolean): Promise<PlaycastBaseResponse & { events?: PlaycastEvent[] }> {
    return this._socket.emit('remove-many', { unit, eventIds, keepPlaying });
  }

  reinsert(unit: number, eventId: string): Promise<PlaycastBaseResponse & { event?: PlaycastEvent }> {
    return this._socket.emit('reinsert', { unit, eventId });
  }

  reinsertModified(unit: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('reinsert-modified', { unit });
  }

  clean(unit: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('clean', { unit });
  }

  wipe(unit: number, beforeEvent?: string): Promise<PlaycastBaseResponse> {
    return this._socket.emit('wipe', { unit, beforeEvent });
  }

  move(unit: number, eventId: string, targetId: string ): Promise<PlaycastBaseResponse> {
    return this._socket.emit('move', { unit, eventId, targetEvent: targetId });
  }

  moveMany(unit: number, firstEvent: string, howMany: number, targetEvent?: string): Promise<PlaycastBaseResponse> {
    return this._socket.emit('move-many', { unit, firstEvent, howMany, targetEvent });
  }

  copyPaste(unit: number, sourceUnit: number, eventIds?: string[], targetEvent?: string, cut?: boolean): Promise<PlaycastBaseResponse> {
    return this._socket.emit('copy-paste', { unit, sourceUnit, events: eventIds, targetEvent, cut });
  }

  play(unit: number | 'all', speed?: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('play', { unit, speed });
  }

  stop(unit: number | 'all'): Promise<PlaycastBaseResponse> {
    return this._socket.emit('stop', { unit });
  }

  pause(unit: number | 'all'): Promise<PlaycastBaseResponse> {
    return this._socket.emit('pause', { unit });
  }

  pauseNext(unit: number, playAfter?: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('pause-next', { unit, playAfter });
  }

  seek(unit: number, frame?: number, event?: string): Promise<PlaycastBaseResponse> {
    return this._socket.emit('seek', { unit, frame, event });
  }

  fastSeek(unit: number, frame: number, eventId?: string): Promise<PlaycastBaseResponse> {
    return this._socket.emit('fast-seek', { unit, frame, eventId });
  }

  step(unit: number, frames: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('step', { unit, frames });
  }

  previous(unit: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('previous', { unit });
  }

  next(unit: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('next', { unit });
  }

  fastSetInPoint(unit: number, inPoint: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('fast-set-in-point', { unit, inPoint });
  }

  fastSetOutPoint(unit: number, outPoint: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('fast-set-out-point', { unit, outPoint });
  }

  savePlaylist(unit: number, filename: string): Promise<PlaycastBaseResponse> {
    return this._socket.emit('save-playlist', { unit, filename });
  }

  loadPlaylist(unit: number, filepath: string, fromBeginning?: boolean): Promise<PlaycastBaseResponse> {
    return this._socket.emit('load-playlist', { unit, filepath, fromBeginning });
  }

  removePlaylist(unit: number, filepath: string): Promise<PlaycastBaseResponse> {
    return this._socket.emit('remove-playlist', { unit, filepath });
  }

  createBlock(unit: number, blockInfo: NewPlaycastBlock, firstEventId: string, lastEventId?: string): Promise<PlaycastBaseResponse> {
    return this._socket.emit('create-block', { unit, blockInfo, firstEventId, lastEventId });
  }

  updateBlock(unit: number, blockInfo: NewPlaycastBlock & { id: string }): Promise<PlaycastBaseResponse> {
    return this._socket.emit('update-block', { unit, blockInfo });
  }

  deleteBlock(unit: number, blockId: string): Promise<PlaycastBaseResponse> {
    return this._socket.emit('delete-block', { unit, blockId });
  }

  cancelScheduledAction(unit: number, actionId: string): Promise<PlaycastBaseResponse> {
    return this._socket.emit('cancel-scheduled-action', { unit, actionId });
  }

  getWatermarks(): Promise<PlaycastBaseResponse & Record<number, PlaycastWatermarkStatus>> {
    return this._socket.emit('get-watermarks');
  }

  setWatermark(unit: number, filepath?: string, geometry?: Geometry, enabled?: boolean): Promise<PlaycastBaseResponse> {
    return this._socket.emit('set-watermark', { unit, filepath, geometry, enabled });
  }

  loadCustomRundown(unit: number, loader: string, rundown: string, blockType?: PlaycastBlockType): Promise<PlaycastBaseResponse> {
    return this._socket.emit('load-custom-rundown', { unit, loader, rundown, blockType });
  }

  reloadWithCustomLoader(unit: number, loader: string): Promise<PlaycastBaseResponse> {
    return this._socket.emit('reload-with-custom-loader', { unit, loader });
  }

  getPlaylists(unit: number): Promise<PlaycastBaseResponse & { playlists?: string[] }> {
    return this._socket.emit('get-playlists', { unit });
  }

  getCustomActions(unit: number): Promise<PlaycastBaseResponse & { actions?: string[] }> {
    return this._socket.emit('get-custom-actions', { unit });
  }

  getRundownLoaders(unit: number): Promise<PlaycastBaseResponse & { loaders?: string[] }> {
    return this._socket.emit('get-rundown-loaders', { unit });
  }

  getPlayoutReportLoaders(unit: number): Promise<PlaycastBaseResponse & { loaders?: string[] }> {
    return this._socket.emit('get-playout-report-loaders', { unit });
  }

  getPlayoutReport(unit: number, from?: number, to?: number, columns?: string[], customReport?: string | 'default'): Promise<PlaycastBaseResponse & { report?: string }> {
    return this._socket.emit('get-playout-report', { unit, from, to, columns, customReport });
  }

  getCommandQueue(unit: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('get-command-queue', { unit });
  }

  popCommandQueue(unit: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('pop-command-queue', { unit });
  }

  clearCommandQueue(unit: number): Promise<PlaycastBaseResponse> {
    return this._socket.emit('clear-command-queue', { unit });
  }
}
