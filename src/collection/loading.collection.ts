/**
 * Function type for cache loaders,
 * cache loaders are called when a
 * key doesn't exist (in memory) and
 * it must be fetched.
 */
type CacheLoader<K, V> = (key: K) => Promise<V | undefined>;

/**
 * Represents a simple object
 * that contains any value and
 * also contains its creation
 * timestamp
 */
class Timed<T> {

	constructor(
		public value: T,
		public creation: number
	) {
	}

}

/**
 * Represents an in-memory data container that
 * also fetches the data when it's not cached,
 * using @see CacheLoader
 *
 * This class is based on Guava Loading Cache
 */
export default class LoadingCollection<K, V> {

	private cache = new Map<K, Timed<V>>();

	/**
	 * Creates a new expiring loading collection
	 * @param load The load function
	 * @param expiry The expiry time for the entries (in millis)
	 * @param checkInterval The expired entries
	 * check interval (in millis)
	 */
	constructor(
		private load: CacheLoader<K, V>,
		private expiry: number,
		checkInterval = 100
	) {
		setInterval(() => {
			this.removeExpiredEntries();
		}, checkInterval);
	}

	async find(key: K): Promise<V | undefined> {
		const timedValue = this.cache.get(key);
		if (timedValue === undefined) {
			// not present in cache, load it
			const value = await this.load(key);
			if (value !== undefined) {
				this.cache.set(key, new Timed<V>(value, Date.now()));
			}
			return value;
		}
		if (this.isExpired(timedValue)) {
			this.cache.delete(key);
			return undefined;
		} else {
			return timedValue.value;
		}
	}

	private removeExpiredEntries() {
		this.cache.forEach((value, key, cache) => {
			if (this.isExpired(value)) {
				cache.delete(key);
			}
		});
	}

	private isExpired(entry: Timed<V>): boolean {
		return entry.creation + this.expiry < Date.now();
	}

	//#region Map methods
	get(key: K): V | undefined {
		const timedValue = this.cache.get(key);
		if (timedValue === undefined) {
			return undefined;
		} else if (this.isExpired(timedValue)) {
			this.cache.delete(key);
			return undefined;
		} else {
			return timedValue.value;
		}
	}

	set(key: K, value: V): void {
		const timedValue = new Timed<V>(value, Date.now());
		this.cache.set(key, timedValue);
	}

	delete(key: K): boolean {
		return this.cache.delete(key);
	}
	//#endregion

}