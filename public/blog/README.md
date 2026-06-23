# Blog cover images

Drop each post's cover image here as a PNG named after the post's slug:

```
public/blog/<slug>.png
```

For example, the post at `/blog/ai-receptionist-for-hair-salons` uses
`public/blog/ai-receptionist-for-hair-salons.png`.

If an image is missing, the site automatically shows an on-brand gradient
placeholder (see `components/ui/CoverImage.tsx`), so the blog never displays a
broken image.

Recommended size: 1200×630 (also used for social / OpenGraph previews).
