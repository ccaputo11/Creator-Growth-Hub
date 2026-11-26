// Store creator information
let creators = JSON.parse(localStorage.getItem("creators")) || [];

// Add a new creator
function addCreator() {
    let name = document.getElementById("creatorName").value;
    let niche = document.getElementById("niche").value;

    if (name.trim() === "") {
        alert("Please enter a creator name.");
        return;
    }

    creators.push({
        name: name,
        niche: niche,
        status: "Researching"
    });

    document.getElementById("creatorName").value = "";

    displayCreators();
}

// Display creators in the pipeline
function displayCreators() {
    localStorage.setItem("creators", JSON.stringify(creators));
    let list = document.getElementById("creatorList");

    list.innerHTML = "";

    creators.forEach((creator, index) => {
        let card = document.createElement("div");
        card.className = "creator";

        card.innerHTML = `
            <h3></h3>
            <p></p>

            <select onchange="updateStatus(${index}, this.value)">
                <option>Researching</option>
                <option>Contacted</option>
                <option>Replied</option>
                <option>Call Booked</option>
                <option>Signed</option>
            </select>

            <button onclick="removeCreator(${index})">
                Remove
            </button>
        `;

        card.querySelector("h3").textContent = creator.name;
        card.querySelector("p").textContent = creator.niche;
        card.querySelector("select").value = creator.status;

        list.appendChild(card);
    });

    updateDashboard();
}

// Update creator status
function updateStatus(index, status) {
    creators[index].status = status;
    updateDashboard();
}

// Remove a creator
function removeCreator(index) {
    creators.splice(index, 1);
    displayCreators();
}

// Update dashboard numbers
function updateDashboard() {
    let contacted = 0;
    let booked = 0;

    creators.forEach((creator) => {
        if (creator.status !== "Researching") {
            contacted++;
        }

        if (creator.status === "Call Booked" ||
            creator.status === "Signed") {
            booked++;
        }
    });

    document.getElementById("total").textContent = creators.length;
    document.getElementById("contacted").textContent = contacted;
    document.getElementById("booked").textContent = booked;
}

// Check creator qualification
function checkQualification() {
    let score = 0;

    if (document.getElementById("consistent").checked) {
        score++;
    }

    if (document.getElementById("audience").checked) {
        score++;
    }

    if (document.getElementById("link").checked) {
        score++;
    }

    let result = "";

    if (score === 3) {
        result = "Strong candidate for outreach!";
    } else if (score === 2) {
        result = "Promising creator!";
    } else {
        result = "Needs more research.";
    }

    document.getElementById("score").textContent =
        "Qualification Score: " + score + "/3 - " + result;
}

// Button events
document.getElementById("addCreator")
    .addEventListener("click", addCreator);

document.getElementById("checkScore")
    .addEventListener("click", checkQualification);

// AJAX - Read growth tips from a text file
function loadGrowthTip() {
    let request = new XMLHttpRequest();

    request.open("GET", "tips.txt", true);

    request.onload = function() {
        if (request.status === 200) {
            let tips = request.responseText
                .split("\n")
                .filter(tip => tip.trim() !== "");

            let random = Math.floor(Math.random() * tips.length);

            document.getElementById("growthTip").textContent =
                tips[random];
        } else {
            document.getElementById("growthTip").textContent =
                "Unable to load growth tips.";
        }
    };

    request.onerror = function() {
        document.getElementById("growthTip").textContent =
            "Please check your connection.";
    };

    request.send();
}

document.getElementById("loadTip")
    .addEventListener("click", loadGrowthTip);
// Display saved creators when the page loads
displayCreators();