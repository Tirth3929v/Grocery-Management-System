# Banner Management

This document details the promotional banner system, including upload, display, ordering, and analytics for homepage banners.

## Banner Model

### Schema Structure
```javascript
{
  image: String (required),
  title: String,
  description: String,
  link: String,
  isActive: Boolean (default: true),
  sortOrder: Number (default: 0)
}
```

### Key Fields
- **image**: Path to banner image file
- **title**: Banner headline text
- **description**: Supporting description text
- **link**: Click-through URL (optional)
- **isActive**: Banner visibility toggle
- **sortOrder**: Display order (lower numbers first)

## Admin Banner Management

### Banner Gallery
- **Grid Layout**: Visual display of all banner images
- **Thumbnail View**: Small images with overlay controls
- **Status Indicators**: Active/inactive badges
- **Quick Actions**: Edit, delete, toggle active status

### Uploading Banners
1. **Access**: Admin Dashboard → Banners → Add Banner
2. **Form Fields**:
   - Banner image (required, drag-and-drop upload)
   - Title (optional, for alt text and display)
   - Description (optional, tooltip or overlay text)
   - Link URL (optional, click destination)
   - Sort order (optional, display priority)
3. **Validation**:
   - Image file type (JPEG, PNG, WebP)
   - File size limit (5MB)
   - URL format validation (if provided)
4. **API Call**: POST /api/banners
5. **Success**: Banner added to gallery with thumbnail

### Editing Banners
1. **Select Banner**: Click edit on banner thumbnail
2. **Modal Form**: Pre-populated with current metadata
3. **Image Replacement**: Option to upload new image
4. **Update**: PUT /api/banners/:id
5. **Preview**: Live preview of changes

### Banner Ordering
1. **Drag and Drop**: Reorder banners in gallery
2. **Sort Order Field**: Manual ordering input
3. **Auto-save**: Changes persist immediately
4. **Visual Feedback**: Drag preview and drop zones

### Deleting Banners
1. **Confirmation**: Delete confirmation with banner preview
2. **File Cleanup**: Remove image file from server
3. **Reorder**: Adjust sortOrder of remaining banners
4. **API Call**: DELETE /api/banners/:id

## Frontend Banner Display

### Homepage Carousel
- **Auto-rotating Slider**: 3-5 second intervals
- **Navigation Dots**: Click to jump to specific banner
- **Pause on Hover**: Stop rotation when user interacts
- **Responsive Design**: Adapt to different screen sizes

### Banner Components
```javascript
// Banner carousel implementation
const BannerCarousel = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    
    return () => clearInterval(timer);
  }, [banners.length]);
  
  return (
    <div className="banner-carousel">
      {banners.map((banner, index) => (
        <div 
          key={banner._id}
          className={`banner-slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${banner.image})` }}
        >
          <div className="banner-content">
            <h2>{banner.title}</h2>
            <p>{banner.description}</p>
            {banner.link && (
              <a href={banner.link} className="banner-link">
                Learn More
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### Banner Loading
- **Lazy Loading**: Load banner images as needed
- **Progressive Enhancement**: Text-only fallback
- **Error Handling**: Placeholder for failed image loads

## Image Management

### Upload Process
1. **File Selection**: Click upload or drag-and-drop
2. **Client Preview**: Show image before upload
3. **Compression**: Automatic optimization (future)
4. **Upload**: AJAX with progress bar
5. **Storage**: Save to `/uploads/banners/` with unique filename

### Image Requirements
- **Dimensions**: Recommended 1200x400px (3:1 aspect ratio)
- **Formats**: JPEG, PNG, WebP
- **Size Limit**: 5MB maximum
- **Optimization**: Compressed for web delivery

### Banner Types
- **Promotional**: Product sales, special offers
- **Seasonal**: Holiday or event-specific banners
- **Informational**: Store updates, new arrivals
- **Branded**: Company messaging, partnerships

## Analytics and Tracking

### Banner Performance
- **Impressions**: How many times banner is viewed
- **Clicks**: Click-through rate to linked pages
- **Conversion**: Purchases attributed to banner
- **Engagement**: Time spent viewing banner

### Tracking Implementation
```javascript
// Banner click tracking
const handleBannerClick = (banner) => {
  // Track click event
  analytics.track('banner_click', {
    bannerId: banner._id,
    bannerTitle: banner.title,
    link: banner.link
  });
  
  // Navigate to link
  if (banner.link) {
    window.location.href = banner.link;
  }
};
```

### Admin Analytics
- **View Dashboard**: Click rates per banner
- **A/B Testing**: Compare banner performance
- **Optimization**: Data-driven banner improvements

## Performance Optimization

### Image Optimization
- **Responsive Images**: Different sizes for breakpoints
- **WebP Format**: Modern compression format
- **Lazy Loading**: Load images as they enter viewport
- **CDN Delivery**: Fast global distribution (future)

### Loading Performance
- **Preload Critical**: Load first banner immediately
- **Progressive Loading**: Load others in background
- **Caching**: Browser caching for repeat visits
- **Compression**: Gzip compression for HTML/CSS

## Security Considerations

### File Upload Security
- **Type Validation**: Only allow image files
- **Size Limits**: Prevent large file uploads
- **Path Security**: Sanitize filenames, prevent directory traversal
- **Storage Security**: Secure upload directory permissions

### Content Security
- **Link Validation**: Ensure safe URLs
- **XSS Prevention**: Sanitize title and description
- **Access Control**: Admin-only banner management

## Error Handling

### Upload Errors
- **File Too Large**: Clear error message with size limit
- **Invalid Type**: Supported formats list
- **Network Error**: Retry mechanism with progress
- **Server Error**: Fallback to manual upload

### Display Errors
- **Image Load Failure**: Placeholder image
- **Missing Banner**: Graceful degradation
- **Corrupt Data**: Skip invalid banners

## API Integration

### Banner Endpoints
- GET /api/banners - Fetch active banners
- POST /api/banners - Upload new banner
- PUT /api/banners/:id - Update banner
- DELETE /api/banners/:id - Delete banner

### Request/Response Examples
```javascript
// Upload banner
POST /api/banners
Content-Type: multipart/form-data
{
  title: "Summer Sale",
  description: "Up to 50% off on fresh produce",
  link: "/category/fruits",
  sortOrder: 1,
  image: [file]
}

// Response
{
  "banner": {
    "_id": "banner_id",
    "image": "/uploads/banners/timestamp-random.jpg",
    "title": "Summer Sale",
    "link": "/category/fruits"
  }
}
```

## Testing

### Unit Tests
- Banner model validation
- Image upload handling
- Sort order logic

### Integration Tests
- Upload workflow
- Display carousel
- Click tracking

### E2E Tests
- Admin banner management
- Frontend banner display
- Mobile responsiveness

## Future Enhancements

### Advanced Features
- **Video Banners**: Support for video content
- **Interactive Banners**: Clickable hotspots
- **Dynamic Content**: Personalized banner content
- **A/B Testing**: Test different banner variations

### Analytics Improvements
- **Heat Maps**: Click tracking on banner images
- **Conversion Attribution**: Track purchase journeys
- **User Segmentation**: Target banners to user groups

### Mobile Optimization
- **Touch Gestures**: Swipe navigation
- **Mobile-Specific**: Different banners for mobile
- **App Integration**: Banner deep linking

### Content Management
- **Banner Scheduling**: Time-based banner rotation
- **Campaign Management**: Group banners by promotion
- **Template System**: Pre-designed banner layouts

This banner management system provides effective promotional capabilities with professional image handling and performance optimization.
