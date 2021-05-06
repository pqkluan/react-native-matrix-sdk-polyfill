import * as sdk from 'react-native-matrix-sdk-polyfill';

export interface Room {
  roomId: string;
  name: string;
}

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

  public async getUserProfile(): Promise<{
    id: string;
    displayName?: string;
    avatarUrl?: string;
  }> {
    const id: string = await this._client.getUserId();

    const profile: {
      displayname?: string;
      avatar_url?: string;
    } = (await this._client.getProfileInfo(id)) ?? {};

    return {
      id,
      displayName: profile.displayname,
      avatarUrl: profile.avatar_url,
    };
  }

  onSyncCompleted(callback: () => void) {
    this._client.once(
      'sync',
      (state: string) => state === 'PREPARED' && callback(),
    );
  }

  public async startClient() {
    // TODO: research params
    await this._client.startClient({initialSyncLimit: 10});
  }

  public stopClient(): void {
    this._client.stopClient();
  }

  public async listJoinedRoomIds(): Promise<string[]> {
    const result: {
      joined_rooms: string[];
    } = await this._client.getJoinedRooms();

    return result.joined_rooms;
  }

  public async getRoom(roomId: string): Promise<Room> {
    const room = await this._client.getRoom(roomId);

    return {
      roomId: room.id,
      name: room.name,
    };
  }
}

export const matrixService = new _MatrixService();
