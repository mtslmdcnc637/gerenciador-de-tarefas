document.addEventListener('DOMContentLoaded', function() {
  const taskInput = document.getElementById('newTaskTitle');
  const addTaskButton = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');

  let tasks = loadTasks();
  renderTasks();

  addTaskButton.addEventListener('click', addTask);

  function addTask() {
    const taskTitle = taskInput.value.trim();
    if (taskTitle !== '') {
      const newTask = {
        id: Date.now(),
        title: taskTitle,
        completed: false
      };
      tasks.push(newTask);
      saveTasks();
      renderTasks();
      taskInput.value = '';
    }
  }

  function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const taskItem = createTaskElement(task);
      taskList.appendChild(taskItem);
    });
  }

  function createTaskElement(task) {
    const listItem = document.createElement('li');
    const taskTitleSpan = document.createElement('span');
    taskTitleSpan.classList.add('task-title');
    if (task.completed) {
      taskTitleSpan.classList.add('completed');
    }
    taskTitleSpan.textContent = task.title;

    const taskActions = document.createElement('div');
    taskActions.classList.add('task-actions');

    const completeButton = createButton('Completa', 'complete-btn', () => toggleComplete(task.id));
    completeButton.classList.add('complete');
    const editButton = createButton('Editar', 'edit-btn', () => editTask(task.id));
    editButton.classList.add('edit');
    const deleteButton = createButton('Excluir', 'delete-btn', () => deleteTask(task.id));
    deleteButton.classList.add('delete');

    taskActions.appendChild(completeButton);
    taskActions.appendChild(editButton);
    taskActions.appendChild(deleteButton);

    listItem.appendChild(taskTitleSpan);
    listItem.appendChild(taskActions);

    return listItem;
  }

  function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener('click', onClick);
    return button;
  }

  function toggleComplete(taskId) {
    tasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
  }

  function editTask(taskId) {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) {
      const newTitle = prompt('Editar Tarefa', taskToEdit.title);
      if (newTitle !== null && newTitle.trim() !== '') {
        tasks = tasks.map(task =>
          task.id === taskId ? { ...task, title: newTitle.trim() } : task
        );
        saveTasks();
        renderTasks();
      }
    }
  }

  function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    return storedTasks ? JSON.parse(storedTasks) : [];
  }
});
