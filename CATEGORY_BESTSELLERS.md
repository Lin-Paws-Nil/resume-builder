# Category-Specific Bestsellers Configuration

## Overview

Each category tab now has its own bestseller templates that display in the sticky middle column with gold badges.

## Current Configuration

```typescript
const categoryBestsellers = {
  'All templates': ['aurora', 'modern'],
  'Simple': ['lunar', 'zenith'],
  'Professional': ['hyperion', 'stellar'],
  'Modern': ['aurora', 'modern'],
  'ATS': ['aurora', 'hyperion'],
  'Two columns': ['aurora', 'stellar'],
};
```

## How It Works

1. **User selects a tab** (e.g., "Simple")
2. **System filters templates** to only show Simple category templates
3. **Middle column shows** the 2 bestsellers for that category (Lunar & Zenith)
4. **Bestseller badge** appears next to template name
5. **Left & right columns** show remaining templates

## Updating Bestsellers

To update bestsellers based on actual usage data:

1. Open `/app/templates/page.tsx`
2. Find the `categoryBestsellers` object
3. Update the template IDs for each category

### Example:

```typescript
// If Eon becomes most popular in Simple category:
'Simple': ['eon', 'lunar'],  // Changed from ['lunar', 'zenith']

// If Cosmos becomes most popular in Professional:
'Professional': ['cosmos', 'hyperion'],  // Changed from ['hyperion', 'stellar']
```

## Template IDs Reference

- `aurora` - Aurora
- `hyperion` - Hyperion
- `lunar` - Lunar
- `stellar` - Stellar
- `zenith` - Zenith
- `aether` - Aether
- `nebula` - Nebula
- `eon` - Eon
- `cosmos` - Cosmos
- `modern` - Modern
- `classic` - Classic
- `creative` - Creative

## Features

✅ **Category-specific bestsellers** - Each tab has its own top 2
✅ **Smart fallback** - If bestsellers not available, shows first 2 templates
✅ **Dynamic filtering** - Updates based on selected category
✅ **Gold badge** - Only shows on designated bestsellers
✅ **Sticky positioning** - Middle column sticks while scrolling

## Testing

Try switching between tabs to see different bestsellers:
- **All templates**: Aurora ⭐, Modern ⭐
- **Simple**: Lunar ⭐, Zenith ⭐
- **Professional**: Hyperion ⭐, Stellar ⭐
- **Modern**: Aurora ⭐, Modern ⭐
- **ATS**: Aurora ⭐, Hyperion ⭐
- **Two columns**: Aurora ⭐, Stellar ⭐
