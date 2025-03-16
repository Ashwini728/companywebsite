// Register Player
async function registerPlayer(eventName, playerName, contact) {
    const res = await fetch('http://localhost:4000/api/esports/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventName, playerName, contact }),
    });
  
    const data = await res.json();
    alert(data.message);
  }
  
  // Fetch Match Table
  async function getMatchTable(eventName) {
    const res = await fetch(`http://localhost:4000/api/esports/match-table?eventName=${eventName}`);
    const matches = await res.json();
  
    const tableBody = document.querySelector('#match-tables tbody');
    tableBody.innerHTML = '';
  
    matches.forEach((match) => {
      tableBody.innerHTML += `
        <tr>
          <td>${match.player1}</td>
          <td>${match.player2}</td>
          <td><a href="${match.contactLink}" class="btn btn-primary">Message</a></td>
        </tr>
      `;
    });
  }
// Register Player
async function registerPlayer(eventName, playerName, contact) {
    const res = await fetch('http://localhost:4000/api/esports/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventName, playerName, contact }),
    });
  
    const data = await res.json();
    alert(data.message);
  }
  
  // Fetch Match Table
  async function getMatchTable(eventName) {
    const res = await fetch(`http://localhost:4000/api/esports/match-table?eventName=${eventName}`);
    const matches = await res.json();
  
    const tableBody = document.querySelector('#match-tables tbody');
    tableBody.innerHTML = '';
  
    matches.forEach((match) => {
      tableBody.innerHTML += `
        <tr>
          <td>${match.player1}</td>
          <td>${match.player2}</td>
          <td><a href="${match.contactLink}" class="btn btn-primary">Message</a></td>
        </tr>
      `;
    });
  }
    