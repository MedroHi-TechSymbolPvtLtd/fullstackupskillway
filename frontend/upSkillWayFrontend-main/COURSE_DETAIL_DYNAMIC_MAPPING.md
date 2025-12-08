# CourseDetail.jsx - Dynamic Data Mapping

## Sections to Make Dynamic (Keep UI, Replace Data)

### 1. **About [Course Title] Course** Section
- **Title**: `course?.title` (e.g., "Modern JavaScript for Web Development")
- **Description**: `course?.shortDescription || course?.description`
- **Image**: `course?.aboutSectionImageUrl`
- **Program Name**: `course?.programName`
- **Duration**: `course?.durationMonths` months, `course?.durationHours` hours
- **Delivery Mode**: `course?.deliveryModes` (array)
- **Language**: `course?.language`

### 2. **Exclusive Course Offerings** Section
- Keep the static cards (Live Interactive Sessions, Project Portfolio, Career Assistance, etc.)
- These are generic benefits, not course-specific

### 3. **Master These Tools** Section
- **Data Source**: `course?.masteredTools` (array)
- **Each Tool**: 
  - `tool.name`
  - `tool.logoUrl`
- Display tools in a scrolling carousel

### 4. **Course Curriculum** Section
- **Data Source**: `course?.curriculum` (array)
- **Each Module**:
  - `module.moduleTitle`
  - `module.topics` (array of strings)
- Display in expandable accordion format

### 5. **Training Options** Section
- **Data Source**: `course?.trainingOptions` (array)
- **Each Option**:
  - `option.name`
  - `option.price`
  - `option.currency`
  - `option.descriptionPoints` (array)

### 6. **Build Projects from Scratch** Section
- **Data Source**: `course?.projects` (array)
- **Each Project**:
  - `project.title`
  - `project.description`
  - `project.imageUrl`

### 7. **Meet Our Mentors** Section
- **Data Source**: `course?.mentors` (array)
- **Each Mentor**:
  - `mentor.name`
  - `mentor.title`
  - `mentor.bio`
  - `mentor.imageUrl`

### 8. **From Aspiration to Achievement (Success Stories/Testimonials)** Section
- **Data Source**: `course?.testimonials` (array)
- **Each Testimonial**:
  - `testimonial.studentName`
  - `testimonial.studentRole`
  - `testimonial.studentImageUrl`
  - `testimonial.testimonialText`
  - `testimonial.rating`

### 9. **Frequently Asked Questions** Section
- **Data Source**: `course?.faqs` (array)
- **Each FAQ**:
  - `faq.question`
  - `faq.answer`

### 10. **Related Programs** Section
- **Data Source**: `course?.relatedPrograms` (array)
- **Each Program**:
  - `program.title`
  - `program.slug`
  - `program.price`
  - `program.duration`
  - `program.imageUrl`

## API Endpoint
```
GET http://localhost:3000/api/v1/cms/courses
```

## Implementation Notes
- Keep ALL existing CSS classes and styling
- Only replace hardcoded text/images with dynamic data
- Add fallbacks for missing data
- Handle null/undefined values gracefully
