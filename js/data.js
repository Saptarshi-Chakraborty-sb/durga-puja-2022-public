console.log("%cfetch.js", "color:yellow;");

let allClubsButton = document.getElementById('all-clubs-btn');
let allThemesButton = document.getElementById('all-themes-btn');
let contentBox = document.getElementById('content');

let fetchType = "";

allClubsButton.addEventListener("click", () => { getData('club') });
allThemesButton.addEventListener("click", () => { getData('theme') });








function fetchData() {
    console.log("Functioning...");

    let api;
    api = "https://script.google.com/macros/s/AKfycbxeToG5lDI7CAakz2nx1aVJBTvVrQC-kW8HeIQ_X2wqw39l-OUaWK1T-hWrzFS6iAlwFQ/exec";

    let primaryFormData = {};

    // primaryFormData = { id: 1, name: "Saptarshi" };
    primaryFormData = { action: "getAllDetails" };
    // primaryFormData = { action: "getDetails", id: 10 };
    // primaryFormData = { action: "getAllClubNames" };
    // primaryFormData = { action: "getAllPujoThemes" };
    let formData = new FormData();

    for (const key in primaryFormData)
        formData.append(key, primaryFormData[key]);

    let params = { method: "POST", body: formData };

    fetch(api, params).then(res => res.text()).then((result) => {
        let data;

        try {
            data = JSON.parse(result);
        } catch (error) {
            // console.log(result);
            console.log(`JSON Error: ${error}`);
            return;
        }
        console.log(data);
        let clubs = data.data;
        let list = document.createElement('ol');
        let li;

        list.type = "1";
        for (let i = 0; i < clubs.length; i++) {
            let element = clubs[i];
            li = document.createElement('li');
            li.innerText = element;

            list.appendChild(li);
        }

        contentBox.innerHTML = "<h2> All Clubs</h2>";
        contentBox.appendChild(list);

    }).catch((error) => {
        console.log("Fetch ERROR: " + error);
        alert("Error during fetching data");
    });



}

function getData(type = "club") {
    fetchType = (type === "theme") ? "theme" : "club";

    contentBox.innerHTML = "Loading...";
    let interval = setInterval(() => {
        contentBox.innerHTML += ".";
    }, 500);

    let api = "https://script.google.com/macros/s/AKfycbxeToG5lDI7CAakz2nx1aVJBTvVrQC-kW8HeIQ_X2wqw39l-OUaWK1T-hWrzFS6iAlwFQ/exec";

    let formData = new FormData();
    formData.append('action', (type === "theme" ? "getAllPujoThemes" : "getAllClubNames"));

    let params = { method: "POST", body: formData };
    fetch(api, params).then(res => res.text()).then((_result) => {
        let result;
        try {
            result = JSON.parse(_result);
            console.log(result);
        } catch (error) {
            console.log(`JSON ERROR: ${error}`);
            clearInterval(interval);
            contentBox.innerText = "An error occured. Try again";
            return;
        }

        clearInterval(interval);
        let status = result.status;
        let message = result.message;

        if (fetchType !== type)
            return;

        if (status == 0) {
            let all = result.data;
            let list = document.createElement('ol');
            let li;

            list.type = "1";
            for (let i = 0; i < all.length; i++) {
                let element = all[i];
                li = document.createElement('li');
                li.innerText = element;

                list.appendChild(li);
            }

            if (type === 'theme')
                contentBox.innerHTML = "<h2> All Themes</h2>";
            else
                contentBox.innerHTML = "<h2> All Clubs</h2>";
            contentBox.appendChild(list);

        } else if (status == 1) {
            console.log(message)
            contentBox.innerHTML = "<h2>Incorrect Request Happened ☹</h2>"
        }
    }).catch((error) => {
        alert("An error occurred, try again later");
        console.log(`Fetch ERROR: ${error}`);
    });

}