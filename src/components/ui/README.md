# JamSync UI Component Library

A comprehensive design system and component library for the JamSync music collaboration platform.

## Design System

### Colors

The design system uses a carefully crafted color palette:

- **Primary (Purple/Violet)**: Main brand color for CTAs and primary interactions
- **Secondary (Coral/Orange)**: Accent color for highlights and secondary actions
- **Accent (Electric Blue)**: For informational elements and links
- **Success (Green)**: Positive actions and confirmations
- **Warning (Yellow/Amber)**: Warnings and cautions
- **Error (Red)**: Errors and destructive actions
- **Neutral (Grays)**: Text, borders, and backgrounds

### Typography

- **Display**: Large hero text (display-lg, display-md, display-sm)
- **Headings**: Section headings (heading-1 through heading-4)
- **Body**: Regular body text (body-lg, body-md, body-sm, body-xs)
- **Caption**: Small text for metadata (caption, overline)

### Spacing

A consistent spacing scale following Tailwind conventions:
- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `4`: 1rem (16px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- Touch-friendly: `touch` (44px), `touch-lg` (56px)

### Animations

Built-in animations:
- `fade-in`: Smooth fade in
- `slide-up`: Slide up from bottom
- `slide-down`: Slide down from top
- `scale-in`: Scale from 95% to 100%
- `pulse-glow`: Subtle pulsing glow effect

## Components

### Core Components

| Component | Description |
|-----------|-------------|
| `Button` | Primary CTA with variants (primary, secondary, outline, ghost, danger) |
| `Avatar` | User avatar with status indicators (online, offline, recording) |
| `Badge` | Small label for tags, counts, or statuses |
| `Card` | Content container with optional hover effects |
| `IconButton` | Icon-only button with badge support |
| `Waveform` | Audio visualization component |
| `Progress` | Progress bar with multiple sizes and colors |
| `Skeleton` | Loading placeholder with text/circular/rectangular variants |

### Form Elements

| Component | Description |
|-----------|-------------|
| `Input` | Text input with label, error state, and icons |
| `TextArea` | Multi-line text input |
| `Select` | Dropdown select |
| `Checkbox` | Custom checkbox |
| `RadioGroup` | Radio button group |
| `Toggle` | Switch/toggle component |

### Layout Components

| Component | Description |
|-----------|-------------|
| `Tabs` | Tab navigation with underline or pills variants |
| `TabPanel` | Content panel for tabs |
| `SegmentedControl` | iOS-style segmented control |
| `Section` | Section container with title and actions |
| `PageHeader` | Page header with back button support |
| `StatsRow` | Row of statistic clickables |
| `LoadingSpinner` | Loading indicator |
| `FullPageLoader` | Full-page loading overlay |

### Overlay Components

| Component | Description |
|-----------|-------------|
| `Dialog` | Modal dialog with animations |
| `ConfirmDialog` | Confirmation modal with confirm/cancel |
| `BottomSheet` | Bottom sheet for mobile |
| `ToastProvider` | Toast notification system |
| `useToast` | Hook to trigger toast notifications |

### Feedback Components

| Component | Description |
|-----------|-------------|
| `EmptyState` | Empty state with icon, title, action |
| `EmptyTracks` | Pre-styled empty state for tracks |
| `EmptySearch` | Pre-styled empty state for search |
| `EmptyLiked` | Pre-styled empty state for likes |
| `Pagination` | Page navigation |
| `LoadMore` | Load more button |

### Navigation Components

| Component | Description |
|-----------|-------------|
| `Dropdown` | Dropdown menu |
| `DropdownItem` | Individual dropdown item |
| `DropdownMenu` | Full dropdown menu with items |
| `UserMenuDropdown` | User profile dropdown |
| `SearchBar` | Search input with clear button |
| `SearchWithResults` | Search with dropdown results |

### Responsive Components

| Component | Description |
|-----------|-------------|
| `ResponsiveContainer` | Container with max-width |
| `ShowAt` | Show content at breakpoint |
| `HideAt` | Hide content at breakpoint |
| `ResponsiveSwitch` | Switch between mobile/desktop layouts |
| `ResponsiveGrid` | Grid with responsive columns |
| `MobileNav` | Mobile bottom navigation |
| `DesktopSidebar` | Desktop sidebar |
| `SafeArea` | Safe area padding for notched devices |
| `useScreenSize` | Hook for screen dimensions |
| `useBreakpoint` | Hook for current breakpoint |

## Usage

### Basic Button

```tsx
import { Button } from "@/components/ui";

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### Form with Validation

```tsx
import { Input, Button } from "@/components/ui";

<form onSubmit={handleSubmit}>
  <Input
    label="Email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    error={errors.email}
    placeholder="you@example.com"
  />
  <Button type="submit" fullWidth>
    Submit
  </Button>
</form>
```

### Toast Notifications

```tsx
import { useToast } from "@/components/ui";

function MyComponent() {
  const { success, error, info } = useToast();

  const handleAction = () => {
    success("Action completed!");
  };
}
```

### Responsive Layout

```tsx
import { ResponsiveContainer, ShowAt, HideAt } from "@/components/ui";

<ResponsiveContainer>
  <ShowAt breakpoint="md" direction="up">
    <DesktopSidebar />
  </ShowAt>
  <HideAt breakpoint="md" direction="up">
    <MobileNav />
  </HideAt>
</ResponsiveContainer>
```

### Tabs

```tsx
import { Tabs, TabPanel } from "@/components/ui";

const tabs = [
  { id: "tracks", label: "Tracks", count: 24 },
  { id: "remixes", label: "Remixes", count: 8 },
  { id: "liked", label: "Liked", count: 156 },
];

<Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
<TabPanel id="tracks" activeTab={activeTab}>
  <TracksList />
</TabPanel>
```

## Utility Functions

### Formatters

```tsx
import { formatDuration, formatCount, formatRelativeTime } from "@/lib/utils";

// "3:45"
formatDuration(225)

// "1.5K" or "2.3M"
formatCount(1500)
formatCount(2300000)

// "2h ago" or "3d ago"
formatRelativeTime("2024-01-01T00:00:00Z")
```

### Validation

```tsx
import { isValidEmail, isValidUsername } from "@/lib/utils";

isValidEmail("user@example.com") // true
isValidUsername("john_doe") // true
```

### DOM Utilities

```tsx
import { copyToClipboard, debounce, throttle, isMobile } from "@/lib/utils";

// Copy to clipboard
await copyToClipboard("Hello!");

// Debounced search
const handleSearch = debounce((query) => {
  // API call
}, 300);

// Throttled scroll
const handleScroll = throttle(() => {
  // Handle scroll
}, 100);

// Mobile detection
if (isMobile()) {
  // Mobile-specific logic
}
```

## Styling

### Tailwind Classes

The design system extends Tailwind with custom utilities:

```css
/* Scrollbar hiding */
.scrollbar-hide
.no-scrollbar

/* Line clamp */
.line-clamp-1
.line-clamp-2
.line-clamp-3

/* Aspect ratios */
.aspect-9-16
.aspect-16-9
.aspect-1-1

/* Text gradient */
.text-gradient

/* Glass effect */
.glass

/* Bottom sheet handle */
.bottom-sheet-handle
```

### CSS Variables

```css
:root {
  --color-primary: 139 92 246;
  --color-secondary: 249 115 22;
  --color-accent: 59 130 246;
  --background: 250 250 250;
  --foreground: 24 24 27;
}
```

### Dark Mode

The design system supports dark mode out of the box:

```tsx
// Automatically respects system preference
// or use class="dark" on html element
```

## Best Practices

1. **Use design system components** - Don't create custom versions of existing components
2. **Follow color conventions** - Use semantic colors (primary for main actions, error for destructive)
3. **Mobile-first** - Design for mobile first, enhance for desktop
4. **Touch targets** - Minimum 44x44px touch targets
5. **Loading states** - Always show loading states for async operations
6. **Empty states** - Provide meaningful empty states
7. **Responsive images** - Use Next.js Image component with proper sizing

## Contributing

When adding new components:

1. Follow the existing component patterns
2. Add TypeScript types
3. Include prop documentation
4. Support dark mode
5. Test responsive behavior
6. Add to this README
