# Proglog - Libraries & Dependencies

## Core Framework
- **React** - JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript for better development experience

## Styling & UI Framework
- **Tailwind CSS v4.0** - Utility-first CSS framework for styling
- **shadcn/ui** - Re-usable component library built on Radix UI

## UI Components (shadcn/ui)
All components are located in `/components/ui/`:

1. **accordion** - Collapsible content sections
2. **alert-dialog** - Modal dialogs for important actions
3. **alert** - Notification messages
4. **aspect-ratio** - Maintain content aspect ratios
5. **avatar** - User profile images with fallbacks
6. **badge** - Status indicators and labels
7. **breadcrumb** - Navigation hierarchy display
8. **button** - Interactive button components
9. **calendar** - Date selection component
10. **card** - Content containers with header/footer
11. **carousel** - Image/content slider (uses Embla Carousel)
12. **chart** - Data visualization components (uses Recharts)
13. **checkbox** - Toggle checkboxes
14. **collapsible** - Expandable/collapsible panels
15. **command** - Command palette/menu
16. **context-menu** - Right-click context menus
17. **dialog** - Modal overlays
18. **drawer** - Slide-in panels
19. **dropdown-menu** - Dropdown action menus
20. **form** - Form components with validation (uses React Hook Form & Zod)
21. **hover-card** - Hover preview cards
22. **input-otp** - One-time password inputs
23. **input** - Text input fields
24. **label** - Form field labels
25. **menubar** - Application menu bar
26. **navigation-menu** - Site navigation menus
27. **pagination** - Page navigation controls
28. **popover** - Floating content containers
29. **progress** - Progress bars
30. **radio-group** - Radio button groups
31. **resizable** - Resizable panel layouts
32. **scroll-area** - Custom scrollable areas
33. **select** - Dropdown select inputs
34. **separator** - Visual content dividers
35. **sheet** - Side panels/drawers
36. **sidebar** - Navigation sidebar
37. **skeleton** - Loading placeholders
38. **slider** - Range slider inputs
39. **sonner** - Toast notifications
40. **switch** - Toggle switches
41. **table** - Data tables
42. **tabs** - Tabbed content sections
43. **textarea** - Multi-line text inputs
44. **toggle-group** - Toggle button groups
45. **toggle** - Toggle buttons
46. **tooltip** - Hover tooltips

## Icon Library
- **lucide-react** - Beautiful icon library
  - Icons used: Plus, Target, TrendingUp, Clock, Calendar, CheckCircle2, Circle, Edit2, Trash2, Save, X, ListChecks, User, Settings, LogOut, ClipboardList, Menu, ArrowLeft, Pencil, Eraser, Download, Lightbulb, Network, Play, Pause, RotateCcw, Trash2

## Toast Notifications
- **sonner@2.0.3** - Modern toast notification system

## Form Management (if using React Hook Form)
- **react-hook-form@7.55.0** - Form state management and validation
- **zod** - Schema validation library

## Chart/Data Visualization (if using charts)
- **recharts** - Composable charting library

## Carousel (if using carousel)
- **embla-carousel-react** - Carousel/slider library
- **react-slick** - Alternative carousel library

## Additional Utilities
- **class-variance-authority** - Utility for managing component variants
- **clsx** - Utility for constructing className strings
- **tailwind-merge** - Merge Tailwind CSS classes without conflicts

## Component Dependencies by Feature

### Authentication Pages
- Button, Input, Label, Card components
- React state management

### Dashboard
- Navbar, TaskSection, LogsHistory, ProgressDetail components
- Card, Badge, ScrollArea components
- State management for logs and navigation

### Navbar
- Button, DropdownMenu, Sheet (for mobile menu), Avatar
- lucide-react icons (ClipboardList, Menu, User, Settings, LogOut)

### Task Section
- Card, Button, Input, Label, Textarea, Select
- lucide-react icons (Plus, Target, TrendingUp, Clock)
- Toast notifications (sonner)

### Logs History
- Card, Badge, ScrollArea, Button, Input, Label, Textarea, Select, DropdownMenu
- lucide-react icons (Calendar, CheckCircle2, Clock, Circle, Edit2, Trash2, Save, X, ListChecks)
- Toast notifications

### Progress Detail Page
- Card, Badge, Button, Input, Label, Textarea, Tabs, ScrollArea, Progress
- Canvas API (for whiteboard drawing)
- lucide-react icons (ArrowLeft, Pencil, Eraser, Trash2, Download, Lightbulb, Network, Play, Pause, RotateCcw, Plus, X)
- React state hooks (useState, useEffect, useRef)

## Browser APIs Used
- **Canvas API** - For whiteboard drawing functionality
- **Local Storage** (potential) - For persisting user data
- **Date API** - For timestamp management

## Development Dependencies
- **TypeScript** - Type checking
- **ESLint** (typical) - Code linting
- **Prettier** (typical) - Code formatting

## CSS Custom Properties
Located in `/styles/globals.css`:
- Custom color tokens for theming
- Typography defaults
- Tailwind base styles

## Version Notes
- All packages use latest stable versions unless specified
- `sonner` requires version `2.0.3` for proper import syntax
- `react-hook-form` requires version `7.55.0` when used

## Installation Command
```bash
# If this were a real npm project, you would install with:
npm install react react-dom lucide-react sonner@2.0.3 class-variance-authority clsx tailwind-merge

# shadcn/ui components are copied into the project, not installed via npm
```

## Notes
- This is a Figma Make project, so dependencies are managed automatically
- No package.json configuration needed
- All imports work via ESM (ECMAScript Modules) from esm.sh CDN
- Components are self-contained with minimal external dependencies
