console.log("%cfetch.js", "color:yellow;");

let submitButton = document.getElementById('submitBtn');
let contentBox = document.getElementById('content');

submitButton.addEventListener("click", fetchData);

function fetchData() {
    console.log("Functioning...");
    let api = "https://script.google.com/macros/s/AKfycbzy4vQ7SkUAfztAjb6BIHLd-4ULX-QLIw3zNjnYHSzUdEcRVjsVwF57WUnXawK8MnsM4Q/exec";
    api = "https://script.google.com/macros/s/AKfycbwYkYBPVb-HKuDcApx5cxWdC_sVYGPBs3w5uh_o2N-3R4xRdbMGpVyAXBdqM3iZ7MXzIQ/exec";

    let params = { method: "POST" };

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
        let list = document.createElement('ol');
        let li;

        list.type = "1";
        for (let i = 0; i < data.length; i++) {
            let element = data[i];
            li = document.createElement('li');
            li.innerText = element;

            list.appendChild(li);
        }

        contentBox.innerHTML= "<h2> All Clubs</h2>";
        contentBox.appendChild(list);

    }).catch((error) => {
        console.log("Fetch ERROR: " + error);
        alert("Error during fetching data");
    });



}