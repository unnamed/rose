import fs from 'fs';
import path from 'path';
import Datastore from './Datastore';

export class FileSingletonDatastore<T> implements Datastore<T> {
  private readonly file: string;

  constructor(...pathArgs: string[]) {
    this.file = path.join(...pathArgs);
  }

  async get(key: string): Promise<T | null> {
    if (!fs.existsSync(this.file)) {
      return null;
    }
    const content = fs.readFileSync(this.file, { encoding: 'utf-8' });
    const json = JSON.parse(content);
    if (typeof json === 'object') {
      return json[key] || null;
    } else {
      return null;
    }
  }

  async save(key: string, value: T): Promise<void> {
    let json;
    if (!fs.existsSync(this.file)) {
      json = {};
    } else {
      const content = fs.readFileSync(this.file, { encoding: 'utf-8' });
      json = JSON.parse(content);
      if (typeof json !== 'object') {
        json = {};
      }
    }
    json[key] = value;

    // create directory if not exists
    const dir = path.dirname(this.file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.file, JSON.stringify(json));
  }

  async remove(key: string): Promise<void> {
    if (!fs.existsSync(this.file)) {
      return;
    }
    const content = fs.readFileSync(this.file, { encoding: 'utf-8' });
    const json = JSON.parse(content);
    if (typeof json === 'object') {
      delete json[key];
      fs.writeFileSync(this.file, JSON.stringify(json));
    }
  }
}