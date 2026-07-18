const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');

async function fetchTasks () {
  const message = await fetch('/api/tasks');
  const tasks = await message.json();

  console.log(tasks);

}

fetchTasks();