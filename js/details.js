"use strict"
console.log("%c details.js", "color:yellow;");

// DOM Variables
let dropdown = document.getElementById('options-dropdown');
let searchButton = document.getElementById("details-search-btn");
let contentBox = document.getElementById('content-box');

// Data Variables
let AllData;

getAllClubs();

searchButton.addEventListener("click", getDetails);


function getAllClubs() {
    console.log("Loading all club names...");
    contentBox.innerHTML = "Loading..."
    let interval = setInterval(() => {
        contentBox.innerHTML += "..."
    }, 200);


    let api = "https://script.google.com/macros/s/AKfycbwKg9Scw9qcQjo4gq86PqZaUcDjyd-IyrJC9gyjA23f0ReBmO-BeaMYfqLMfKShnDxYpg/exec";
    let formData = new FormData();
    // formData.append('action', 'getAllClubNames');
    formData.append('action', 'getAllDetails');
    let params = { method: "POST", body: formData };


    fetch(api, params).then(res => res.text()).then((_result) => {
        contentBox.innerHTML = "";
        clearTimeout(interval);
        let result;
        try {
            result = JSON.parse(_result);
            if (result.status !== 0) {
                console.log(result.message);
                throw new Error("Incorrect request");
            }
        } catch (error) {
            console.log(result);
            dropdown.parentNode.innerHTML = "<h2>An error occured. Try again</h2>";
            console.log(`JSON Error: ${error}`);
            return;
        }

        document.getElementsByClassName("option-box")[0].style.visibility = "visible";

        let option = document.createElement('option');
        let all = result.data;

        AllData = all;

        option.value = "0";
        option.innerHTML = "&nbsp; SELECT CLUB &nbsp;";
        option.disabled = true;
        option.setAttribute("selected", true);
        dropdown.appendChild(option);

        for (let i = 0; i < all.length; i++) {
            option = document.createElement('option');
            option.value = `${i + 1}`;
            option.innerText = all[i].name;

            dropdown.appendChild(option);
        }

    }).catch((error) => {
        console.log(`FETCH ERROR: ${error}`);
        contentBox.innerHTML = "<h2>An error occured during fetching data. Try again</h2>";
    })
}


function getDetails() {
    let id = dropdown.value;
    if (id === "" || id === "0") {
        return;
    }
    console.log(`id: ${id}`);

    if (id <= 0) {
        contentBox.innerHTML = "<h2>Invalid Search. Try again</h2>";
        return;
    }

    let data = AllData[(id - 1)];

    contentBox.innerHTML = `
        <p><span>ক্লাব</span>&nbsp; : &nbsp; ${data.name}</p>
        <p><span>থিম</span>&nbsp; : &nbsp; ${data.theme}</p>
        <p><span>সম্বন্ধে</span>&nbsp; : &nbsp; ${data.details}</p>
        <p><span>ঠিকানা</span>&nbsp; : &nbsp; ${data.address}</p>
        <p><span>এলাকা</span>&nbsp; : &nbsp; ${data.locality}</p>
        `;

}