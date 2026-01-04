# Feature Testing Checklist

## ✅ Testing All New Features

### 1. Command Palette (⌘K)
- [ ] Press `Cmd+K` or `Ctrl+K` - palette opens
- [ ] Type "notes" - filters to Notes commands
- [ ] Use arrow keys - selection moves
- [ ] Press Enter - executes command and closes
- [ ] Press ESC - closes palette
- [ ] Click outside - closes palette

### 2. Global Search (⌘F)
- [ ] Create some test data (notes, contacts, passwords)
- [ ] Press `Cmd+F` or `Ctrl+F` - search opens
- [ ] Type search query - results appear
- [ ] Results show from multiple apps
- [ ] Click result - navigates to correct app/item
- [ ] Arrow keys work for navigation
- [ ] Enter opens selected result

### 3. Toast Notifications
- [ ] Create a note - success toast appears
- [ ] Upload a photo - upload toast appears
- [ ] Try to save when storage full - error toast appears
- [ ] Copy password - "Copied!" toast appears
- [ ] Toasts auto-dismiss after 3 seconds
- [ ] Can manually close toasts with X button

### 4. Password Features
- [ ] Open Passwords app
- [ ] Click "Add" button
- [ ] Click refresh icon - password generated
- [ ] Type password manually - strength meter updates
- [ ] Weak password shows red
- [ ] Strong password shows green
- [ ] Save password - encrypted in storage
- [ ] Copy password - clipboard works with toast

### 5. Keyboard Shortcuts
- [ ] Press `?` - shortcuts modal opens
- [ ] All shortcuts listed by category
- [ ] Press ESC - modal closes
- [ ] Try `Ctrl+1` through `Ctrl+8` - navigates to apps
- [ ] Try `Ctrl+N` in Notes - creates new note
- [ ] Try `Ctrl+/` - toggles theme

### 6. Data Management
- [ ] Press `Cmd+K` → type "export"
- [ ] Execute export - JSON file downloads
- [ ] Check file contains all data
- [ ] Press `Cmd+K` → type "import"
- [ ] Select backup file - data restores
- [ ] App reloads with imported data

### 7. Existing Features Still Work
- [ ] Notes app - create, edit, delete notes
- [ ] Photos app - upload, view, delete photos
- [ ] Passwords app - add, view, delete passwords
- [ ] Contacts app - add, search, view, delete contacts
- [ ] URLs app - add, organize, delete bookmarks
- [ ] Settings - change theme, background
- [ ] Profile - edit name, email, bio, avatar
- [ ] Sidebar navigation works
- [ ] Mobile responsive (test on small screen)

### 8. Performance
- [ ] App loads quickly
- [ ] No console errors
- [ ] Smooth animations
- [ ] No lag when typing
- [ ] Search is instant
- [ ] App switching is instant

### 9. Error Handling
- [ ] Try uploading very large photos - handles gracefully
- [ ] Try filling storage - shows error toast
- [ ] Try invalid import file - shows error
- [ ] Network errors handled (CDN resources)

### 10. Visual Polish
- [ ] Command palette hint visible in header
- [ ] Welcome toast on first load
- [ ] All icons render correctly
- [ ] Dark/light themes work
- [ ] Modals have smooth animations
- [ ] Hover effects work

## 🐛 Known Issues to Check

1. **Storage Quota**: Test with many photos to ensure quota handling works
2. **Encryption**: Verify passwords are encrypted in localStorage (check DevTools)
3. **Mobile**: Test all features on mobile viewport
4. **Keyboard**: Ensure shortcuts don't conflict with browser shortcuts
5. **Performance**: Test with large datasets (100+ notes, contacts, etc.)

## 📝 Test Data Suggestions

### Notes
- Create 5-10 notes with different content
- Use rich text formatting
- Create folders

### Photos
- Upload 10-20 photos
- Test different sizes
- Create albums

### Passwords
- Add 5-10 passwords
- Test password generator
- Test strength meter with various passwords

### Contacts
- Add 10-15 contacts
- Include all fields (name, email, phone, company)
- Test search functionality

### URLs
- Add 10-15 bookmarks
- Create folders
- Test different domains

## ✅ Success Criteria

All features should:
1. Work without console errors
2. Provide clear user feedback
3. Handle errors gracefully
4. Work on mobile and desktop
5. Be accessible via keyboard
6. Have smooth animations
7. Save data correctly
8. Load quickly

## 🎯 Priority Issues

If any of these fail, they are critical:
1. Data not saving to localStorage
2. Command palette not opening
3. Encryption failing
4. App crashes or freezes
5. Major UI broken on mobile

## 📊 Performance Benchmarks

Target metrics:
- Initial load: < 3 seconds
- App switch: < 100ms
- Search results: < 50ms
- Toast display: Instant
- Encryption: < 20ms per password

---

**Testing completed on**: [Date]
**Browser**: [Browser name and version]
**OS**: [Operating system]
**Issues found**: [List any issues]
