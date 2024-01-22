/**
 * Represents a datastore, which is a repository for a specific
 * type of data. This can be a database, a file, or an in-memory
 * cache.
 *
 * @template T The type of the data
 */
interface Datastore<T> {
  /**
   * Gets the value for the given key.
   *
   * @param key The key to get the value for
   * @returns A promise that resolves to the value for the given key
   */
  get(key: string): Promise<T | null>;

  /**
   * Removes the value for the given key.
   *
   * @param key The key to remove the value for
   */
  remove(key: string): Promise<void>;

  /**
   * Saves the given value for the given key.
   *
   * @param key The key to save the value for
   * @param value The value to save
   */
  save(key: string, value: T): Promise<void>;
}

export default Datastore;