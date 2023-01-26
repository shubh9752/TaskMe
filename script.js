// creating state to store your taskDAta
const state = {
  taskData: [],
};

//declarations
const taskContainer = document.querySelector(".task__container");
const taskmodalBody = document.querySelector(".taskMe__modal_body");

const taskBody = ({ id, title, description, type, url }) => `
<div class="col-sm-6 col-md-4 col-lg-3 mt-2" id=${id} key=${id}>
<div class="card shadow-sm taskme__card">
  <div class="d-flex justify-content-end flex-wrap card-header taskme__card_header gap-2">
    <button type="button" class="btn btn-outline-primary me-2" name=${id} onclick="editTaskCard.apply(this,arguments)">
      <i class="fas fa-pencil-alt" name=${id}></i>
    </button>
    <button type="button" class="btn btn-outline-danger me-2" name=${id} onclick="deleteTaskCard.apply(this,arguments)">
      <i class="fas fa-trash-alt" name=${id}></i>
    </button>

  </div>
  <div class="card-body">
    ${
      url
        ? `<img width="100%" src=${url} alt="url image" class="img-fluid mb-3 hold__img" />`
        : `<img width="100%" src="default.png" alt="url image" class="img-fluid mb-3 hold__img" />`
    }
    <h4 class="card_title">${title}</h4>
    <p class="descrip trim-3-lines text-muted" data-gram_editor="false">${description}</p>
    <div class="d-flex flex-wrap text-white tags"><span class="m-1 badge bg-success">${type}</span></div>
  </div>
  <div class="card-footer">
   <button class="btn btn-outline-primary float-right " id=${id} type="button" data-bs-toggle="modal" data-bs-target="#showTheTask" onclick="openTaskDescription.apply(this,arguments)" >Open</button>
  </div>
</div>

</div>

`;

const modalContent = ({ id, title, description, type, url }) => {
  const date = new Date(parseInt(id));
  return `
    <div id=${id}>
    ${
      url
        ? `<img width="100%" src=${url} alt="url image" class="img-fluid mb-3 hold__img" />`
        : `<img width="100%" src="default.png" alt="url image" class="img-fluid mb-3 hold__img" />`
    }
      <strong class="text-sm text-muted">Created at: ${date.toDateString()}</strong>
      <h2 class="my-3">${title}</h2>
      <p class="lead">
      ${description}</p>
    </div>
    
    `;
};

// functio to store data in local storage

const updatingLocalStorage = () => {
  localStorage.setItem(
    "tasks",
    JSON.stringify({
      tasks: state.taskData,
    })
  );
};

// function to getting the data from local storage
const gettingInitialData = () => {
  const getlocalStorage = JSON.parse(localStorage.tasks);
  if (getlocalStorage) state.taskData = getlocalStorage.tasks;

  state.taskData.map((data) => {
    taskContainer.insertAdjacentHTML("beforeend", taskBody(data));
  });
};

const openTaskDescription = (e) => {
  if (!e) e = window.Event;

  const getTask = state.taskData.find(({ id }) => id === e.target.id);
  taskmodalBody.innerHTML = modalContent(getTask);
};

//function for deleting task
const deleteTaskCard = (e) => {
  if (!e) e = window.Event;
  const targetId = e.target.getAttribute("name");
  // console.log(targetId)
  const type = e.target.tagName;
  const removeTask = state.taskData.filter(({ id }) => id !== targetId);
  state.taskData = removeTask;

  updatingLocalStorage();
  if (type === "BUTTON") {
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};
// function for edit functionality
const editTaskCard = (e) => {
  if (!e) e = window.event;
  const targetId = e.target.id;
  const type = e.target.tagName;

  let parentNode;
  let taskType;
  let taskDescription;
  let taskTitle;
  let submitButton;
  if (type === "BUTTON") {
    parentNode = e.target.parentNode.parentNode;
  } else {
    parentNode = e.target.parentNode.parentNode.parentNode;
  }
  taskTitle = parentNode.childNodes[3].childNodes[3];
  taskDescription = parentNode.childNodes[3].childNodes[5];
  taskType = parentNode.childNodes[3].childNodes[7].childNodes[0];
  submitButton = parentNode.childNodes[5].childNodes[1];
  console.log(taskType);

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");

   submitButton.setAttribute("onclick","saveEditedTask.apply(this,arguments)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Task";
};

const saveEditedTask = (e) => {
  if (!e) e = window.event;
  const targetId = e.target.id;
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[3].childNodes[3];
  const taskDescription = parentNode.childNodes[3].childNodes[5];
  const taskType = parentNode.childNodes[3].childNodes[7].childNodes[0];
  const submitButton = parentNode.childNodes[5].childNodes[1];
  console.log(submitButton)

  const upgradeTaskCard = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };
  let stateCopy = state.taskData;
  stateCopy = stateCopy.map((task) => 
    task.id === targetId ? {
          id: task.id,
          title: upgradeTaskCard.taskTitle,
          description: upgradeTaskCard.taskDescription,
          type: upgradeTaskCard.taskType,
          url: task.url,
        }
      : task
  );
  state.taskData=stateCopy;
  updatingLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
 
 submitButton.setAttribute("onclick",openTaskDescription.apply(this,arguments));
  submitButton.setAttribute("data-bs-toggle","modal");
  submitButton.setAttribute("data-bs-target","#showTheTask");
  submitButton.innerHTML="See Task"
};

const searchTaskTitle=(e)=>{
  if (!e) e = window.event;

  while(taskContainer.firstChild){
    taskContainer.removeChild(taskContainer.firstChild)
  }
  const resultData=state.taskData.filter(({title})=>{
   return title.toLowerCase().includes(e.target.value.toLowerCase());
  });
  resultData.map((cardData)=>{
    taskContainer.insertAdjacentHTML("beforeend",taskBody(cardData));
  })
 
}


// funtion to store data after form submission
const handlingSubmit = (e) => {
  const id = `${Date.now()}`;
  const input = {
    url: document.getElementById("image_url").value,
    title: document.getElementById("taskName").value,
    description: document.getElementById("discription").value,
    type: document.getElementById("tags").value,
  };
  if (input.description === "" || input.title === "" || input.type === "") {
    return alert("please enter the blan field");
  }

  taskContainer.insertAdjacentHTML(
    "beforeend",
    taskBody({
      ...input,
      id,
    })
  );
  state.taskData.push({ ...input, id });
  updatingLocalStorage();
};
