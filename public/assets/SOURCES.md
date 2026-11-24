# Asset sources

- `show/hero-dragon.png`: original blue/lavender baby dragon generated with imagegen on 23 November 2026 at the user's explicit request to replace the hero illustration with a dragon. Transparent background. It is not an official SHOW mascot or copied third-party character. Used in the restored split hero; previous playground removed.

- `discovery.svg`: extracted from the user-provided `show_kids_prototype.html`, reusing its existing inline SVG. It is not presented as official SHOW artwork. No characters from Khan Academy Kids or PBS Kids were copied.
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

`public/assets/demo/*.svg` and `*.pdf` are original geometric sample covers and printable worksheets created for this assessment. They are not official SHOW learning resources. Reproduce them with `python scripts/create-demo-assets.py` (requires ReportLab). `supabase/seed-library-demo.sql` contains the corresponding six sample records.
