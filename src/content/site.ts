import raw from './site.json';
import { SiteSchema, type Site } from './site.schema';

export const site: Site = SiteSchema.parse(raw);
