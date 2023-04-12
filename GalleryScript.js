
//showGetResults will retrieve the data from the provided url and store the data in the 'result' variable
function showGetResults(){
    var result = null;
    var scriptURL ='https://randomuser.me/api/?results=50';
    $.ajax({
        url: scriptURL,
        type: 'get',
        dataType: 'json',
        async:false,
        success: function(someJSONData){
            result = someJSONData;
        }
    });
    return result;
}


const loadedProfiles = showGetResults().results;

populateBodyWithProfiles(loadedProfiles); //Will populate Presentation.html with data

function populateBodyWithProfiles(someData){
var retrievedList = document.getElementById("listOfProfiles");

for(var i =0; i<someData.length;i++){
    var imageURL = someData[i].picture.large;
    var imageURLthumb = someData[i].picture.medium;

    retrievedList.innerHTML+=`<li class="profilePicture">

    <figure>
    <img src="${imageURL}"/>
    <figcaption>Name: ${someData[i].name.first} ${someData[i].name.last} <br>Email: ${someData[i].email} </figcaption>
    </figure>

        <div class="overlay"><span class="spanOverlay"><img src="${imageURLthumb}"/> <p>Name: ${someData[i].name.first} ${someData[i].name.last}</p>
         <p>Age: ${someData[i].dob.age}</p> <p>Gender: ${someData[i].gender}</p>  <p>Email: ${someData[i].email}</p> <p>Password: ${someData[i].login.password}</p>
          </span></div>
    </li>`
}

}





//pagination variables
const paginationNumbers = document.getElementById("pagination-numbers");
const paginationPrevButton = document.getElementById("prev-button");
const paginationNextButton = document.getElementById("next-button");
const paginatedList = document.getElementById("listOfProfiles");
const listItems = paginatedList.querySelectorAll("li");

const paginationLimit = 10; //How many items we want to display per page
const pageCount = Math.ceil(listItems.length / paginationLimit); //Divide the items we want to display per the amount of total items there are
let currentPage = 1;


//filter variables
const filterBtn = document.getElementById("filterButton");
const resetBtn = document.getElementById("resetButton");

const maxAgeField = document.getElementById("maxAgeField");
var minAgeField = document.getElementById("minAgeField");




const disableButton = (button) =>{
    button.classList.add("disabled");
    button.setAttribute("disabled",true);
};


const enableButton = (button) =>{
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
};

const handlePageButtonsStatus = () =>{
    if(currentPage == 1){
        disableButton(paginationPrevButton);
    }else{
        enableButton(paginationPrevButton);
    }

    if(pageCount == currentPage){
        disableButton(paginationNextButton);
    }else{
        enableButton(paginationNextButton);
    }

};

const handleActivityPageNumber = () => {
    document.querySelectorAll(".pagination-number").forEach((button) =>{
        button.classList.remove("active");

        const pageIndex = Number(button.getAttribute("page-index"));
        if(pageIndex == currentPage){
            button.classList.add("active");
        }
    });
    };

//Function which will create buttons for each page
const appendPageNumber = (index) =>{
    const pageNumber = document.createElement("button");
    pageNumber.className = "pagination-number";
    pageNumber.innerHTML = index;
    pageNumber.setAttribute("page-index",index);
    pageNumber.setAttribute("aria-label","Page " + index);

    paginationNumbers.appendChild(pageNumber);
};

const getPaginationNumbers = () =>{
    for(let i =1; i<= pageCount; i++){
        appendPageNumber(i);
    }
};


//Function which controls what profiles to show
const setCurrentPage = (pageNum) =>{
    currentPage = pageNum;

    handleActivityPageNumber();
    handlePageButtonsStatus();

const prevRange = (pageNum - 1) * paginationLimit;
const currRange = pageNum * paginationLimit;

listItems.forEach((item,index) => {
    item.classList.add("hidden");

    if(index >= prevRange && index < currRange){
        item.classList.remove("hidden");
    }

    if(filterBtn.checked){
        if(loadedProfiles[index].dob.age < minAgeField.value || loadedProfiles[index].dob.age > maxAgeField.value){
            
            item.classList.add("hidden");
        };
    }

    });
};




function filterListByAge(minAge,maxAge){

listItems.forEach((item,index) => {

    if(loadedProfiles[index].dob.age < minAge || loadedProfiles[index].dob.age > maxAge){
            
        item.classList.add("hidden");
    };

    });
};



    
    window.addEventListener("load", () =>{
        getPaginationNumbers();
        setCurrentPage(1);

        paginationNextButton.addEventListener("click", () =>{
            setCurrentPage(currentPage + 1);
        });

        paginationPrevButton.addEventListener("click", () =>{
            setCurrentPage(currentPage - 1);
        });

        filterBtn.addEventListener("click", () =>{
            if(maxAgeField.value === ""){
                maxAgeField.value = "75";

            }else if(minAgeField.value === ""){
                minAgeField.value = "18";

            }

            filterListByAge(minAgeField.value,maxAgeField.value);
        });

        resetBtn.addEventListener("click", () =>{
            filterBtn.checked = false;
            minAgeField.value =null;
            maxAgeField.value =null;
            setCurrentPage(1);
        })

        document.querySelectorAll(".pagination-number").forEach((button) =>{
            const pageIndex = Number(button.getAttribute("page-index"));
            

            if(pageIndex){
                button.addEventListener("click", () =>{
                    setCurrentPage(pageIndex);
                });
            }
        });
    });

