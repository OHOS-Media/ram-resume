import { defineField, defineType } from "sanity";

export const homePageType = defineType({
  name: "homepage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "versionName", title: "Version Name", type: "string" }),
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        { name: "title", title: "Title", type: "string" },
        { name: "gradientTitle", title: "Gradient Title", type: "string" },
        { name: "description", title: "Description", type: "text" },
        { name: "ctaText", title: "CTA Button Text", type: "string" },
      ],
      options: {
        collapsed: true,
      },
    }),
    defineField({
      name: "features",
      title: "Features Section",
      type: "object",
      fields: [
        { name: "title", title: "Title", type: "string" },
        {
          name: "featureItems",
          title: "Feature Items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "title", title: "Title", type: "string" },
                { name: "description", title: "Description", type: "string" },
                { name: "icon", title: "Feature Icon", type: "image", options: { hotspot: true } },
                { name: "iconAlt", title: "Feature Icon Alt Text", type: "string" },
              ],
            },
          ],
        },
      ],
      options: {
        collapsed: true,
      },
    }),
    defineField({
      name: "demo",
      title: "Demo Section",
      type: "object",
      fields: [
        { name: "title", title: "Title", type: "string" },
        { name: "description", title: "Description", type: "text" },
        { name: "checkboxItems", title: "CheckboxItems", type: "array", of: [{ type: "string" }] },
        { name: "demoImage", title: "Demo Image", type: "image", options: { hotspot: true } },
      ],
      options: {
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "versionName",
    },
  },
});