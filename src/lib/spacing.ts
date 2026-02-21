/**
 * Spacing Utility Functions
 * 
 * Provides consistent spacing classes and utilities across the application.
 * All spacing values are defined in globals.css as CSS variables.
 */

import { cn } from './utils';

/**
 * Standard page layout classes
 */
export const pageLayout = {
  // Main page container
  container: 'page-container',
  
  // Content area with standard top padding
  content: 'page-content',
  
  // Content with header offset (for fixed headers)
  contentWithOffset: 'page-content header-offset',
  
  // Footer with standard top margin
  footer: 'footer-spacing',
} as const;

/**
 * Section spacing classes
 */
export const sectionSpacing = {
  // Standard section spacing (top and bottom)
  default: 'section-spacing',
  
  // Top spacing only
  top: 'section-spacing-top',
  
  // Bottom spacing only
  bottom: 'section-spacing-bottom',
  
  // 80px spacing (desktop) / 60px (mobile)
  large: 'spacing-80',
  largeTop: 'spacing-top-80',
  largeBottom: 'spacing-bottom-80',
} as const;

/**
 * Container width classes
 */
export const containerWidth = {
  // Standard max width (1280px)
  default: 'content-max-width',
  
  // Narrow content (768px) - for articles, forms
  narrow: 'content-narrow',
  
  // Wide content (1536px) - for galleries, grids
  wide: 'content-wide',
} as const;

/**
 * Container padding classes
 */
export const containerPadding = {
  // Standard horizontal padding
  default: 'container-padding',
  
  // Combined with max width
  withMaxWidth: 'container-padding content-max-width',
  withNarrowWidth: 'container-padding content-narrow',
  withWideWidth: 'container-padding content-wide',
} as const;

/**
 * Helper function to create a standard page wrapper
 * 
 * @param options - Configuration options
 * @returns Combined class names
 * 
 * @example
 * ```tsx
 * <div className={getPageWrapper()}>
 *   <Header />
 *   <main className={getPageContent()}>
 *     Content here
 *   </main>
 *   <Footer />
 * </div>
 * ```
 */
export function getPageWrapper(options?: {
  className?: string;
}) {
  return cn(
    pageLayout.container,
    options?.className
  );
}

/**
 * Helper function to create a standard page content area
 * 
 * @param options - Configuration options
 * @returns Combined class names
 * 
 * @example
 * ```tsx
 * <main className={getPageContent({ withOffset: true })}>
 *   Content here
 * </main>
 * ```
 */
export function getPageContent(options?: {
  withOffset?: boolean;
  className?: string;
}) {
  return cn(
    options?.withOffset ? pageLayout.contentWithOffset : pageLayout.content,
    options?.className
  );
}

/**
 * Helper function to create a standard section
 * 
 * @param options - Configuration options
 * @returns Combined class names
 * 
 * @example
 * ```tsx
 * <section className={getSection({ spacing: 'large', width: 'narrow' })}>
 *   Section content
 * </section>
 * ```
 */
export function getSection(options?: {
  spacing?: 'default' | 'top' | 'bottom' | 'large' | 'largeTop' | 'largeBottom';
  width?: 'default' | 'narrow' | 'wide';
  padding?: boolean;
  className?: string;
}) {
  const spacing = options?.spacing || 'default';
  const width = options?.width;
  const padding = options?.padding ?? false;

  return cn(
    sectionSpacing[spacing],
    width && containerWidth[width],
    padding && containerPadding.default,
    options?.className
  );
}

/**
 * Helper function to create a standard container
 * 
 * @param options - Configuration options
 * @returns Combined class names
 * 
 * @example
 * ```tsx
 * <div className={getContainer({ width: 'narrow', padding: true })}>
 *   Container content
 * </div>
 * ```
 */
export function getContainer(options?: {
  width?: 'default' | 'narrow' | 'wide';
  padding?: boolean;
  className?: string;
}) {
  const width = options?.width || 'default';
  const padding = options?.padding ?? true;

  return cn(
    containerWidth[width],
    padding && containerPadding.default,
    options?.className
  );
}

/**
 * Spacing values for direct use in Tailwind classes
 * Use these when you need specific spacing values
 */
export const spacingValues = {
  // Header heights
  headerDesktop: '80px',
  headerMobile: '70px',
  topBar: '40px',
  
  // Page spacing
  pageTopDesktop: '80px',
  pageTopMobile: '70px',
  
  // Section spacing
  sectionDesktop: '80px',
  sectionMobile: '60px',
  
  // Footer spacing
  footerTopDesktop: '80px',
  footerTopMobile: '60px',
  
  // Container padding
  containerDesktop: '24px',
  containerMobile: '16px',
} as const;

/**
 * Breakpoint values for consistency
 */
export const breakpoints = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1280px',
  wide: '1536px',
} as const;
