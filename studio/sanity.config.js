import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Say Macaroni Studio',

  projectId: 'xbm8duql',
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});
