import AsyncStorage from '@react-native-community/async-storage';
import * as sdk from 'matrix-js-sdk';
import { Room, RawEvent, MemoryStore } from 'matrix-js-sdk';
import request from 'xmlhttp-request';

import AsyncCryptoStore from './AsyncCryptoStore';

const SecurityKey = 'EsTN 2cqP QJTD VzFS HNEU TXBQ Ls9J 6B1s RoZW hVKT XEEg wYeP';

class SyncStorage {
  private static KEY = '@_@SyncSt0rag3';
  _data: Record<string, string> = {};

  constructor() {
    this.init = this.init.bind(this);
    this.setItem = this.setItem.bind(this);
    this.getItem = this.getItem.bind(this);
  }

  public async init(): Promise<void> {
    const value = await AsyncStorage.getItem(SyncStorage.KEY);
    try {
      if (value !== null) this._data = JSON.parse(value);
    } catch (error) {}
  }

  private save(): void {
    AsyncStorage.setItem(SyncStorage.KEY, JSON.stringify(this._data)).catch(console.error);
  }

  public setItem(key: string, value: string): void {
    if (!key) console.error('here ' + value);
    this._data[key] = value;
    this.save();
  }

  public getItem(key: string): string | undefined {
    return this._data[key];
  }

  public removeItem(key: string): void {
    delete this._data[key];
    this.save();
  }

  public key(index: number): string | undefined {
    return Object.values(this.setItem)?.[index];
  }

  get length(): number {
    return Object.keys(this._data).length;
  }
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
    const result = await this._client.loginWithPassword(username, password);

    const syncStorage = new SyncStorage();
    await syncStorage.init();
    const webStorageSessionStore = new (sdk as any).WebStorageSessionStore(syncStorage);

    interface ISecretStorageKeyInfo {
      passphrase?: {
        algorithm: 'm.pbkdf2';
        iterations: number;
        salt: string;
      };
      iv?: string;
      mac?: string;
    }

    this._client = sdk.createClient({
      baseUrl: this.URL,
      accessToken: result.access_token,
      userId: result.user_id,
      deviceId: result.device_id,
      request: request,

      timelineSupport: true,
      unstableClientRelationAggregation: true,
      store: new MemoryStore({ localStorage: AsyncStorage }),
      cryptoStore: new AsyncCryptoStore(AsyncStorage),
      sessionStore: webStorageSessionStore,

      // cryptoCallbacks: {
      //   async getSecretStorageKey(
      //     keys: { keys: Record<string, ISecretStorageKeyInfo> },
      //     name: string,
      //   ): Promise<[string, Uint8Array]> {
      //     // const cli = MatrixClientPeg.get();
      //     // let keyId = await this._client.getDefaultSecretStorageKeyId();

      //     // const key = await inputToKey(SecurityKey);

      //     // // Save to cache to avoid future prompts in the current session
      //     // cacheSecretStorageKey(keyId, keyInfo, key);

      //     // return [keyId, key];

      //     console.log('pqkluan', '==================');
      //     return ['', new Uint8Array()];
      //   },
      // },
    });

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
    await this._client.initCrypto();

    try {
      let backupInfo = await this._client.getKeyBackupVersion();

      if (backupInfo) await this._client.bootstrapSecretStorage();

      // enableKeyBackup tells the client to back up the keys it receives to the server
      // await this._client.enableKeyBackup(backupInfo);

      // I am not sure if we could use the backupInfo from getKeyBackupVersion()
      // let response = await this._client.checkKeyBackup();
      // console.log('pqkluan', '3', response);

      // restoreKeyBackupWithCache fetches the keys from the backup.
      // let recoverInfo = await this._client.restoreKeyBackupWithCache(
      //   undefined,
      //   undefined,
      //   response.backupInfo,
      // );
      // console.log('pqkluan', '4', recoverInfo);

      // if (recoverInfo && recoverInfo.total > recoverInfo.imported) console.log('pqkluan5');
      // Warnig (recoverInfo.total - recoverInfo.imported) sessions could not be recovered
    } catch (error) {
      console.error(error);
    }

    await this._client.startClient({
      initialSyncLimit: 6,
      lazyLoadMembers: true,
    });
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
