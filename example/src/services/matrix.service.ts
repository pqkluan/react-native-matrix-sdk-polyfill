import AsyncStorage from '@react-native-community/async-storage';
import * as sdk from 'matrix-js-sdk';
import { Room, RawEvent, MemoryStore } from 'matrix-js-sdk';
import { decodeRecoveryKey } from 'matrix-js-sdk/lib/crypto/recoverykey';
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
  //   public URL = 'https://matrix-client.matrix.org' as const;
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
    // const result = await this._client.loginWithPassword(username, password);

    const syncStorage = new SyncStorage();
    await syncStorage.init();
    const webStorageSessionStore = new (sdk as any).WebStorageSessionStore(syncStorage);

    this._client = sdk.createClient({
      baseUrl: this.URL,
      accessToken:
        'MDAxYmxvY2F0aW9uIHBxa2x1YW4ubG9jYWwKMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDI3Y2lkIHVzZXJfaWQgPSBAbHVhbjA6cHFrbHVhbi5sb2NhbAowMDE2Y2lkIHR5cGUgPSBhY2Nlc3MKMDAyMWNpZCBub25jZSA9ICxCJnBOLm5RNmg6N2U6ck8KMDAyZnNpZ25hdHVyZSCTpY8LZR33ExcOkYMSqxAS3SxMikCBo8bUm9ZR3hD7ego',
      userId: '@luan0:pqkluan.local',
      deviceId: 'node_server',
      request: request,

      //   timelineSupport: true,
      //   unstableClientRelationAggregation: true,
      store: new MemoryStore({ localStorage: AsyncStorage }),
      cryptoStore: new AsyncCryptoStore(AsyncStorage),
      sessionStore: webStorageSessionStore,

      cryptoCallbacks: {
        getSecretStorageKey: async ({ keys: keyInfos }) => {
          // Figure out the storage key id + info
          const keyId = await (async () => {
            const defaultKeyId = await this._client.getDefaultSecretStorageKeyId();
            // Use the default SSSS key if set
            if (defaultKeyId) return defaultKeyId;

            // If no default SSSS key is set, fall back to a heuristic of using the only available key, if only one key is set
            const keys = Object.keys(keyInfos);

            if (keys.length > 1) throw new Error('Multiple storage key requests not implemented');

            return keys[0];
          })();

          if (!keyId) throw new Error('No available key id found');

          const key = decodeRecoveryKey(
            'EsTE CrMt W3xt AtzQ kfDw 1ceS JsNX kD61 q3Fw KWFJ 2dwE TTEf',
          );

          return [keyId, key];
        },
      },
    });

    return {
      user_id: this._client.getUserId(),
    };
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
    this._client.once('sync', (state: string) => {
      if (state !== 'PREPARED') return;
      callback();

      this._client.on('Room.timeline', async (event, room) => {
        const eventType = event.getType();

        switch (eventType) {
          case 'm.room.message': {
            console.log('(%s) %s: %s', room.name, event.getSender(), event.getContent().body);
            break;
          }
          case 'm.room.encrypted': {
            const decryptedEvent = await this._client._crypto.decryptEvent(event);
            console.log(
              '(%s) %s: %s',
              room.name,
              event.getSender(),
              decryptedEvent.clearEvent.content.body,
            );
            break;
          }
          case 'm.presence':
          case 'm.fully_read':
          case 'm.receipt':
          case 'm.typing': {
            // Do nothing
            break;
          }
          default: {
            console.log(eventType);
          }
        }
      });
    });
  }

  public async startClient() {
    await this._client.initCrypto();

    await this._client.startClient({
      initialSyncLimit: 6,
      //   lazyLoadMembers: true,
    });

    // TODO: check for the need of recovery
    try {
      const backupInfo = await this._client.getKeyBackupVersion();

      await this._client.bootstrapSecretStorage();
      console.log('bootstrapSecretStorage completed');

      this._client.enableKeyBackup(backupInfo);

      const response = await this._client.checkKeyBackup();
      console.log('checkKeyBackup', response);

      const recoverInfo = await this._client.restoreKeyBackupWithCache(
        undefined,
        undefined,
        response.backupInfo,
      );
      console.log('restoreKeyBackupWithCache', recoverInfo);

      if (recoverInfo.total > recoverInfo.imported) console.log('Not all sessions recovered');
      else console.log('Recovered finished');
    } catch (error) {
      console.log('Failed to recover');
      console.error(error);
    }
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
    const listener = async (event: sdk.MatrixEvent, room) => {
      if (room.id !== roomId) return;
      const eventType = event.getType();

      switch (eventType) {
        case 'm.room.message': {
          console.log('(%s) %s: %s', room.name, event.getSender(), event.getContent().body);
          callback(event);
          break;
        }
        case 'm.room.encrypted': {
          const decryptedEvent = await this._client._crypto.decryptEvent(event);
          console.log(
            '(%s) %s: %s',
            room.name,
            event.getSender(),
            decryptedEvent.clearEvent.content.body,
          );
          callback(decryptedEvent);
          break;
        }
        case 'm.presence':
        case 'm.fully_read':
        case 'm.receipt':
        case 'm.typing': {
          // Do nothing
          break;
        }
        default: {
          console.log(eventType);
        }
      }
    };

    this._client.on('Room.timeline', listener);
    return () => this._client.removeListener('Room.timeline', listener);
  }
}

export const matrixService = new _MatrixService();
