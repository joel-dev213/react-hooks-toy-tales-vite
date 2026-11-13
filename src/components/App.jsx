import React, { useEffect, useState } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const TOYS_URL = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  useEffect(() => {
    fetch(TOYS_URL)
      .then((response) => response.json())
      .then((toysData) => setToys(toysData))
      .catch((error) => console.error("Error fetching toys:", error));
  }, []);

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  function handleAddToy(newToy) {
    setToys((currentToys) => [...currentToys, newToy]);
  }

  function handleLike(id) {
    const toy = toys.find((toy) => toy.id === id);
    if (!toy) return;

    const updatedLikes = toy.likes + 1;

    setToys((currentToys) =>
      currentToys.map((toy) =>
        toy.id === id ? { ...toy, likes: updatedLikes } : toy
      )
    );

    fetch(`${TOYS_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ likes: updatedLikes }),
    }).catch((error) => console.error("Error liking toy:", error));
  }

  function handleDonate(id) {
    fetch(`${TOYS_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setToys((currentToys) => currentToys.filter((toy) => toy.id !== id));
      })
      .catch((error) => console.error("Error donating toy:", error));
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onDonate={handleDonate} onLike={handleLike} />
    </>
  );
}

export default App;
