function sweetAlert() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Cek apakah username dan password sesuai dengan yang diinginkan
  if (username === "anggicantik" && password === "hihi123") {
      // Jika username dan password sesuai, tampilkan pesan sukses
      Swal.fire({
          position: "center",
          icon: "success",
          title: "Login successful!",
          showConfirmButton: false,
          timer: 1500
      }).then((result) => {
          // Redirect ke halaman berikutnya setelah alert ditutup
          window.open("main.html", "_blank");
      });
  } else if (username === "" || password === "") {
      // Jika username atau password kosong, tampilkan pesan kesalahan
      Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: 'Silakan isi Username dan Password terlebih dahulu!',
          position: "center"
      });
  } else {
      // Jika username dan password tidak sesuai, tampilkan pesan kesalahan
      Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: 'Username atau Password salah. Silakan coba lagi!',
          position: "center"
      });
  }
}

function openForm() {
            document.getElementById('popupForm').style.display = 'block';
        }

        function closeForm() {
            document.getElementById('popupForm').style.display = 'none';
        }

        function handleFormSubmit(event) {
            event.preventDefault();
            Swal.fire({
                title: 'Tugas Berhasil Ditambahkan',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                closeForm();
                document.getElementById('taskForm').reset();
            });
        }
const body = document.querySelector("body"),
      sidebar = body.querySelector(".sidebar"),
      toggle = body.querySelector(".toggle"),
      searchBtn = body.querySelector(".search-box"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");

      toggle.addEventListener("click", () =>{
        sidebar.classList.toggle("close");
      });
      modeSwitch.addEventListener("click", () =>{
        body.classList.toggle("dark");

        if(body.classList.contains('dark')){
          modeText.innerHTML = "Light Mode";
        }else{
          modeText.innerHTML = "Dark Mode"
        }
      });

      // Fungsi untuk menampilkan form popup
function showForm() {
  document.getElementById("popupForm").style.display = "block";
}

// Fungsi untuk menyembunyikan form popup
function closeForm() {
  document.getElementById("popupForm").style.display = "none";
}

// Fungsi untuk menambahkan task baru ke dalam list container
function addTaskToList(task) {
  const taskList = document.querySelector(".box-info");
  
  // Buat elemen-elemen HTML untuk menampilkan task baru
  const listItem = document.createElement("li");
  listItem.innerHTML = `
      <i class='bx bx-task' ></i>
      <span class="fill-text">
          <h3>${task}</h3>
          <p>Tugas baru</p>
      </span>
  `;
  
  // Tambahkan elemen task ke dalam list container
  taskList.appendChild(listItem);
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("taskForm");
    const taskList = document.getElementById("taskTableBody");
    let totalTasks = 0;
    let pendingTasks = 0;
    let completedTasks = 0;

    // Function to load tasks from local storage
    function loadTasksFromStorage() {
        const tasks = JSON.parse(localStorage.getItem("tasks"));
        if (tasks) {
            tasks.forEach(task => {
                addTaskToList(task.task, task.priority, task.deadline, task.type, task.category, task.completed);
            });
        }
    }

    // Function to update task counters
    function updateTaskCounters() {
        document.querySelector(".state1").textContent = totalTasks;
        document.querySelector(".state2").textContent = pendingTasks;
        document.querySelector(".state3").textContent = completedTasks;
    }

    function addTaskToList(task, priority, deadline, type, category, completed = false) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${task}</td>
            <td>${priority}</td>
            <td>${deadline}</td>
            <td>${type}</td>
            <td>${category}</td>
            <td>
                <input type="checkbox" class="task-status" ${completed ? "checked" : ""}>
                <button class="delete-btn"><i class='bx bx-trash-alt'></i></button>
            </td>
        `;
        taskList.appendChild(newRow);

        totalTasks++;
        if (completed) {
            completedTasks++;
        } else {
            pendingTasks++;
        }
        updateTaskCounters();
    }

    function saveTasksToStorage() {
        const tasks = [];
        taskList.querySelectorAll("tr").forEach(row => {
            const task = row.cells[0].textContent;
            const priority = row.cells[1].textContent;
            const deadline = row.cells[2].textContent;
            const type = row.cells[3].textContent;
            const category = row.cells[4].textContent;
            const completed = row.querySelector(".task-status").checked;
            tasks.push({ task, priority, deadline, type, category, completed });
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    loadTasksFromStorage();

    // Event listener for form submission
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const taskInput = document.getElementById("task").value;
        const priorityInput = document.getElementById("priority").value;
        const deadlineInput = document.getElementById("deadline").value;
        const typeInput = document.querySelector('input[name="type"]:checked').value;
        const categoryInputs = document.querySelectorAll('input[name="category"]:checked');
        const categories = Array.from(categoryInputs).map(input => input.value).join(", ");

        addTaskToList(taskInput, priorityInput, deadlineInput, typeInput, categories);

        form.reset();
        saveTasksToStorage(); // Save tasks to local storage
    });

    // Event listener for task list
    taskList.addEventListener("click", function(event) {
        if (event.target.closest(".delete-btn")) {
            const taskRow = event.target.closest("tr");
            const isCompleted = taskRow.querySelector(".task-status").checked;

            Swal.fire({
                title: 'Konfirmasi Hapus',
                text: "Apakah Anda yakin ingin menghapus tugas ini?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Hapus!'
            }).then((result) => {
                if (result.isConfirmed) {
                    taskRow.remove();

                    totalTasks--;

                    if (isCompleted) {
                        completedTasks--;
                    } else {
                        pendingTasks--;
                    }
                    updateTaskCounters();
                    saveTasksToStorage(); // Save tasks to local storage

                    Swal.fire(
                        'Deleted!',
                        'Tugas berhasil dihapus.',
                        'success'
                    )
                }
            });
        }
    });

    // Event listener for task status change
    taskList.addEventListener("change", function(event) {
        if (event.target.classList.contains("task-status")) {
            const taskText = event.target.closest("tr").querySelector("td:first-child");
            taskText.classList.toggle("completed");
            const isCompleted = event.target.checked;

            if (isCompleted) {
                completedTasks++;
                pendingTasks--;
            } else {
                completedTasks--;
                pendingTasks++;
            }
            updateTaskCounters();
            saveTasksToStorage();
        }
        // Fungsi untuk menambahkan task baru ke dalam list container dan tabel di dalam task
function addTaskToList(task, priority, deadline, type, category, completed = false) {
    // Tambahkan ke dalam tabel di dalam task
    const taskRows = document.querySelectorAll(".taskTableBody");
    taskRows.forEach(row => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${task}</td>
            <td>${priority}</td>
            <td>${deadline}</td>
            <td>${type}</td>
            <td>${category}</td>
            <td>
                <input type="checkbox" class="task-status" ${completed ? "checked" : ""}>
                <button class="delete-btn"><i class='bx bx-trash-alt'></i></button>
            </td>
        `;
        row.appendChild(newRow);
    });

    // Tambahkan ke dalam list container
    const taskList = document.querySelector(".box-info");
    const listItem = document.createElement("li");
    listItem.innerHTML = `
        <i class='bx bx-task' ></i>
        <span class="fill-text">
            <h3>${task}</h3>
            <p>Tugas baru</p>
        </span>
    `;
    taskList.appendChild(listItem);

    totalTasks++;
    if (completed) {
        completedTasks++;
    } else {
        pendingTasks++;
    }
    updateTaskCounters();
}

// Fungsi untuk menambahkan multiple tasks ke dalam list container dan tabel di dalam task
function addMultipleTasksToList(tasks) {
    tasks.forEach(task => {
        addTaskToList(task.task, task.priority, task.deadline, task.type, task.category, task.completed);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const taskInput = document.getElementById("task").value;
        const priorityInput = document.getElementById("priority").value;
        const deadlineInput = document.getElementById("deadline").value;
        const typeInput = document.querySelector('input[name="type"]:checked').value;
        const categoryInputs = document.querySelectorAll('input[name="category"]:checked');
        const categories = Array.from(categoryInputs).map(input => input.value).join(", ");
        const newTaskData = { task: taskInput, priority: priorityInput, deadline: deadlineInput, type: typeInput, category: categories };

        addTaskToList(taskInput, priorityInput, deadlineInput, typeInput, categories);
        
        form.reset();
        saveTasksToStorage(); 
    });

    loadTasksFromStorage();

    addMultipleTasksToList(tasks);
});

    });
});

document.addEventListener("DOMContentLoaded", function() {
    const calendar = document.getElementById('calendar');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementsByClassName('close')[0];
    const addEventBtn = document.getElementById('addEventBtn');
    const eventInput = document.getElementById('eventInput');

    let currentMonth = 0; // January
    let currentYear = 2024;

    renderCalendar(currentMonth, currentYear);

    prevMonthBtn.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11; // December
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0; // January
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    });

    function renderCalendar(month, year) {
        calendar.innerHTML = '';
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // Get the day of the week for the 1st day of the month

        currentMonthYear.textContent = `${getMonthName(month)} ${year}`;

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(dayName => {
            const day = document.createElement('div');
            day.classList.add('day');
            day.textContent = dayName;
            calendar.appendChild(day);
        });

        // Add empty cells before the 1st day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day');
            calendar.appendChild(emptyDay);
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('day');
            day.textContent = i;
            day.addEventListener('click', () => showModal(i, month, year));
            calendar.appendChild(day);
        }
    }

    function getMonthName(month) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return monthNames[month];
    }

    function showModal(day, month, year) {
        modal.style.display = 'block';
        addEventBtn.addEventListener('click', () => {
            const eventName = eventInput.value;
            if (eventName.trim() !== '') {
                console.log(`Added event "${eventName}" on ${day} ${getMonthName(month)} ${year}`);
                closeModal();
            } else {
                alert('Please enter event name.');
            }
        });
    }

    closeBtn.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }

    function closeModal() {
        modal.style.display = 'none';
        eventInput.value = '';
    }
});







