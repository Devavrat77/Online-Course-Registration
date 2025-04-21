
const form = document.getElementById("cities");
const addbtn = document.getElementById("addBtn");
let allCities = ["Pune", "Mumbai", "Jaipur"];


function RenderCities(cities) {
    const output = document.getElementById("output");
    output.innerHTML = "Current Cities: ";

    cities.forEach(element => {
        const p = document.createElement("p");
        p.innerHTML = (`${element}`);
        output.appendChild(p);
    });
}

function addCity() {
    const city = document.getElementById("city").value;
    console.log(city);
    allCities.push(city);

    RenderCities(allCities);
    // form.reset();
}

function validateNew(){
    
    const city = document.getElementById("city");

    if(city.value.length <5 ){
        city.classList.add("is-invalid");
        city.classList.remove("is-valid");
    }else{
        city.classList.remove("is-invalid");
        city.classList.add("is-valid");
    }
}

function updateCity() {
    const city = document.getElementById("city").value;
    const newcity = document.getElementById("newCity").value;
    let index = allCities.indexOf(city);
    if (index !== -1) {
        allCities[index] = newcity;
    }

    RenderCities(allCities);
}
function deleteCity() {
    const city = document.getElementById("city").value;
    let index = allCities.indexOf(city);
    if (index !== -1) {
        allCities.splice(index,1);
    }
    RenderCities(allCities);
}



form.addEventListener("submit", function (e) {
    e.preventDefault();
});

const city = document.getElementById("city");
// city.addEventListener("blur", function(e){
//     e.validateNew();
// });

RenderCities(allCities);