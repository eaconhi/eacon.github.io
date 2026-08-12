# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-08-12
- Primary product surfaces: bilingual resume website, project case studies, education and resume access form, downloadable PDF resume
- Evidence reviewed: `app/page.tsx`, `app/globals.css`, `components/hero.tsx`, `components/site-header.tsx`, `components/private-access.tsx`, `lib/profile-data.ts`, current desktop and 390 x 844 live screenshots

## Brand
- Personality: clear, practical, careful, capable, calm and contemporary
- Trust signals: specific responsibilities, explainable workflows, official source links, careful separation between institutional context and personal contribution
- Avoid: unsupported performance claims, implying institution-wide metrics are personal achievements, overly technical AI positioning, decorative complexity that slows resume scanning

## Product goals
- Goals: help recruiters understand Eacon's professional direction quickly; demonstrate requirement clarification, content review, project follow-up and AI-assisted delivery; convert qualified interest into contact or resume access
- Non-goals: presenting Eacon as a full-time software engineer; exposing confidential member, award or partner information; turning the resume into a marketing landing page
- Success signals: visitors can identify the professional position in the first viewport, open at least two concrete case studies, switch to a fully English resume, and submit one clear access form

## Personas and jobs
- Primary personas: recruiters, hiring managers, education or knowledge-organization teams, and project or content operations leads
- User jobs: scan the profile, verify the career story, understand concrete contribution, inspect AI-assisted working methods, download the resume, contact Eacon
- Key contexts of use: mobile links from WeChat or recruiting platforms, desktop interview preparation, English review by international partners

## Information architecture
- Primary navigation: About, Experience, Projects, Skills, Education, Contact
- Core routes/screens: one-page bilingual profile with in-page project case studies and a single resume access form
- Content hierarchy: positioning, career story, capabilities, experience, evidence-backed cases, skills and methods, education access, contact

## Design principles
- Proof before polish: concrete actions and delivery checks carry more weight than decorative claims
- One clear action per task: one form submission unlocks both education and the PDF; contact remains direct and separate
- Bilingual parity: English mode must contain no Chinese visible text and must preserve the same facts, caveats and case-study depth
- Mobile scanning: content must wrap safely at 390 px, with touch targets and disclosure controls that do not shift the layout unexpectedly
- Tradeoffs: institution-wide metrics are excluded from the resume's primary narrative; case studies explicitly label scope and personal contribution

## Visual language
- Color: off-white base, black ink, mint, violet and electric blue accents; later sections may use restrained gradients without reducing contrast
- Typography: large first-viewport identity, compact section headings, readable body text with no viewport-scaled font sizes
- Spacing/layout rhythm: constrained `section-shell`, generous section bands, denser cards for repeatable information
- Shape/radius/elevation: existing soft cards and pill tags; interactive case disclosures use the same radius and border system
- Motion: restrained reveal, hover and marquee motion; content remains usable with reduced motion
- Imagery/iconography: current professional portrait and Lucide icons

## Components
- Existing components to reuse: `SiteHeader`, `Hero`, `SectionHeading`, `ProtectedEducation`, `ProtectedResumeDownload`, `CopyEmail`
- New/changed components: accessible project case disclosure; one shared Tally access form; unlocked resume call-to-action
- Variants and states: Chinese/English, locked/unlocked, case collapsed/expanded, form loading/submitted/error
- Token/component ownership: global visual tokens in `app/globals.css`; localized content in `lib/profile-data.ts`; access behavior in `components/private-access.tsx`

## Accessibility
- Target standard: practical WCAG 2.1 AA
- Keyboard/focus behavior: native buttons and disclosures; visible focus; no click-only card behavior
- Contrast/readability: dark text on light sections and white text on the contact band; no low-contrast text for essential content
- Screen-reader semantics: correct language attribute, headings, button labels, expanded state and descriptive links
- Reduced motion and sensory considerations: honor `prefers-reduced-motion`; information must not depend on animation

## Responsive behavior
- Supported breakpoints/devices: 390 x 844 mobile baseline, tablet and 1280 px desktop
- Layout adaptations: single-column hero and case studies on mobile; multi-column grids only when content remains readable
- Touch/hover differences: project details use explicit buttons; external links remain separate touch targets

## Interaction states
- Loading: Tally iframe reserves stable height
- Empty: project cards without public links must not show a false `View details` affordance
- Error: Tally owns validation and submission errors
- Success: one Tally submission unlocks education and the PDF for the current browser
- Disabled: no custom disabled state is required outside the embedded form
- Offline/slow network: show the reserved form surface and a direct Tally link as fallback

## Content voice
- Tone: professional, specific, modest and interview-explainable
- Terminology: `AI-assisted delivery`, `Codex-assisted work`, `task decomposition`, `content review`, `delivery acceptance`; avoid implying independent software development or spoken-English proficiency
- Microcopy rules: distinguish `institutional context` from `personal contribution`; use `supports`, `participates`, or `leads` according to evidence

## Implementation constraints
- Framework/styling system: Next.js 14 static export, React, Tailwind utilities and global CSS
- Design-token constraints: extend the existing palette and components; no new design-system dependency
- Performance constraints: static GitHub Pages deployment, optimized portrait, no heavy case-study media
- Compatibility constraints: GitHub Pages base path, Tally iframe messaging, persistent language and access state in local storage
- Test/screenshot expectations: successful production build; zero Chinese visible text in English mode; no horizontal overflow at 390 px and 1280 px; case disclosure and form unlock flow verified

## Open questions
- [ ] Tally owner: sign in and make the phone field optional; this cannot be changed from the public form or repository
- [ ] Content owner: add non-confidential personal output counts when reliable source records are available
