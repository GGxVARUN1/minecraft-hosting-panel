// Todo List Application with Local Storage

class TodoApp {
  constructor() {
    this.todos = this.loadFromStorage();
    this.currentFilter = 'all';
    this.init();
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.render();
  }

  cacheDOM() {
    this.todoForm = document.getElementById('todoForm');
    this.todoInput = document.getElementById('todoInput');
    this.todoList = document.getElementById('todoList');
    this.emptyState = document.getElementById('emptyState');
    this.totalCount = document.getElementById('totalCount');
    this.completedCount = document.getElementById('completedCount');
    this.clearCompletedBtn = document.getElementById('clearCompleted');
    this.deleteAllBtn = document.getElementById('deleteAll');
    this.filterBtns = document.querySelectorAll('.filter-btn');
  }

  bindEvents() {
    this.todoForm.addEventListener('submit', (e) => this.addTodo(e));
    this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
    this.deleteAllBtn.addEventListener('click', () => this.deleteAll());
    this.filterBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
    });
    this.todoList.addEventListener('click', (e) => this.handleListClick(e));
  }

  addTodo(e) {
    e.preventDefault();
    const text = this.todoInput.value.trim();

    if (!text) {
      alert('Please enter a task!');
      return;
    }

    const todo = {
      id: Date.now(),
      text,
      completed: false,
      priority: 'medium',
      createdAt: new Date().toLocaleString(),
    };

    this.todos.unshift(todo);
    this.saveToStorage();
    this.todoInput.value = '';
    this.todoInput.focus();
    this.render();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.saveToStorage();
    this.render();
  }

  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToStorage();
      this.render();
    }
  }

  clearCompleted() {
    if (confirm('Clear all completed tasks?')) {
      this.todos = this.todos.filter((todo) => !todo.completed);
      this.saveToStorage();
      this.render();
    }
  }

  deleteAll() {
    if (confirm('Delete all tasks? This cannot be undone!')) {
      this.todos = [];
      this.saveToStorage();
      this.render();
    }
  }

  setFilter(filter) {
    this.currentFilter = filter;
    this.filterBtns.forEach((btn) => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    this.render();
  }

  handleListClick(e) {
    const checkbox = e.target.closest('.checkbox');
    const deleteBtn = e.target.closest('.delete-btn-item');

    if (checkbox) {
      this.toggleTodo(parseInt(checkbox.dataset.id));
    } else if (deleteBtn) {
      this.deleteTodo(parseInt(deleteBtn.dataset.id));
    }
  }

  getFilteredTodos() {
    switch (this.currentFilter) {
      case 'active':
        return this.todos.filter((todo) => !todo.completed);
      case 'completed':
        return this.todos.filter((todo) => todo.completed);
      default:
        return this.todos;
    }
  }

  updateStats() {
    const total = this.todos.length;
    const completed = this.todos.filter((todo) => todo.completed).length;
    this.totalCount.textContent = total;
    this.completedCount.textContent = completed;
  }

  render() {
    const filteredTodos = this.getFilteredTodos();
    this.updateStats();

    if (filteredTodos.length === 0) {
      this.todoList.innerHTML = '';
      this.emptyState.classList.add('show');
      return;
    }

    this.emptyState.classList.remove('show');
    this.todoList.innerHTML = filteredTodos.map((todo) => this.createTodoElement(todo)).join('');
  }

  createTodoElement(todo) {
    return `
      <li class="todo-item ${todo.completed ? 'completed' : ''}">
        <input
          type="checkbox"
          class="checkbox"
          data-id="${todo.id}"
          ${todo.completed ? 'checked' : ''}
        />
        <span class="todo-text">${this.escapeHtml(todo.text)}</span>
        <span class="priority ${todo.priority}">${todo.priority}</span>
        <button class="delete-btn-item" data-id="${todo.id}">Delete</button>
      </li>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  saveToStorage() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('todos');
    return stored ? JSON.parse(stored) : [];
  }
}

// Initialize the app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new TodoApp();
});