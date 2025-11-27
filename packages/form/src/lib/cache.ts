export interface CacheStore<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  has(key: K): boolean;
  delete(key: K): boolean;
  clear(): void;
  readonly size: number;
}

class ListNode<K, V> {
  key: K;
  value: V;
  prev: ListNode<K, V> | null = null;
  next: ListNode<K, V> | null = null;

  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  }
}

export interface LRUCacheOptions<K, V> {
  maxSize: number;
  cache?: CacheStore<K, ListNode<K, V>>;
}

export class LRUCache<K, V> implements CacheStore<K, V> {
  private cache: CacheStore<K, ListNode<K, V>>;
  private readonly maxSize: number;
  private head: ListNode<K, V> | null = null; // Most recently used
  private tail: ListNode<K, V> | null = null; // Least recently used

  constructor({ maxSize, cache = new Map() }: LRUCacheOptions<K, V>) {
    if (maxSize <= 0) {
      throw new Error("maxSize must be greater than 0");
    }
    this.maxSize = maxSize;
    this.cache = cache;
  }

  get(key: K): V | undefined {
    const node = this.cache.get(key);
    if (node === undefined) {
      return undefined;
    }
    // Move to head (most recently used)
    this.moveToHead(node);
    return node.value;
  }

  set(key: K, value: V): void {
    let node = this.cache.get(key);

    if (node !== undefined) {
      // Update existing node
      node.value = value;
      this.moveToHead(node);
    } else {
      // Create new node
      node = new ListNode(key, value);
      this.cache.set(key, node);
      this.addToHead(node);

      // Evict if over capacity
      if (this.cache.size > this.maxSize) {
        this.removeTail();
      }
    }
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    const node = this.cache.get(key);
    if (node === undefined) {
      return false;
    }
    this.removeNode(node);
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.head = null;
    this.tail = null;
  }

  get size(): number {
    return this.cache.size;
  }

  private addToHead(node: ListNode<K, V>): void {
    node.prev = null;
    node.next = this.head;

    if (this.head !== null) {
      this.head.prev = node;
    }
    this.head = node;

    if (this.tail === null) {
      this.tail = node;
    }
  }

  private removeNode(node: ListNode<K, V>): void {
    if (node.prev !== null) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next !== null) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  private moveToHead(node: ListNode<K, V>): void {
    if (node === this.head) {
      return;
    }
    this.removeNode(node);
    this.addToHead(node);
  }

  private removeTail(): void {
    if (this.tail === null) {
      return;
    }
    const key = this.tail.key;
    this.removeNode(this.tail);
    this.cache.delete(key);
  }
}

export interface HashBasedCacheOptions<K, H, V> {
  getHash: (key: K) => H;
  cache?: CacheStore<H, V>;
}

export class HashBasedCache<K, H, V> implements CacheStore<K, V> {
  private cache: CacheStore<H, V>;
  private readonly getHash: (key: K) => H;

  constructor({ getHash, cache = new Map() }: HashBasedCacheOptions<K, H, V>) {
    this.getHash = getHash;
    this.cache = cache;
  }

  get(key: K): V | undefined {
    const hash = this.getHash(key);
    return this.cache.get(hash);
  }

  set(key: K, value: V): void {
    const hash = this.getHash(key);
    this.cache.set(hash, value);
  }

  has(key: K): boolean {
    return this.cache.has(this.getHash(key));
  }

  delete(key: K): boolean {
    return this.cache.delete(this.getHash(key));
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}
