import { z } from 'zod';

const ImageAssetSchema = z.object({
  avif: z.string(),
  webp: z.string(),
  fallback: z.string()
});

const ImageWithAltSchema = ImageAssetSchema.extend({
  alt: z.string()
});

const LinkSchema = z.object({
  label: z.string(),
  href: z.string()
});

export const SiteSchema = z.object({
  meta: z.object({
    title: z.string(),
    description: z.string(),
    domain: z.string(),
    url: z.string(),
    ogImage: z.string(),
    ogImageAlt: z.string(),
    favicon: z.string()
  }),
  brand: z.object({
    name: z.string(),
    logo: z.string(),
    tagline: z.string(),
    location: z.string()
  }),
  navigation: z.array(LinkSchema),
  uberEats: z.object({
    label: z.string(),
    href: z.string()
  }),
  hero: z.object({
    title: z.string(),
    subcopy: z.string(),
    trust: z.string(),
    image: z.object({
      alt: z.string(),
      desktop: ImageAssetSchema,
      mobile: ImageAssetSchema
    })
  }),
  products: z.object({
    title: z.string(),
    intro: z.string(),
    ctaLabel: z.string(),
    items: z.array(
      z.object({
        title: z.string(),
        copy: z.string(),
        linkLabel: z.string(),
        image: ImageWithAltSchema
      })
    )
  }),
  promise: z.object({
    title: z.string(),
    background: ImageWithAltSchema,
    bullets: z.array(
      z.object({
        title: z.string(),
        copy: z.string()
      })
    )
  }),
  origin: z.object({
    title: z.string(),
    body: z.string(),
    ctaLabel: z.string(),
    image: ImageWithAltSchema
  }),
  reviews: z.object({
    title: z.string(),
    items: z.array(
      z.object({
        quote: z.string(),
        name: z.string(),
        meta: z.string().optional()
      })
    )
  }),
  howTo: z.object({
    title: z.string(),
    stepLabel: z.string(),
    ctaLabel: z.string(),
    steps: z.array(
      z.object({
        title: z.string(),
        body: z.string()
      })
    ),
    background: ImageWithAltSchema
  }),
  location: z.object({
    kicker: z.string(),
    title: z.string(),
    uberLabel: z.string(),
    uberHref: z.string(),
    social: z.array(LinkSchema)
  }),
  footer: z.object({
    note: z.string(),
    privacyLabel: z.string(),
    privacyHref: z.string(),
    lockup: z.string(),
    trustLine: z.string().optional()
  }),
  privacy: z.object({
    title: z.string(),
    summary: z.string(),
    updated: z.string(),
    body: z.array(z.string())
  })
});

export type Site = z.infer<typeof SiteSchema>;
