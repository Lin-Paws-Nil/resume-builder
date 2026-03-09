# Resume Examples Folder Structure

This folder contains template examples organized by template name. Each template has its own subfolder with preview images and example files.

## Folder Structure

```
resume-examples/
├── aurora/
│   ├── preview.png          # Main preview image (required)
│   ├── example-1.png        # Additional example variations (optional)
│   └── README.md            # Template-specific notes
├── hyperion/
│   ├── preview.png
│   └── README.md
├── lunar/
├── stellar/
├── zenith/
├── aether/
├── nebula/
├── eon/
├── cosmos/
├── modern/
├── classic/
└── creative/
```

## Image Requirements

### Preview Images (Required)
- **Filename**: `preview.png` (must be exactly this name)
- **Format**: PNG or JPG
- **Aspect Ratio**: 8.5:11 (US Letter paper size)
- **Recommended Resolution**: 1700 x 2200 pixels
- **File Size**: Optimize for web (aim for < 500KB)
- **Quality**: High-resolution, showing full resume layout clearly

### Additional Examples (Optional)
- You can add multiple example variations per template
- Name them: `example-1.png`, `example-2.png`, etc.
- Use for showing different color variations or layouts
- Same requirements as preview images

## How Images Are Used

1. **Templates Page** (`/templates`):
   - Shows `preview.png` from each template folder
   - Used in the sticky scroll gallery layout
   - Displays with hover overlay and "Use This Template" button

2. **Future Use**:
   - Example images can be used for detailed template pages
   - Can showcase different variations and customizations
   - Useful for marketing and documentation

## Bestseller Templates

Currently marked as bestsellers (2 templates shown in sticky middle column):
- Aurora ⭐
- Modern ⭐

To update bestsellers, modify the `bestsellerIds` array in `/app/templates/page.tsx`.

## Adding a New Template

1. Create a new folder: `public/resume-examples/template-name/`
2. Add `preview.png` image
3. Update templates array in `/app/templates/page.tsx`
4. Add template to appropriate categories

## Notes

- All images should be optimized for web performance
- Maintain consistent visual quality across all templates
- Test images on both desktop and mobile devices
- Each template folder can contain multiple example variations
