# Company Logos Slider Implementation

## Overview
Added an animated left-to-right scrolling slider for company logos in the College Training page.

## Implementation Details

### Location
- **File**: `src/Pages/CollegeTraining.jsx`
- **Section**: "Trusted By Leading Organizations Worldwide"

### Features
- ✅ Smooth continuous left-to-right scrolling animation
- ✅ Seamless infinite loop (logos repeat without gaps)
- ✅ Pause on hover for better user interaction
- ✅ Responsive design
- ✅ Grayscale effect with opacity for professional look
- ✅ 20-second animation duration for smooth viewing

### Technical Implementation

#### Animation
```css
@keyframes scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
```

#### Key Features
1. **Infinite Loop**: Logos are duplicated to create seamless scrolling
2. **Hover Pause**: Animation pauses when user hovers over the slider
3. **Smooth Transition**: Linear animation for consistent speed
4. **Responsive**: Works on all screen sizes

### Company Logos Included
- Google+
- Microsoft
- MetalLB
- LinkedIn
- Instagram
- Apple Pay

### Styling
- Font size: 2xl to 3xl (responsive)
- Font weight: Bold
- Grayscale filter with 70% opacity
- Gap between logos: 12-16 spacing units
- Padding: 8 units on each side

## Usage
The slider automatically starts when the page loads and runs continuously. Users can hover over it to pause and read the company names.

## Customization Options
To modify the slider behavior, adjust these values:

1. **Speed**: Change `20s` in the animation duration
   - Faster: Use smaller value (e.g., `15s`)
   - Slower: Use larger value (e.g., `30s`)

2. **Gap between logos**: Modify `gap-12 sm:gap-16`

3. **Logo size**: Change `text-2xl sm:text-3xl`

4. **Opacity**: Adjust `opacity-70` (range: 0-100)
