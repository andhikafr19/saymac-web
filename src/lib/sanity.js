import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: 'xbm8duql',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  if (!source) return null;
  if (typeof source === 'string') return source;
  return builder.image(source);
}
