# Asset sources

- `show/hero-dragon.png`: original blue/lavender baby dragon generated with imagegen on 23 November 2026 at the user's explicit request to replace the hero illustration with a dragon. Transparent background. It is not an official SHOW mascot or copied third-party character. Used in the restored split hero; previous playground removed.

- `fredoka.ttf`: original variable font from https://github.com/google/fonts/tree/main/ofl/fredoka. License included in `fredoka-OFL.txt`.
- `dm-sans.ttf`: original variable font from https://github.com/google/fonts/tree/main/ofl/dmsans. License included in `dm-sans-OFL.txt`.
- Action icons: code-native SVG paths in `src/components/ui/icon.tsx`. Search, video, worksheet, book, and admin meanings map to real controls.

## SHOW testing assets, added at the user's request

- `show/show-logo.png`: actual SHOW logo downloaded from the Cloudinary URL referenced by https://showtoken.io/.
- `show/show-token.png`: glass token asset referenced by the same website.
- `show/show-kids-avatar.jpg`: avatar of https://www.youtube.com/@showkidsofficial.
- `show/<video-id>.jpg`: actual thumbnails of videos listed on that channel, fetched from YouTube's thumbnail service. Exact source URLs are recorded in `show/sources.json`.
- The homepage uses the SHOW logo and real video thumbnails, not the old prototype illustration. The old illustration remains only as an unused source asset.
- `supabase/fixtures/show-kids-videos.json` and `supabase/seed.sql` contain 12 curated testing records with verified watch URLs and durations from the channel listing. Descriptions are short editorial summaries, not claimed to be official transcripts.

These SHOW assets are included specifically for the testing use requested by the user. No fictional profile images, testimonials, customer counts, or security claims are used.

## Library demo assets

`public/assets/demo/*.svg` and `*.pdf` are original geometric sample covers and printable worksheets created for this assessment. They are not official SHOW learning resources. `supabase/seed-library-demo.sql` contains the corresponding six sample records.

Cover revision: original SVG illustrations now differ by topic. Reference research: https://showtoken.io/ describes family-friendly content; business/film financing news was not imported into parenting articles. No third-party article photos copied. All six covers rendered and inspected locally; existing printable PDFs unchanged.

## Current external parenting photos

Downloaded from Pexels CDN and stored locally on 23 November 2026. Licensed under https://www.pexels.com/license/ . Images illustrate the article topics; depicted people do not endorse SHOW. No news article text copied.

- `demo/reading-photo.jpg`: Tima Miroshnichenko, https://www.pexels.com/photo/photo-of-a-parent-reading-a-book-to-her-children-4908531/
- `demo/playtime-photo.jpg`: Vanessa Loring, https://www.pexels.com/photo/crop-boy-making-paper-craft-7869457/
- `demo/routine-photo.jpg`: Kampus Production, https://www.pexels.com/photo/mother-talking-to-her-son-8035978/

Current `reading.svg`, `playtime.svg`, `routine.svg` embed these photos in a fixed-ratio SVG canvas, retaining seeded URLs. Current worksheet SVGs embed raster previews rendered from the corresponding original bundled PDFs. PDFs and database contents unchanged. All six current wrappers rendered and inspected locally.

## Worksheet photo covers (replaces PDF-preview covers)

- `demo/shapes-photo.jpg`: Towfiqu barbhuiya, https://www.pexels.com/photo/toy-blocks-in-row-11200121/
- `demo/counting-photo.jpg`: Gustavo Fring, https://www.pexels.com/photo/crop-schoolchild-learning-to-count-at-home-with-tutor-4173107/
- `demo/patterns-photo.jpg`: Emre Gokceoglu, https://www.pexels.com/photo/children-engaged-in-educational-activity-at-table-33997598/

Pexels license: https://www.pexels.com/license/ . Downloaded locally; photographs illustrate the topic and are not screenshots of the downloadable PDF or endorsements of SHOW. Existing worksheet SVG URLs now embed these photos. PDF files unchanged. New wrappers rendered and inspected.
