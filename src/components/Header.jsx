function Header({ totalTasks, completedTasks }) {
  return (
    <header className="header">
      <p className="eyebrow">AUREX Internship • Month 2 • Week 1</p>
      <h1>React Task Manager</h1>
      <p className="subtitle">
        Add tasks, mark them complete, and remove them when you are done.
      </p>

      <div className="task-stats" aria-label="Task statistics">
        <span>{totalTasks} total</span>
        <span>{completedTasks} completed</span>
      </div>
    </header>
  )
}

export default Header
