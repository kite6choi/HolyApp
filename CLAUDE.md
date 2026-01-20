# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HolySeeds Church web application - a bilingual (Korean/English) church media platform for searching and accessing sermons and praise songs. Built as a Progressive Web App (PWA) with Next.js 16 and Supabase.

## Development Commands

```bash
npm run dev    # Start development server on http://localhost:3000
npm run build  # Build for production
npm run start  # Run production server
npm run lint   # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1.2 (App Router)
- **Language**: TypeScript with strict mode enabled
- **Backend**: Supabase (PostgreSQL database, Storage, and client SDK)
- **Styling**: CSS-in-JS with inline styles + global CSS variables
- **Fonts**: Pretendard (Korean), Inter (English)

### Directory Structure

```
src/app/
├── layout.tsx              # Root layout with header/footer
├── page.tsx               # Home page with feature cards
├── globals.css            # Design system (glassmorphism theme)
├── lib/
│   └── supabase.ts       # Supabase client singleton
├── admin/
│   ├── page.tsx          # Admin dashboard
│   └── upload/page.tsx   # Content upload form
├── search/
│   ├── sermon/page.tsx   # Sermon search & results
│   └── praise/page.tsx   # Praise search & results
└── alarm/page.tsx        # Alarm settings (UI only)
```

### Data Model

**Supabase Tables:**

1. `sermons`
   - `id` (auto-generated)
   - `title` (text)
   - `date` (date)
   - `video_url` (text, typically YouTube)
   - `audio_url` (text, from Supabase Storage)

2. `praises`
   - `id` (auto-generated)
   - `title` (text)
   - `lyrics` (text, first line of lyrics)
   - `video_url` (text, typically YouTube)
   - `audio_url` (text, from Supabase Storage)

**Supabase Storage:**
- Bucket: `audio` (public)
- Path structure: `{sermon|praise}/{timestamp}_{random}.{ext}`

### Key Patterns

**Client Components**: All interactive pages use `"use client"` directive at the top since they use React hooks (useState, useEffect) or event handlers.

**Supabase Queries**:
- Import from `@/app/lib/supabase`
- Use `.from()` for table queries, `.storage` for file operations
- Search uses `.ilike()` for case-insensitive matching
- Praise search uses `.or()` for title OR lyrics matching

**Styling Approach**:
- Glassmorphism design with CSS variables defined in [globals.css](src/app/globals.css)
- All styles inline using React `style` prop
- Key CSS classes: `.glass-card`, `.text-gradient`, `.btn-primary`, `.fade-in`
- Responsive grid: `gridTemplateColumns: 'repeat(auto-fit, minmax(...))'`
- Dark mode auto-switches via `prefers-color-scheme`

**Path Aliases**: Use `@/` to reference `src/` directory (configured in [tsconfig.json](tsconfig.json#L21-L23))

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Design System

**Color Palette** (from [globals.css](src/app/globals.css#L3-L19)):
- Primary: `#2D5BFF` (Deep Electric Blue)
- Secondary: `#00D1FF` (Neon Cyan)
- Accent: `#FF4D00` (Energy Orange)

**Layout Constants**:
- Max width: `1080px`
- Header height: `80px`
- Border radius: XL=36px, LG=24px, MD=16px

**Typography**:
- Headings: font-weight 800, letter-spacing -0.05em
- Body: Pretendard/Inter, font-weight 400-700
- Muted text: `var(--text-muted)` color

## Common Tasks

### Adding a new page
1. Create `src/app/your-route/page.tsx`
2. Add `"use client"` if using interactivity
3. Use `.glass-card` and `.container` for consistent layout
4. Add back navigation: `<a href="/">← BACK TO HOME</a>`

### Querying Supabase data
```typescript
import { supabase } from "@/app/lib/supabase";

const { data, error } = await supabase
  .from("table_name")
  .select("*")
  .ilike("column", `%${searchTerm}%`);
```

### Uploading to Supabase Storage
```typescript
const { error } = await supabase.storage
  .from('audio')
  .upload(filePath, file);

const { data: { publicUrl } } = supabase.storage
  .from('audio')
  .getPublicUrl(filePath);
```

## Notes

- All user-facing text is in Korean; UI labels are in English
- Video links are external (YouTube); audio files stored in Supabase
- Admin pages have no authentication (intentionally public for now)
- Alarm feature is UI-only placeholder (no backend logic implemented)
- PWA manifest configured at [public/manifest.json](public/manifest.json)
