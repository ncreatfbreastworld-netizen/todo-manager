import { useState, useEffect } from 'react'
import AddTodoForm from './components/AddTodoForm'
import TodoFilters  from './components/TodoFilters'
import TodoItem     from './components/TodoItem'
import './App.css'

function App() {

  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem('todos-p13')
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })

  const [filter, setFilter] = useState('all')
  const [isDark, setIsDark] = useState(false)


  useEffect(() => {
    localStorage.setItem('todos-p13', JSON.stringify(todos))
  }, [todos])


  useEffect(() => {
    document.body.className = isDark ? 'dark' : ''
  }, [isDark])


  const addTodo = (text) =>
    setTodos([...todos, { id: Date.now(), text, completed: false }])


  const toggleTodo = (id) =>
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))


  const deleteTodo = (id) =>
    setTodos(todos.filter(t => t.id !== id))

  const editTodo = (id, text) =>
    setTodos(todos.map(t => t.id === id ? { ...t, text } : t))


  const filteredTodos = todos.filter(t => {
    if (filter === 'active')    return !t.completed
    if (filter === 'completed') return  t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length

  return (
    <div className="app">
      <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
        {isDark ? '☀️ Светлая' : '🌙 Тёмная'}
      </button>

      <h1>📝 Менеджер задач</h1>

      <AddTodoForm onAdd={addTodo} />

      <TodoFilters
        filter={filter}
        onFilterChange={setFilter}
        activeCount={activeCount}
      />

      {filteredTodos.length === 0 ? (
        <div className="empty">
          <div className="emoji">
            {filter === 'all' ? '📋' : filter === 'active' ? '✅' : '🗂️'}
          </div>
          <p>
            {filter === 'all'       ? 'Задач пока нет. Добавьте первую!' :
             filter === 'active'    ? 'Нет активных задач' :
                                      'Нет выполненных задач'}
          </p>
        </div>
      ) : (
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              task={todo}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          ))}
        </ul>
      )}

      {todos.length > 0 && (
        <button className="clear-btn" onClick={() => setTodos([])}>
          🗑️ Очистить все задачи
        </button>
      )}

      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#aaa' }}>
        💡 Двойной клик на задаче — редактирование
      </p>
    </div>
  )
}

export default App
