import fetch from 'node-fetch';

const API_URL = 'https://api.spigotmc.org/simple/0.2/index.php';

type SpigotAPIAction = 'listResources' | 'getResource' | 'getResourcesByAuthor' | 'listResourceCategories' | 'getResourceUpdate' | 'getResourceUpdates' | 'getAuthor' | 'findAuthor';

async function get(action: SpigotAPIAction, params?: Record<string, string | number | boolean>) {
  let url = `${API_URL}?action=${action}`;
  if (params !== undefined) {
    url += '&' + Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
  }
  const response = await fetch(url);
  return await response.json();
}

export async function findAuthor(name: string): Promise<{
    id: string,
    username: string,
    resource_count: string,
    identities: {
        discord: string | null,
    },
    avatar: string | null
}> {
  return get('findAuthor', { name });
}