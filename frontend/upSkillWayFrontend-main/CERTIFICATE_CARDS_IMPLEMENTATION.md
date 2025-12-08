# Certificate Section Action Cards Implementation

## Overview
Added three interactive action cards below the "Big Journey" heading in the Certificate section of the Home page.

## Implementation Details

### Location
- **File**: `src/components/home/Certificate.jsx`
- **Section**: After the "Every Big Journey Starts with a Small Step" heading

### Cards Implemented

#### 1. Explore different fields
- **Icon**: Layered stack/layers icon
- **Purpose**: Encourage users to explore various program fields
- **Design**: Clean, minimal icon with text

#### 2. Test your skills & interests
- **Icon**: Gauge/speedometer icon
- **Purpose**: Invite users to assess their skills and interests
- **Design**: Circular gauge with pointer

#### 3. Get a certificate of participation
- **Icon**: Certificate/document icon
- **Purpose**: Highlight the certification benefit
- **Design**: Document with badge/seal

### Design Features
- ✅ White background cards with subtle shadows
- ✅ Hover effect with enhanced shadow
- ✅ Smooth transitions (300ms duration)
- ✅ Consistent spacing and padding
- ✅ Responsive layout with flexbox
- ✅ Custom SVG icons matching the design
- ✅ Gray-900 color scheme for icons and text
- ✅ Medium font weight for readability

### Styling Details
```css
- Background: White (#FFFFFF)
- Border radius: 16px (rounded-2xl)
- Shadow: Medium shadow with hover enhancement
- Padding: 24px horizontal, 24px vertical
- Gap between icon and text: 16px
- Minimum width: 280px per card
- Gap between cards: 24px
```

### Icon Specifications
- Size: 32x32 pixels
- Color: Gray-900 (#1F2937)
- Style: Outlined with 2px stroke width
- Design: Simple, recognizable, professional

### Layout
- Display: Flex row
- Alignment: Center (both horizontal and vertical)
- Spacing: 24px gap between cards
- Margin: 48px top and bottom

## User Interaction
- **Hover Effect**: Shadow increases from medium to large
- **Transition**: Smooth 300ms animation
- **Clickable**: Cards are ready to be linked to respective actions

## Responsive Behavior
The cards are designed to:
- Display in a row on desktop
- Maintain consistent spacing
- Scale appropriately on different screen sizes
- Keep icons and text aligned

## Future Enhancements
To make the cards functional, add onClick handlers:

```javascript
<div 
  className="bg-white rounded-2xl..."
  onClick={() => handleExploreFields()}
  style={{ cursor: 'pointer' }}
>
```

## Integration
The cards seamlessly integrate with the existing Certificate section and appear between the heading and the course cards grid.
