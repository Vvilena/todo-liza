const openModal = document.getElementById("openModal");
const modal = document.getElementById("noteModal");
const closeModal = document.getElementById("closeModal");
const addNoteBtn = document.getElementById("addNote");
const todoInput = document.getElementById("noteInput");
const notesContainer = document.getElementById("notesContainer");
const modalTitle = document.getElementById("modalTitle");
const searchInput = document.querySelector(".search-input");

let editingIndex = null;
let searchQuery = "";

//при клике добавляем событие которое произойдет
openModal.onclick = () => {
//обнуляем поле для ввода
    editingIndex = null;
//изменяем титульнинк на новая заметка
    modalTitle.textContent = "NEW NOTE";
//очищает поле для ввода
    todoInput.value = ""
//делает модлаьное окно видимым
    modal.style.display = "block";
};

//при закрытии окна 
closeModal.onclick = () => {
// модальное окно скрывается
    modal.style.display = "none";
    editingIndex = null;
    todoInput.value = "";
};

window.onclick = (e) => {
    //вешаем событие если нажатие было по фону то наш код выполняется
    if (e.target === modal) {
    //модальное окно скрывавется
        modal.style.display = "none";
    //обнуляется переменная которая хранит в себе инлес заметки которая изменяется
        editingIndex = null;
    //обнуляем поле для ввода
        todoInput.value = "";
    }
};

const themeButton = document.querySelector(".theme-button");
const moonIcon = themeButton.querySelector(".moon-Icon");
const sunIcon = themeButton.querySelector(".sun-Icon");


function updateIcons() {
//есть ли у станицы класс дарктим
    if (document.body.classList.contains("dark-theme")) {
        moonIcon.style.display = "none";
        sunIcon.style.display = "block";
    } else {
        moonIcon.style.display = "block";
        sunIcon.style.display = "none";
    }
}

// Обработчик клика
//добавляем действие при клике на кнопку переключения темы
themeButton.onclick = () => {
//переключает на класс дарк тим и теперь приенятся стили дарк
    document.body.classList.toggle("dark-theme");
//вызов функции обоновления иконок
    updateIcons(); 
}


//массив для хранения тудушек
let todoList = [];
//статус стоит по дефолту пустой нужен для сортировки
let statusFilter = ""; // "all", "completed", "active"

// Обработчик поиска
//слушатель события есть наше событие будет выполняется при любом изменении текста
searchInput.addEventListener('input', (e) => {
//элемент на котором произошло событие и берем текущее значение поле преобрзуем
// в нижний регимтр и убирае пробелы сзади и спереди
    searchQuery = e.target.value.toLowerCase().trim();
//сохраняем для ипользования в функции
    renderTodoList();
});

// Обработчик фильтрации по статусу
//находим элементы фильтра и это селект
const filterSelect = document.querySelector(".filter-select");
//вешаем событие и оно происходит при изменении выбора в селект 
filterSelect.addEventListener('change', (e) => {
//получаем выбранное значение
    statusFilter = e.target.value;
//вызываем функцию перирисовки котораая будет показывать новый список в соответствии со значением в статусе
    renderTodoList();
});

//вешаем событие на кнопку добавить заметку и оно произойдет когда мы кликнем на кнопку
addNoteBtn.addEventListener('click', () => {
//создаем постоянную переменную для хранения туду и получаем текст из поля для ввода
    const todo = todoInput.value.trim();
    //если текст есть
    if (todo) {
        //если редачим новую
        if (editingIndex !== null) {
        //по индексу находим нашу выбранную туду, выбираем оттуда текст и присваиваем новое значение
            todoList[editingIndex].text = todo;
        //обнуляем счетчик индексов для туду
            editingIndex = null;
        } else {
        //добавление новой заметки
            todoList.push({ text: todo, completed: false });
        }
        //очищаем поле
        todoInput.value = '';
        //закрываем окно
        modal.style.display = "none";
        //перерисовываем список
        renderTodoList();
    }
});

// ловим клик на поле где хранятся тудушки и просиходит событие
notesContainer.addEventListener('click', (event) => {
    // берем конкретный элемент на который кликнули и содержит ли он класс чекбокс
    if (event.target.classList.contains('note-checkbox')) {
        //находим родителя с таким же классом чтобы получить всю замету  не только чекбокс
        const noteElement = event.target.closest('.note-item');
        //получаем айди задачи 
        const todoId = parseInt(noteElement.dataset.id);
        //вызываем функцию переключения статуса
        toggleTodoStatus(todoId);
    }
    
    // проверяем клик на иконку удаления
    if (event.target.closest('.delete-icon')) {
        const noteElement = event.target.closest('.note-item');
        const todoId = parseInt(noteElement.dataset.id);
        removeTodo(todoId);
    }
    
    // проверяем клик на иконку редактирования
    if (event.target.closest('.edit-icon')) {
        const noteElement = event.target.closest('.note-item');
        const todoId = parseInt(noteElement.dataset.id);
        editTodo(todoId);
    }
});

function renderTodoList() {
    // фильтруем заметки по статусу
    //присваиваем сначала все что есть
    let filteredTodos = todoList;
    //если выполенены
    if (statusFilter === "completed") {
        //проходит по тудулист и оставляет только те где туду_законч=тру
        filteredTodos = todoList.filter(todo => todo.completed);
        //если не выполнены
    } else if (statusFilter === "active") {
         //проходит по тудулист и оставляет только те где туду_законч=фолс
        filteredTodos = todoList.filter(todo => !todo.completed);
    }
    // Фильтруем по поисковому запросу
    // если есть поисковой запрос
    if (searchQuery) {
        //проходимсяпо новому отфильтрваному туду по каждому элементу провяем совпадает ли условие если да то осотавляет те которые подходят
        filteredTodos = filteredTodos.filter(todo => 
            todo.text.toLowerCase().includes(searchQuery)
        );
    }
    //если задач ноль
    if (filteredTodos.length === 0) {
        //то очищает контейнер
        notesContainer.innerHTML = '';
        return;
    }
    
    // Создаем маппинг оригинальных индексов к отфильтрованным
    const indexMap = [];
    let tempFiltered = todoList;
    if (statusFilter === "completed") {
        tempFiltered = todoList.filter(todo => todo.completed);
    } else if (statusFilter === "active") {
        tempFiltered = todoList.filter(todo => !todo.completed);
    }
    
    todoList.forEach((todo, idx) => {
        let matchesStatus = true;
        if (statusFilter === "completed" && !todo.completed) matchesStatus = false;
        if (statusFilter === "active" && todo.completed) matchesStatus = false;
        
        if (matchesStatus && (!searchQuery || todo.text.toLowerCase().includes(searchQuery))) {
            indexMap.push(idx);
        }
    });
    
    notesContainer.innerHTML = filteredTodos.map((todo, filteredIndex) => {
        const originalIdx = indexMap[filteredIndex];
        const isCompleted = todo.completed;
        return `
            <div class="note-item" data-id="${originalIdx}">
                <div class="note">
                    <input type="checkbox" class="note-checkbox" ${isCompleted ? 'checked' : ''}>
                    <p class="note-text ${isCompleted ? 'completed' : ''}">${todo.text}</p>
                    <svg class="note-icon edit-icon" width="18" height="18" viewBox="0 0 18 18" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8.67272 5.99106L2 12.6637V16H5.33636L12.0091 9.32736M8.67272 5.99106L11.0654 3.59837L11.0669 3.59695C11.3962 3.26759 11.5612 3.10261 11.7514 3.04082C11.9189 2.98639 12.0993 2.98639 12.2669 3.04082C12.4569 3.10257 12.6217 3.26735 12.9506 3.59625L14.4018 5.04738C14.7321 5.37769 14.8973 5.54292 14.9592 5.73337C15.0136 5.90088 15.0136 6.08133 14.9592 6.24885C14.8974 6.43916 14.7324 6.60414 14.4025 6.93398L14.4018 6.93468L12.0091 9.32736M8.67272 5.99106L12.0091 9.32736"
                            stroke="#CDCDCD" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <svg class="note-icon delete-icon" width="18" height="18" viewBox="0 0 18 18" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z"
                            stroke="#CDCDCD" />
                        <path d="M14.625 3.75H3.375" stroke="#CDCDCD" stroke-linecap="round" />
                        <path
                            d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z"
                            stroke="#CDCDCD" />
                        <path d="M10.5 9V12.75" stroke="#CDCDCD" stroke-linecap="round" />
                        <path d="M7.5 9V12.75" stroke="#CDCDCD" stroke-linecap="round" />
                    </svg>
                </div>
                <div class="separator">
                    <p>___________________________________________________________</p>
                </div>
            </div>
        `;
    }).join("");
}

function toggleTodoStatus(id) {
    if (id >= 0 && id < todoList.length) {
        todoList[id].completed = !todoList[id].completed;
        renderTodoList();
    }
}

function removeTodo(id) {
    if (id >= 0 && id < todoList.length) {
        todoList = todoList.filter((todo, index) => index !== id);
        renderTodoList();
    }
}

function editTodo(id) {
    if (id >= 0 && id < todoList.length) {
        editingIndex = id;
        modalTitle.textContent = "EDIT NOTE";
        todoInput.value = todoList[id].text;
        modal.style.display = "block";
    }
}

 