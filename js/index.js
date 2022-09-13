// confirm("Hello");
console.log("%c index.js", "color:yellow;");

let contentBox = document.getElementById('content-box');

getAllData();



function getAllData() {
    console.log("Loading all club names...");
    contentBox.innerHTML = "Loading..."
    let interval = setInterval(() => {
        contentBox.innerHTML += "..."
    }, 200);


    let api = "https://script.google.com/macros/s/AKfycbwKg9Scw9qcQjo4gq86PqZaUcDjyd-IyrJC9gyjA23f0ReBmO-BeaMYfqLMfKShnDxYpg/exec";
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

        // name : "লিচুতলা সর্বজনীন দুর্গাপূজা কমিটি"
        // theme : "আমেরিকা-র প্যাগোডা"
        // details : "৩য় বর্ষ"
        // address : "লিচুতলা ,হরিদাসমাটি"
        // locality : "হরিদাসমাটি"
        let details = document.createElement('details');
        let all = result.data;
        for (let i = 0; i < all.length; i++) {
            let element = all[i];
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

    }).catch((error) => {
        console.log(`FETCH ERROR: ${error}`);
        contentBox.innerHTML = "<h2>An error occured during fetching data. Try again</h2>";
    })
}