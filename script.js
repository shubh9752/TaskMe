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
    <button type="button" class="btn btn-outline-primary me-2" name=${id}>
      <i class="fas fa-pencil-alt" name=${id}></i>
    </button>
    <button type="button" class="btn btn-outline-danger me-2" name=${id}>
      <i class="fas fa-trash-alt" name=${id}></i>
    </button>

  </div>
  <div class="card-body">
    ${
      url ?
      `<img width="100%" src=${url} alt="url image" class="img-fluid mb-3 hold__img" />`
      :
      `<img width="100%" src="default.png" alt="url image" class="img-fluid mb-3 hold__img" />`
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

const modalContent=({id, title, description, type, url})=>{
    const date =new Date(parseInt(id));
    return `
    <div id=${id}>
    ${
        url ?
        `<img width="100%" src=${url} alt="url image" class="img-fluid mb-3 hold__img" />`
        :
        `<img width="100%" src="default.png" alt="url image" class="img-fluid mb-3 hold__img" />`
      }
      <strong class="text-sm text-muted">Created at: ${date.toDateString()}</strong>
      <h2 class="my-3">${title}</h2>
      <p class="lead">
      ${description}</p>
    </div>
    
    `;
}

// functio to store data in local storage

const updatingLocalStorage=()=>{
    localStorage.setItem("tasks",JSON.stringify({
        tasks:state.taskData,
    }))
}

// function to getting the data from local storage
const gettingInitialData=()=>{
    const getlocalStorage=JSON.parse(localStorage.tasks);
    if(getlocalStorage) state.taskData=getlocalStorage.tasks;

    state.taskData.map((data)=>{
        taskContainer.insertAdjacentHTML("beforeend",taskBody(data))
    })
}

const openTaskDescription=(e)=>{
  if(!e)e=window.Event;

  const getTask=state.taskData.find(({id})=>id===e.target.id);
  taskmodalBody.innerHTML=modalContent(getTask);

}

// funtion to store data after form submission
const handlingSubmit=(e)=>{
    const id=`${Date.now()}`;
    const input={
        url:document.getElementById("image_url").value,
        title:document.getElementById("taskName").value,
        description:document.getElementById("discription").value,
        type:document.getElementById("tags").value,
    }
    if(input.description==="" || input.title===""||input.type===""){
      return alert("please enter the blan field")
    }

    taskContainer.insertAdjacentHTML("beforeend",taskBody({
        ...input,
        id,
    })
    )
    state.taskData.push({...input,id});
    updatingLocalStorage();
}