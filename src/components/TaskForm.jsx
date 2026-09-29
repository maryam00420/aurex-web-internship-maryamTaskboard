import { useState } from 'react'

function TaskForm({ onAddTask }) {
  const [taskText, setTaskText] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const cleanTask = taskText.trim()

    if (!cleanTask) {
      setError('Please enter a task before adding it.')
      return
    }

    onAddTask(cleanTask)
    setTaskText('')
    setError('')
  }

  const handleChange = (event) => {
    setTaskText(event.target.value)

    if (error) {
      setError('')
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="task-input">New task</label>

      <div className="form-row">
        <input
          id="task-input"
          type="text"
          value={taskText}
          onChange={handleChange}
          placeholder="e.g. Finish React assignment"
          aria-describedby={error ? 'task-error' : undefined}
        />
        <button type="submit">Add Task</button>
      </div>

      {error && (
        <p id="task-error" className="error-message" role="alert">
          {error}
        </p>
      )}
    </form>
  )
}

export default TaskForm
