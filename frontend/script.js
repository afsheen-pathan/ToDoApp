const API_URL = "http://localhost:5000/tasks";

async function fetchTasks() {
  try {
    const response = await fetch(API_URL);
    const tasks = await response.json();
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.classList.add("task-item");
      li.innerHTML = `
                <span class="task-title ${task.completed ? "completed" : ""}">${
        task.title
      }</span>
                <div class="task-buttons">
                    <button class="complete-btn" onclick="markCompleted(${
                      task.id
                    }, ${task.completed})">${
        task.completed ? "Undo" : "✔"
      }</button>
                    <button class="edit-btn" onclick="editTask(${
                      task.id
                    })">Edit</button>
                    <button class="delete-btn" onclick="deleteTask(${
                      task.id
                    })">Delete</button>
                </div>
            `;
      taskList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

async function addTask() {
  const taskInput = document.getElementById("taskInput");
  const title = taskInput.value.trim();

  if (title === "") {
    alert("Task title cannot be empty!");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, completed: false }),
    });

    if (!response.ok) {
      throw new Error("Failed to add task");
    }

    taskInput.value = "";
    fetchTasks();
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

async function editTask(id) {
  const newTitle = prompt("Enter new task title:");
  if (newTitle) {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }
}

async function markCompleted(id, completed) {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    fetchTasks();
  } catch (error) {
    console.error("Error marking task as completed:", error);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchTasks();
  } catch (error) {
    console.error("Error deleting task:", error);
  }
}

document.addEventListener("DOMContentLoaded", fetchTasks);

document.head.insertAdjacentHTML(
  "beforeend",
  `
    <style>
        .completed {
            text-decoration: line-through;
            color: gray;
            opacity: 0.7;
        }
    </style>
`
);
