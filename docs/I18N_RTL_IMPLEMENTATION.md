# Internationalization (i18n) and RTL Support

This document describes the RTL/LTR text direction implementation for the Fit Pathway Organizer application.

## Overview

The application supports multiple languages with proper text directionality:

- **Arabic (ar)**: Right-to-Left (RTL) direction
- **English (en)**: Left-to-Right (LTR) direction

## Implementation Details

### LanguageContext.tsx

The core RTL/LTR enforcement logic is implemented in `src/contexts/LanguageContext.tsx` within the `LanguageProvider` component's `useEffect` hook (lines 494-502).

#### RTL Direction for Arabic

When Arabic is selected (`language === 'ar'`):

```typescript
if (language === "ar") {
  document.documentElement.dir = "rtl";
  document.documentElement.lang = "ar";
}
```

#### LTR Direction for English

For all other languages (currently English):

```typescript
else {
  document.documentElement.dir = 'ltr';
  document.documentElement.lang = language;
}
```

### Global Application

The directionality is applied globally through:

1. **App.tsx**: Wraps the entire application with `<LanguageProvider>`
2. **DOM Level**: Sets `dir` attribute on the root `<html>` element
3. **Automatic**: All components automatically inherit the text direction

### Settings.tsx

The Settings page (`src/pages/Settings.tsx`) provides a language selector that allows users to switch between supported languages. When a language is changed, the `LanguageProvider` automatically updates the document's text direction.

## Benefits

1. **Automatic Layout**: CSS flexbox and grid layouts automatically reverse for RTL
2. **Text Alignment**: Text alignment adapts automatically
3. **Consistent UX**: All UI components respect the selected text direction
4. **Accessibility**: Proper `lang` attribute supports screen readers and assistive technologies

## Testing

To test RTL/LTR enforcement:

1. Navigate to Settings page
2. Change language to Arabic → UI should display RTL
3. Change language to English → UI should display LTR
4. Inspect HTML element → `dir` attribute should reflect current language direction

## Future Enhancements

- Additional RTL languages (e.g., Hebrew, Farsi)
- Per-component direction overrides if needed
- RTL-aware CSS utilities for edge cases
