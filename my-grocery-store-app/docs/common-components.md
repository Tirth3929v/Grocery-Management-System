# Common Components

This document describes the reusable components shared across the Grocery Store App.

## Navbar

### File Location
`src/components/Common/Navbar.js`

### Purpose
Main navigation bar providing site-wide navigation, search, and user actions.

### Features
- **Logo and Branding**: Clickable logo linking to home.
- **Search Bar**: Global product search with autocomplete.
- **Navigation Links**: Home, Categories, Cart, Profile.
- **User Menu**: Dropdown for logged-in users (profile, logout).
- **Cart Indicator**: Shows item count with badge.
- **Responsive Design**: Collapsible menu for mobile.

### Props
- `setPage`: Function to change current page.
- `loggedInUser`: Current user object or null.
- `setLoggedInUser`: Function to update user state.
- `cart`: Array of cart items.
- `searchTerm`: Current search query.
- `setSearchTerm`: Function to update search.

### State Management
- Mobile menu toggle
- Dropdown visibility

### Key Functions
- `handleSearch`: Updates search term and triggers filtering
- `handleLogout`: Clears user session and redirects
- `toggleMobileMenu`: Shows/hides mobile navigation

### UI Elements
- Flexbox layout with responsive breakpoints
- Search input with magnifying glass icon
- Cart icon with dynamic badge
- User avatar dropdown

## Footer

### File Location
`src/components/Common/Footer.js`

### Purpose
Site footer with links, information, and branding.

### Features
- **Link Sections**: Organized links to important pages.
- **Contact Information**: Address, phone, email.
- **Social Media Links**: Icons linking to social profiles.
- **Newsletter Signup**: Email subscription form.
- **Copyright Notice**: Legal information and year.

### Props
- None (static component)

### UI Elements
- Multi-column layout
- Social media icons
- Newsletter input field
- Separator lines

## ProductCard

### File Location
`src/components/Common/ProductCard.js`

### Purpose
Displays individual product information in a card format.

### Features
- **Product Image**: Main product photo with fallback.
- **Product Details**: Name, price, category.
- **Stock Status**: Availability indicator.
- **Add to Cart**: Button with loading state.
- **Hover Effects**: Enhanced interactivity.
- **Responsive Sizing**: Adapts to container width.

### Props
- `product`: Product object with all details.
- `addToCart`: Function to add product to cart.

### State Management
- Loading state for add to cart action

### Key Functions
- `handleAddToCart`: Calls prop function with product ID

### UI Elements
- Card container with shadow
- Image with aspect ratio
- Price display with currency
- Action button with icon

## Button

### File Location
`src/components/Common/Button.js`

### Purpose
Reusable button component with consistent styling and behavior.

### Features
- **Variants**: Primary, secondary, outline, ghost.
- **Sizes**: Small, medium, large.
- **States**: Normal, hover, active, disabled.
- **Loading State**: Spinner and disabled during async actions.
- **Icons**: Optional left/right icons.
- **Full Width**: Block-level button option.

### Props
- `children`: Button text or content.
- `onClick`: Click handler function.
- `variant`: Style variant (default: 'primary').
- `size`: Size variant (default: 'medium').
- `disabled`: Boolean for disabled state.
- `loading`: Boolean for loading state.
- `icon`: Icon component or element.
- `iconPosition`: 'left' or 'right'.
- `fullWidth`: Boolean for full width.

### UI Elements
- Styled button element
- Conditional spinner
- Icon positioning

## Input

### File Location
`src/components/Common/Input.js`

### Purpose
Form input component with validation and styling.

### Features
- **Input Types**: Text, email, password, number, etc.
- **Validation States**: Valid, invalid with error messages.
- **Icons**: Left/right icons for context.
- **Labels**: Associated label text.
- **Placeholders**: Helper text when empty.
- **Required Indicator**: Visual required field marker.

### Props
- `type`: HTML input type.
- `placeholder`: Placeholder text.
- `value`: Controlled value.
- `onChange`: Change handler.
- `error`: Error message string.
- `label`: Label text.
- `required`: Boolean for required field.
- `icon`: Icon element.
- `iconPosition`: 'left' or 'right'.

### State Management
- Focus/blur states for styling

### UI Elements
- Label element
- Input wrapper with border
- Error message below input
- Icon positioning

## Card

### File Location
`src/components/Common/Card.js`

### Purpose
Container component for grouping related content.

### Features
- **Header**: Optional title and actions.
- **Body**: Main content area.
- **Footer**: Bottom section for actions.
- **Variants**: Default, outlined, elevated.
- **Padding**: Consistent internal spacing.
- **Hover Effects**: Interactive cards.

### Props
- `children`: Card content.
- `title`: Header title.
- `actions`: Header action buttons.
- `footer`: Footer content.
- `variant`: Visual variant.
- `hoverable`: Boolean for hover effects.

### UI Elements
- Card container with shadow
- Header section
- Content area
- Footer section

## Component Design Principles

### Consistency
- Shared design tokens (colors, spacing, typography)
- Consistent prop interfaces
- Unified styling approach

### Reusability
- Generic prop structures
- Conditional rendering for variants
- Extensible component APIs

### Accessibility
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### Performance
- Minimal re-renders with memoization
- Efficient event handling
- Optimized bundle size

## Styling Approach

### Tailwind CSS
- Utility-first CSS framework
- Responsive design utilities
- Dark mode support (future)

### CSS Modules (Alternative)
- Scoped styles to prevent conflicts
- Dynamic class names
- Theme support

### Design System
- Color palette
- Typography scale
- Spacing scale
- Component tokens

## Testing

### Unit Tests
- Component rendering
- Prop handling
- Event simulation
- State updates

### Visual Regression
- Screenshot comparisons
- Cross-browser testing
- Responsive breakpoint testing

### Accessibility Testing
- Automated a11y checks
- Manual screen reader testing
- Keyboard navigation verification

## Future Enhancements

- **Theme Support**: Light/dark mode toggle
- **Animation Library**: Smooth transitions and micro-interactions
- **Icon Library**: Consistent icon set
- **Form Components**: More specialized form inputs (select, datepicker)
- **Layout Components**: Grid, flexbox helpers
- **Feedback Components**: Toast notifications, modals, tooltips

These common components form the foundation of the UI, ensuring consistency and maintainability across the application.
