// confirm("Hello");
console.log("%c index.js", "color:yellow;");

// DOM Variables
let contentBox = document.getElementById('content-box');
let areaDropdown = document.getElementById('area-dropdown');

// Data Variables
let AllData;

// Program Execution start
getAllData();



// Event Listners
areaDropdown.addEventListener("change", changeClubsAsArea);



// Functions
function getAllData() {
    // Check if Internet is On
    if (navigator.onLine === false) {
        console.log(`Internet Connection Unavailable`);
        contentBox.innerHTML = "<h2>Your Internet Connection is not available. Turn it on and try again</h2>";
        return;
    }
    
    console.log("Loading all club names...");
    contentBox.innerHTML = "Loading..."
    let interval = setInterval(() => {
        contentBox.innerHTML += "."
    }, 200);

    let api = "https://script.google.com/macros/s/AKfycbxeToG5lDI7CAakz2nx1aVJBTvVrQC-kW8HeIQ_X2wqw39l-OUaWK1T-hWrzFS6iAlwFQ/exec";
    let formData = new FormData();
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
            contentBox.innerHTML = "<h2>An error occured. Try again</h2>";
            console.log(`JSON Error: ${error}`);
            return;
        }

        let details = document.createElement('details');
        let areaOption = document.createElement('option');
        let allAreas = new Array();
        let all = result.data;

        AllData = all;
        document.getElementById('option-box').style.visibility = "visible";

        areaOption.value = "all";
        areaOption.innerHTML = "&nbsp; ALL &nbsp;";
        areaOption.selected = true;
        areaDropdown.appendChild(areaOption);

        for (let i = 0; i < all.length; i++) {
            let element = all[i];
            details = document.createElement('details');
            details.title = "Click to view details";
            details.innerHTML = `
            <summary>${element.name}</summary>
            <p><span>থিম</span> : ${element.theme}</p>
            <p><span>সম্বন্ধে</span> : ${element.details}</p>
            <p><span>ঠিকানা</span> : ${element.address}</p>
            <p><span>এলাকা</span> : ${element.locality}</p>
            `;

            contentBox.appendChild(details);

            // Setup all areas
            if (!allAreas.includes(element.locality)) {
                allAreas.push(element.locality);
                areaOption = document.createElement('option');
                areaOption.value = element.locality;

                if (element.locality === 'unknown')
                    areaOption.innerText = "Others";
                else
                    areaOption.innerText = element.locality;

                areaDropdown.appendChild(areaOption);
            }
        }

    }).catch((error) => {
        clearTimeout(interval);
        console.log(`FETCH ERROR: ${error}`);
        contentBox.innerHTML = "<h2>An error occured during fetching data. Try again</h2>";
    })
}


function changeClubsAsArea() {
    let value = areaDropdown.value;
    value = value.trim();

    let i;
    let details = document.createElement('details');
    contentBox.innerHTML = "";


    for (i = 0; i < AllData.length; i++) {
        let element = AllData[i];
        if (value === 'all') {
            details = document.createElement('details');
            details.title = "Click to view details";
            details.innerHTML = `
            <summary>${element.name}</summary>
            <p><span>থিম</span> : ${element.theme}</p>
            <p><span>সম্বন্ধে</span> : ${element.details}</p>
            <p><span>ঠিকানা</span> : ${element.address}</p>
            <p><span>এলাকা</span> : ${element.locality}</p>
            `;
            contentBox.appendChild(details);

        } else if (value === element.locality) {
            details = document.createElement('details');
            details.innerHTML = `
            <summary>${element.name}</summary>
            <p><span>থিম</span> : ${element.theme}</p>
            <p><span>সম্বন্ধে</span> : ${element.details}</p>
            <p><span>ঠিকানা</span> : ${element.address}</p>
            <p><span>এলাকা</span> : ${element.locality}</p>
            `;
            contentBox.appendChild(details);

        }
    }
}
