# Typography System Documentation

## Overview
The Reveura wellness application uses a carefully curated, mood-optimized typography system designed to create a calming yet engaging user experience. All fonts and sizes are standardized across the application for consistency.

## Font Families

### 1. **Display Font - Playfair Display (Serif)**
- **Purpose**: Page titles, major headings, premium sections
- **Usage**: h1, `.page-title`, `.page-subtitle`
- **Mood**: Elegant, sophisticated, premium
- **Sizes**: 2.2rem - 3.5rem
- **Font Weights**: 700 (bold), 800, 900
- **Best for**: Hero sections, main page titles, achievement highlights

**Example CSS:**
```css
font-family: var(--font-display);
font-size: var(--font-display-md);
font-weight: 700;
```

### 2. **Heading Font - Sora (Sans-Serif)**
- **Purpose**: Section headings, subheadings, card titles
- **Usage**: h2, h3, h4, h5, `.section-title`
- **Mood**: Modern, geometric, clean, approachable
- **Sizes**: 1.25rem - 1.875rem
- **Font Weights**: 600 (semibold), 700 (bold)
- **Best for**: Section breaks, feature titles, navigation items

**Example CSS:**
```css
font-family: var(--font-heading);
font-size: var(--font-heading-md);
font-weight: 700;
```

### 3. **Subheading Font - DM Sans (Sans-Serif)**
- **Purpose**: Secondary headings, labels, form titles
- **Usage**: `.text-subheading-*`, `.form-label`
- **Mood**: Clear, friendly, professional
- **Sizes**: 1rem - 1.125rem
- **Font Weights**: 500 (medium), 600 (semibold)
- **Best for**: Form labels, card subtitles, secondary information

**Example CSS:**
```css
font-family: var(--font-subheading);
font-size: var(--font-subheading-md);
font-weight: 600;
```

### 4. **Body Font - Outfit (Sans-Serif)**
- **Purpose**: Body text, descriptions, long-form content
- **Usage**: p, `.text-body-*`, general body text
- **Mood**: Warm, approachable, readable
- **Sizes**: 0.75rem - 1.0625rem
- **Font Weights**: 300 (light), 400 (normal), 500 (medium)
- **Best for**: Paragraphs, descriptions, readable content

**Example CSS:**
```css
font-family: var(--font-body);
font-size: var(--font-body-md);
font-weight: 400;
line-height: var(--leading-normal);
```

### 5. **Accent Font - Poppins (Sans-Serif)**
- **Purpose**: CTAs, badges, emphasis text
- **Usage**: `.text-accent*`, button text, energetic elements
- **Mood**: Energetic, modern, attention-grabbing
- **Sizes**: 0.75rem - 1.0625rem
- **Font Weights**: 500 (medium), 600 (semibold), 700 (bold)
- **Best for**: Buttons, badges, interactive elements

**Example CSS:**
```css
font-family: var(--font-accent);
font-weight: 600;
letter-spacing: var(--tracking-wide);
```

## Font Sizes Scale

```
Desktop Sizes:
- Display Large: 3.5rem (56px)
- Display Medium: 2.8rem (44.8px)
- Display Small: 2.2rem (35.2px)
- Heading Large: 1.875rem (30px)
- Heading Medium: 1.5rem (24px)
- Heading Small: 1.25rem (20px)
- Subheading Large: 1.125rem (18px)
- Subheading Medium: 1rem (16px)
- Body Large: 1.0625rem (17px)
- Body Medium: 0.95rem (15.2px)
- Body Small: 0.875rem (14px)
- Body XS: 0.75rem (12px)

Mobile Sizes (768px and below):
- All sizes reduce by 1-2 steps for readability
```

## Line Heights

- **Tight** (1.2): Headlines, display text
- **Snug** (1.4): Subheadings, labels
- **Normal** (1.6): Body text, primary content
- **Relaxed** (1.75): Long-form content, increased readability

## Letter Spacing

- **Tight** (-0.02em): Display fonts with uppercase
- **Normal** (0em): Default spacing
- **Wide** (0.02em): Accent fonts, buttons
- **Wider** (0.05em): Small caps, labels

## Usage Guidelines

### Page Titles
```jsx
<h1 className="page-title" style={{ fontFamily: "var(--font-display)" }}>
  Welcome to Reveura
</h1>
```

### Section Headings
```jsx
<h2 className="section-title" style={{ fontFamily: "var(--font-heading)" }}>
  Your Wellness Dashboard
</h2>
```

### Body Paragraphs
```jsx
<p className="text-body-md" style={{ fontFamily: "var(--font-body)" }}>
  Your mental health journey matters...
</p>
```

### Form Labels
```jsx
<label className="form-label" style={{ fontFamily: "var(--font-subheading)" }}>
  Full Name
</label>
```

### Buttons
```jsx
<button className="btn-text" style={{ fontFamily: "var(--font-accent)" }}>
  Save Changes
</button>
```

## Mood Psychology

Each font was selected to enhance the wellness experience:

1. **Playfair Display** - Creates a sense of premium care and sophistication
2. **Sora** - Provides modern, clean navigation without stress
3. **DM Sans** - Clear communication builds trust and clarity
4. **Outfit** - Warm and approachable for comfortable reading
5. **Poppins** - Energetic and motivating for calls-to-action

## Accessibility

- Minimum font size: 12px (body-xs)
- Minimum line height: 1.2 (maintained 1.4-1.75 for optimal readability)
- High contrast ratios maintained across all themes
- Font weights chosen for clarity (not too light, not too heavy)

## Browser Support

- All fonts sourced from Google Fonts
- Variable fonts used where available for performance
- Fallbacks: Sans-serif → serif depending on font family
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## Performance

- Total font load: ~185KB (gzipped)
- Fonts are lazy-loaded with display:swap
- Subset to Latin characters for faster loading
- CSS custom properties used for easy theme switching

## Migration Guide

If updating existing code to use this typography system:

**Old:**
```jsx
<h1 style={{ fontFamily: "'Playfair Display', serif" }}>Title</h1>
```

**New:**
```jsx
<h1 style={{ fontFamily: "var(--font-display)" }} className="page-title">
  Title
</h1>
```

## CSS Custom Properties

All fonts are available as CSS variables:
- `var(--font-display)` - Playfair Display
- `var(--font-heading)` - Sora
- `var(--font-subheading)` - DM Sans
- `var(--font-body)` - Outfit
- `var(--font-accent)` - Poppins

Sizes:
- `var(--font-display-lg/md/sm)`
- `var(--font-heading-lg/md/sm)`
- `var(--font-subheading-lg/md)`
- `var(--font-body-lg/md/sm/xs)`

Line heights:
- `var(--leading-tight/snug/normal/relaxed)`

Letter spacing:
- `var(--tracking-tight/normal/wide/wider)`
