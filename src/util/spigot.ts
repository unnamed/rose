/*
 * Utility module exporting a wrapper to interact
 * with the SpigotMC API
 */
import fetch from 'node-fetch';
import Dict = NodeJS.Dict;

const ALPHABET_LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const ALPHABET_UPPERCASE = ALPHABET_LOWERCASE.toUpperCase();
const NUMBERS = '0123456789';

const BASE_URL = 'https://api.spigotmc.org/simple/0.2/index.php';

// characters that can exist in a Spigot username
const NAME_CHARACTERS = new Set([...(ALPHABET_LOWERCASE + ALPHABET_UPPERCASE + NUMBERS + '_-. ')]);

export interface Author {
  id: number;
  username: string;
  resource_count: number;
  identities: Dict<string>,
  avatar: string
}

/**
 * Determines if the given name is valid for a SpigotMC user
 */
function validateUsername(name: string): [boolean, string] {
  if (name.length < 3) return [false, 'Names are at least 3 characters long'];
  if (name.length > 16) return [false, 'Names are at most 16 characters long'];
  // validate characters
  for (const character of name) {
    if (!NAME_CHARACTERS.has(character)) {
      // invalid character!
      return [false, 'There are invalid characters in the given username'];
    }
  }
  return [true, 'Ok!'];
}

/**
 * Finds a SpigotMC author by its exact username using
 * the SpigotMC API (api.spigotmc.org)
 */
export async function findAuthor(name: string): Promise<Author> {
  const [ valid, reason ] = validateUsername(name);
  if (!valid) return Promise.reject(reason);
  return fetch(BASE_URL + `?action=findAuthor&name=${encodeURIComponent(name)}`)
    .then(response => response.json())
    .then(author => author as Author);
}