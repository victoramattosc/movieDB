// db.js

import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';

// Adicionando plugins necessários
addRxPlugin(RxDBDevModePlugin); // Modo de desenvolvimento
addRxPlugin(RxDBQueryBuilderPlugin); // Plugin para consultas avançadas

const schema = {
  title: 'movie schema',
  version: 0,
  description: 'describes a movie',
  type: 'object',
  primaryKey: 'id',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    name: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    duration: {
      type: 'number',
    },
    image: {
      type: 'string',
    },
    average_rating: {
      type: 'number',
      minimum: 0,
      maximum: 5,
    },
    ratings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          movie: { type: 'number' },
          rating: { type: 'number', minimum: 1, maximum: 5 },
        },
        required: ['id', 'movie', 'rating'],
        additionalProperties: false,
      },
    },
  },
  required: ['id', 'name', 'description', 'duration', 'image'],
  additionalProperties: false,
};

export async function initDatabase() {
  try {
    const storage = wrappedValidateAjvStorage({
      storage: getRxStorageDexie(),
    });

    const db = await createRxDatabase({
      name: 'moviesdb',
      storage,
      ignoreDuplicate: true,
    });

    await db.addCollections({
      movies: {
        schema,
      },
    });

    console.log('Database initialized successfully');
    return db;
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
}
