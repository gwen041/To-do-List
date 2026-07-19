const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

async function fetchTasks () {
  const message = await fetch('/api/tasks');
  const tasks = await message.json();

  list.innerHTML = '';

  tasks.forEach (task => {
    const taskRow = document.createElement('li');
    const taskName = document.createElement('span');
    const checkBtn = document.createElement('button');
    const delBtn = document.createElement('button');
    
    taskRow.title = task.created_at;

    checkBtn.textContent = '✓';
    delBtn.textContent = 'Del';

    taskRow.className = 'task-item';
    checkBtn.className= 'check btn';
    delBtn.className = 'delete btn';
    taskRow.dataset.id = task.id;

    taskName.textContent = task.title;

    if (task.completed == 1 || task.completed == true) {
      taskName.className = 'completed';
    }
    taskRow.appendChild(taskName);
    taskRow.appendChild(checkBtn);
    taskRow.appendChild(delBtn);

    list.appendChild(taskRow);

    delBtn.addEventListener('click', async () => {
      const taskId = taskRow.dataset.id;

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchTasks();
      }
    });

    checkBtn.addEventListener('click', async () => {
      const taskId = taskRow.dataset.id;
      const currentStatus = task.completed;
      let newStatus;

      if(currentStatus === 0) {
        newStatus = 1;
      } else {
        newStatus = 0;
      }

      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({completed: newStatus})
      });

      console.log("Server response status:", response.status, "OK:", response.ok);
      if(response.ok) {
        fetchTasks();
      }
    });
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title: input.value })
  });

  if(response.ok) {
    input.value = '';
    fetchTasks();
  }
});

fetchTasks();