async function createRoom() {
  try {
    const createRes = await fetch("http://localhost:5000/user/createroom", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // send cookie to backend
    });

    const createData = await createRes.json();
    if (!createRes.ok) return alert(createData.message);
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: createData.user,
        roomId: createData.roomId,
        isOwner: true,
      })
    );
    if (createRes.ok) {
      window.location.href =
        "http://127.0.0.1:5500/Chat%20application/room.html";
    }
  } catch (error) {
    console.log("Create Room Error:", error);
    alert("Something went wrong while creating room.");
  }
}

async function joinRoom() {
  const username = localStorage.getItem("user");
  const roomId = document.getElementById("roomId").value.trim();
  if (!(roomId && username)) return alert("Enter the Room ID");

  try {
    const joinRes = await fetch("http://localhost:5000/user/joinroom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ roomId, username }),
    });

    const joinData = await joinRes.json();
    if (!joinRes.ok) return alert(joinData.message);

    // ✅ Save the correct data to localStorage
    localStorage.setItem("user", JSON.stringify({ username, roomId }));

    window.location.href = `room.html?room=${roomId}`;
  } catch (error) {
    console.error("Join Room Error:", error);
    alert("Something went wrong while joining the room.");
  }
}
