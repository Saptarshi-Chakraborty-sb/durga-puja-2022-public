"use strict"
console.log("%c details.js", "color:yellow;");

// DOM Variables
let dropdown = document.getElementById('options-dropdown');
let searchButton = document.getElementById("details-search-btn");
let contentBox = document.getElementById('content-box');
let areaDropdown = document.getElementById('area-dropdown');

// Data Variables
let AllData;

getAllClubs();

dropdown.addEventListener("change", getDetails);

areaDropdown.addEventListener("change", changeClubsAsArea);




// Functions
function getAllClubs() {
    // Check if Internet is On
    if (navigator.onLine === false) {
        console.log(`Internet Connection Unavailable`);
        contentBox.innerHTML = "<h2 style='color:brown;text-decoration:underline;text-align:center;'>Your Internet Connection is not available. Turn it on and try again</h2>";
        return;
    }


    console.log("Loading all club names...");
    contentBox.innerHTML = "Loading..."
    let interval = setInterval(() => {
        contentBox.innerHTML += "."
    }, 200);


    let api = "https://script.google.com/macros/s/AKfycbxeToG5lDI7CAakz2nx1aVJBTvVrQC-kW8HeIQ_X2wqw39l-OUaWK1T-hWrzFS6iAlwFQ/exec";
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
        let areaOption = document.createElement('option');
        let all = result.data;
        let allAreas = new Array();

        AllData = all;

        option.value = "0";
        option.innerHTML = "&nbsp; SELECT CLUB &nbsp;";
        option.disabled = true;
        option.setAttribute("selected", true);
        dropdown.appendChild(option);


        areaOption.value = "all";
        areaOption.innerHTML = "&nbsp; ALL &nbsp;";
        areaOption.selected = true;
        areaDropdown.appendChild(areaOption);


        for (let i = 0; i < all.length; i++) {
            option = document.createElement('option');
            option.value = `${i + 1}`;
            option.innerText = all[i].name;
            dropdown.appendChild(option);

            if (!allAreas.includes(all[i].locality)) {
                allAreas.push(all[i].locality);
                areaOption = document.createElement('option');
                areaOption.value = all[i].locality;

                if (all[i].locality === 'unknown')
                    areaOption.innerText = "Others";
                else
                    areaOption.innerText = all[i].locality;

                areaDropdown.appendChild(areaOption);
            }
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
    // console.log(`id: ${id}`);

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

    let images = data.images;
    if (images.length === 0) {
        let p = document.createElement('p');
        p.innerText = "No Image Available";
        p.style.marginTop = "20px";
        p.style.textDecoration = "underline";
        contentBox.appendChild(p);
        return;
    }


    for (let i = 0; i < images.length; i++) {
        let a = document.createElement('a');
        a.innerHTML = `<img alt="${data.name}" class='sample-img' src="${images[i]}" height="100%" >`;
        a.href = images[i];
        a.target = "_blank";
        contentBox.appendChild(a);
    }

}

function changeClubsAsArea() {
    let value = areaDropdown.value;
    value = value.trim();

    let i;
    let option = document.createElement('option');
    dropdown.innerHTML = "";

    option.value = "0";
    option.innerHTML = "&nbsp; SELECT CLUB &nbsp;";
    option.disabled = true;
    option.setAttribute("selected", true);
    dropdown.appendChild(option);

    for (i = 0; i < AllData.length; i++) {
        let element = AllData[i];
        if (value === 'all') {
            option = document.createElement("option");
            option.value = `${i + 1}`;
            option.innerText = element.name;
            dropdown.appendChild(option);

        } else if (value === element.locality) {
            option = document.createElement("option");
            option.value = `${i + 1}`;
            option.innerText = element.name;
            dropdown.appendChild(option);

        }
    }
}