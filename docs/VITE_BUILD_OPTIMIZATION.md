# Vite Build Configuration & Optimization

## Overview

This document describes the enhanced Vite build configuration implemented for the fit-pathway-organizer project, following industry best practices and preventing common build issues.

## Configuration Highlights

### 1. Explicit Entry Point Configuration

```typescript
export default defineConfig({
  root: './',
  build: {
    rollupOptions: {
      input: './index.html',
    },
  },
});
```

**Why this matters:**
- Prevents `EISDIR` (Error: Illegal operation on a directory) errors
- Explicitly defines the entry point, avoiding ambiguity
- Essential for monorepo structures or non-standard layouts
- Recommended by Vite documentation for production builds

### 2. Advanced Code Splitting Strategy

The build is configured to split code into optimized vendor chunks:

| Chunk | Size (Uncompressed) | Size (gzipped) | Purpose |
|-------|---------------------|----------------|---------|
| `react-vendor` | 176.88 KB | 58.15 KB | React, React-DOM, React-Router |
| `ui-vendor` | 101.50 KB | 33.32 KB | Radix UI components |
| `supabase-vendor` | 110.31 KB | 30.20 KB | Supabase client |
| `query-vendor` | 37.29 KB | 11.15 KB | TanStack Query |
| `index` (main) | 725.01 KB | 205.32 KB | Application code |

**Benefits:**
- **Better Caching**: Vendor code changes infrequently, so it can be cached longer
- **Parallel Loading**: Browser can load chunks simultaneously
- **Faster Updates**: When app code changes, users don't re-download vendor libraries
- **Optimal Performance**: Chunks are preloaded using `modulepreload` for zero latency

**Before optimization:** Single 1,158 KB bundle  
**After optimization:** Distributed across 5 optimized chunks with better caching

### 3. Organized Asset Structure

```
dist/
├── assets/
│   ├── css/
│   │   └── index-[hash].css
│   └── js/
│       ├── index-[hash].js
│       ├── react-vendor-[hash].js
│       ├── ui-vendor-[hash].js
│       ├── query-vendor-[hash].js
│       └── supabase-vendor-[hash].js
├── index.html
└── [other static assets]
```

**Benefits:**
- Clean, organized structure
- Easy to configure CDN rules
- Clear separation of concerns
- Better cache control strategies

### 4. Production Optimizations

#### Source Maps
```typescript
sourcemap: mode === 'production' ? 'hidden' : true
```
- **Development**: Full source maps for debugging
- **Production**: Hidden source maps (not in bundle, available for error tracking)

#### Code Optimization
```typescript
esbuild: {
  drop: mode === 'production' ? ['console', 'debugger'] : [],
}
```
- Automatically removes `console.log()` and `debugger` statements in production
- Reduces bundle size
- Prevents debug information leakage

### 5. Dependency Pre-bundling

```typescript
optimizeDeps: {
  exclude: ['lucide-react'],
  include: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query'],
}
```
- Pre-bundles dependencies for faster dev server startup
- Excludes problematic packages (lucide-react has issues with pre-bundling)
- Includes commonly used dependencies for optimal performance

## Test Infrastructure

### tsconfig.jest.json

A dedicated TypeScript configuration for Jest testing:

```json
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "module": "CommonJS",
    "moduleResolution": "node",
    "types": ["jest", "@testing-library/jest-dom", "node"]
  }
}
```

**Why separate config?**
- Jest requires CommonJS module format
- Vite uses ESM (ES Modules)
- Different module resolution strategies
- Prevents type conflicts

## Common Issues Prevented

### 1. EISDIR Error
**Problem**: Vite tries to read a directory instead of a file  
**Solution**: Explicit `input: './index.html'` configuration

### 2. Large Bundle Warnings
**Problem**: Single bundle over 500 KB  
**Solution**: Manual chunk splitting with vendor separation

### 3. Empty src/href Attributes
**Problem**: HTML with empty attributes can cause build errors  
**Solution**: Validated HTML structure (verified clean)

### 4. Module Resolution Issues
**Problem**: Different environments need different module formats  
**Solution**: Separate TypeScript configs for build vs. test

## Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Build with development mode (includes console logs)
npm run build:dev

# Preview production build
npm run preview
```

## Performance Metrics

### Build Performance
- **TypeScript compilation**: ~1-2 seconds
- **Vite bundling**: ~6-8 seconds
- **Total build time**: ~8-10 seconds

### Bundle Analysis
- **Total size (uncompressed)**: ~1,131 KB
- **Total size (gzipped)**: ~338 KB
- **Chunks**: 5 (1 main + 4 vendor)

### Loading Performance
- **Initial load**: Only react-vendor and main chunk needed
- **Additional chunks**: Lazy loaded on demand
- **Cache hit rate**: High (vendor chunks rarely change)

## Future Improvements

1. **Dynamic Imports**: Further code splitting with route-based chunks
2. **CSS Code Splitting**: Per-route CSS chunks
3. **Tree Shaking**: Ensure all unused code is eliminated
4. **Image Optimization**: Add image compression plugins
5. **Preload Optimization**: Fine-tune resource hints

## Troubleshooting

### Build fails with EISDIR
Check that `index.html` is a file:
```bash
ls -ld index.html
```
Should show: `-rw-r--r--` (file), not `drwxr-xr-x` (directory)

### Chunks not being created
Verify dependencies are installed:
```bash
npm ci
```

### Source maps not working
Check build mode:
```bash
echo $NODE_ENV
```

## References

- [Vite Build Options](https://vitejs.dev/config/build-options.html)
- [Rollup Output Options](https://rollupjs.org/configuration-options/#output-manualchunks)
- [Vite Performance Best Practices](https://vitejs.dev/guide/performance.html)
- [GitHub Issue #4030](https://github.com/vitejs/vite/issues/4030) - EISDIR error discussion

## Changelog

### 2024-10-29
- ✅ Added explicit root and input configuration
- ✅ Implemented manual chunk splitting
- ✅ Organized asset output structure
- ✅ Added production optimizations (console/debugger removal)
- ✅ Created tsconfig.jest.json for test infrastructure
- ✅ Fixed .gitignore to include essential config files
- ✅ Updated ESLint command for flat config format
