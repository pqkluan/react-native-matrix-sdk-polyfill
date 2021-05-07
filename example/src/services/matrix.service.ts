import * as sdk from 'matrix-js-sdk';
import { Room, RawEvent } from 'matrix-js-sdk';

class _MatrixService {
  private _client;
  private TAG = 'MatrixService' as const;
  public URL = 'http://localhost:8008' as const;

  constructor() {
    this._client = sdk.createClient(this.URL);
  }

  public isLoggedIn(): boolean {
    return this._client.isLoggedIn();
  }

  public async login(
    username: string,
    password: string,
  ): Promise<
    | undefined
    | {
        access_token: string;
        device_id: string;
        home_server: string;
        user_id: string;
      }
  > {
    const result: {
      access_token: string;
      device_id: string;
      home_server: string;
      user_id: string;
    } = await this._client.loginWithPassword(username, password);

    return result;
  }

  public async logout(): Promise<void> {
    await this._client.logout();
  }

  public async getUserProfile(): Promise<
    | undefined
    | {
        id: string;
        displayName?: string;
        avatarUrl?: string;
      }
  > {
    const id = this._client.getUserId();
    if (!id) return;

    const profile = await this._client.getProfileInfo(id);

    return {
      id,
      displayName: profile?.displayname,
      avatarUrl: profile?.avatar_url,
    };
  }

  onSyncCompleted(callback: () => void) {
    this._client.once('sync', (state: string) => state === 'PREPARED' && callback());
  }

  public async startClient() {
    // TODO: research params
    await this._client.startClient({ initialSyncLimit: 10 });
  }

  public stopClient(): void {
    this._client.stopClient();
  }

  public async listJoinedRoomIds(): Promise<string[]> {
    const result = ((await this._client.getJoinedRooms()) as unknown) as {
      joined_rooms: string[];
    };

    return result.joined_rooms;
  }

  public getRoom(roomId: string): Room | null {
    return this._client.getRoom(roomId);
  }

  public listenToRoomEvents(roomId: string, callback: (e: sdk.RawEvent) => void): () => void {
    const listener = (event: sdk.MatrixEvent) => {
      if (event.getType() !== 'm.room.message') return;
      const rawEvent = event.event as RawEvent;
      if (rawEvent.room_id !== roomId) return;

      callback(rawEvent);
    };

    this._client.on('Room.timeline', listener);
    return () => this._client.removeListener('Room.timeline', listener);
  }
}

export const matrixService = new _MatrixService();
