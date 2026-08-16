# 📝 Todo List Application

A modern, feature-rich todo list application with local storage persistence, filtering, and priority management.

## Features

✨ **Core Functionality**
- Add, complete, and delete tasks
- Local storage persistence (saves automatically)
- Filter tasks (All, Active, Completed)
- Real-time statistics (Total & Completed count)

🎯 **Task Management**
- Priority levels (High, Medium, Low)
- Timestamp for each task
- Smooth animations and transitions
- Responsive design for all devices

🛠️ **User Actions**
- Clear all completed tasks
- Delete all tasks at once
- Checkbox to mark tasks complete
- Individual delete buttons

## How to Use

1. **Open the Application**
   - Open `index.html` in your web browser

2. **Add a Task**
   - Type your task in the input field
   - Press Enter or click "Add Task"

3. **Complete a Task**
   - Click the checkbox to mark as complete
   - Completed tasks appear with strikethrough

4. **Delete a Task**
   - Click the "Delete" button on any task

5. **Filter Tasks**
   - Click "All", "Active", or "Completed" buttons

6. **Clear Completed**
   - Click "Clear Completed" to remove all done tasks

7. **Delete All**
   - Click "Delete All" to remove everything

## Technical Details

### Technologies Used
- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **Vanilla JavaScript** - No dependencies
- **LocalStorage API** - Data persistence

### Local Storage
- Tasks are automatically saved to browser's localStorage
- Data persists even after closing the browser
- All data stored in JSON format

### Code Structure
- **TodoApp Class** - Main application logic
- **init()** - Initialize the application
- **addTodo()** - Add new tasks
- **deleteTodo()** - Remove tasks
- **toggleTodo()** - Mark complete/incomplete
- **render()** - Update UI
- **saveToStorage()** - Persist data
- **loadFromStorage()** - Retrieve saved data

## File Structure

```
todo-app/
├── index.html      # HTML structure
├── styles.css      # CSS styling
├── script.js       # JavaScript logic
└── README.md       # Documentation
```

## Features Showcase

### 🎨 UI/UX
- Gradient purple background
- Smooth animations and hover effects
- Mobile-responsive design
- Clean and modern interface

### 💾 Data Persistence
- Auto-save to localStorage
- No server required
- Works offline

### 📊 Statistics
- Total tasks counter
- Completed tasks counter
- Real-time updates

### 🔍 Filtering
- View all tasks
- View only active tasks
- View only completed tasks

## Browser Compatibility

- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Opera ✅

## License

MIT License - Free to use and modify

---

Made with ❤️ by GGxVARUN1