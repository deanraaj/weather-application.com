const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
wIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");



locationBtn = inputPart.querySelector("button");

let apiKey = "57ed399c13d1ea1e82b38dc9c0a13bf7";

let api;

inputField.addEventListener("keyup", e =>{
    // if user pressed enter button and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", ()=>{
    if(navigator.geolocation){ // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support geolocation api");
    }
});

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}


function requestApi(city){
    
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details....";
    infoTxt.classList.add("pending");
    // getting api responses and returning it with parsing into js obj and in other
    // then function calling weatherdetails function with passing api result as argument
    fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}



function weatherDetails(info){
    infoTxt.classList.replace("pending", "error");
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} is not a valid city name`;
        
    } else {
        // let's get required properties from the info objects
        const city = info.name;
        const country = info.sys.country;
        const {description , id} = info.weather[0];
        const {feels_like , humidity, temp} = info.main;

        // using custom icon according to the id which api returns us
        if(id == 800){
            wIcon.src = "icons/clear.svg";
        } else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";
        } else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        } else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        } else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = "icons/rain.svg";
        } else{
            wIcon.src = "icons/cloud.svg";
        }

        // let's pass the values to the particular html element
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;
          
        infoTxt.classList.remove("error", "pending");
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
})
