document.addEventListener("DOMContentLoaded", () => {
    loadEsportsEvents();
    loadMatchTable();
});

// Sample Esports Events
const esportsEvents = [
    { id: 1, name: "Valorant Tournament", fee: "₹500" },
    { id: 2, name: "CS:GO Championship", fee: "₹300" },
    { id: 3, name: "FIFA 23 Showdown", fee: "₹400" },
    { id: 4, name: "PUBG Mobile Battle", fee: "₹600" }
];

// Function to Load Esports Events
function loadEsportsEvents() {
    const esportsList = document.getElementById("esports-list");

    esportsEvents.forEach(event => {
        const eventCard = document.createElement("div");
        eventCard.classList.add("col-md-6");

        eventCard.innerHTML = `
            <div class="esports-card">
                <h4>${event.name}</h4>
                <p>Registration Fee: ${event.fee}</p>
                <a href="#" class="register-btn" onclick="registerEsports('${event.name}')">Register</a>
            </div>
        `;

        esportsList.appendChild(eventCard);
    });
}

// Function to Handle Registration
function registerEsports(eventName) {
    const playerName = prompt("Enter your name:");
    const email = prompt("Enter your email:");

    if (playerName && email) {
        alert(`You have successfully registered for ${eventName}!`);
        saveMatch(playerName);
    }
}

// Store Player Registration & Generate Matches
let registeredPlayers = [];

function saveMatch(playerName) {
    registeredPlayers.push(playerName);

    if (registeredPlayers.length % 2 === 0) {
        const player1 = registeredPlayers[registeredPlayers.length - 2];
        const player2 = registeredPlayers[registeredPlayers.length - 1];

        addMatchToTable(player1, player2);
    }
}

// Function to Add Match to Table
function addMatchToTable(player1, player2) {
    const matchTable = document.querySelector("#match-table tbody");

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${player1}</td>
        <td>${player2}</td>
        <td><a href="#" class="contact-btn" onclick="contactOpponent('${player1}', '${player2}')">Contact</a></td>
    `;

    matchTable.appendChild(row);
}

// Function to Simulate Contacting an Opponent
function contactOpponent(player1, player2) {
    alert(`${player1} and ${player2}, please coordinate your match time!`);
}
