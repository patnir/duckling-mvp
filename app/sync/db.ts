// Dexie (IndexedDB wrapper module declaration)
// Table definitions
import Dexie, { Table } from 'dexie'
import debounce from 'lodash/debounce'
import { isOnline } from './utils'
import { SyncAPIEvents } from './events'

export interface _Object {
  id: string
  type: string
  json: unknown
  added?: number
  source?: 'api' | 'client'
}

export interface _Request {
  id?: number
  url: string
  options?: RequestInit
  added: number,
}

export class DucklingDexie extends Dexie {
  objects!: Table<_Object, string>
  requests!: Table<_Request, number>

  constructor() {
    super('DucklingDexie')
    this.version(1).stores({
      objects: 'id, type',
      requests: '++id, added',
    })
  }

  putObject = async (obj: _Object) => {
    obj.added = Date.now();
    obj.json = JSON.parse(JSON.stringify(obj.json))
    SyncAPIEvents.emit('did-modify-object', obj.id, obj);
    return this.objects.put(obj, obj.id)
  }

  removeObject = async (objID: string) => {
    SyncAPIEvents.emit('did-modify-object', objID, null);
    return this.objects.delete(objID)
  }

  enqueueRequest = async (url: string, options?: RequestInit) => {
    const req = {
      url,
      options,
      added: Date.now(),
    }
    return this.requests.put(req)
  }

  peekNextRequest = async () => {
    return this.requests.orderBy('added').first()
  }

  dequeueRequest = async (reqID: number) => {
    return this.requests.delete(reqID)
  }

  hasPendingChanges = async () => {
    const pending = await this.requests.count();
    return pending > 0;
  }

  publishChanges = debounce(async () => {
    if (!isOnline()) return false
  
    let nextReq
    const publishedRequests = [];
    do {
      try {
        nextReq = await db.peekNextRequest()
        if (nextReq) {
          await fetch(nextReq!.url, nextReq!.options)
          await db.dequeueRequest(nextReq.id!)
          publishedRequests.push(nextReq);
          console.log(
            'Dequeued',
            nextReq.options?.method,
            nextReq.url,
            nextReq.id
          )
        }
      } catch (err) {
        console.error('REQUEST FAILED TO PUSH...', { nextReq, err })
      }
    } while (nextReq)


    const didChange = publishedRequests.length > 0;
    if (didChange) {
      SyncAPIEvents.emit('did-push-requests', publishedRequests)
    }
    return didChange;
  }, 200)

}

export const db = new DucklingDexie()
