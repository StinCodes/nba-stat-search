import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [playerName, setPlayerName] = useState("");
  const [playerStats, setPlayerStats] = useState({});

  const handleSubmit = (e)=>{
    e.preventDefault()
    getPlayerId()
    console.log(playerName)
  }

  const handleChange = (e)=>{
    //player name needs to have underscore instead of space
    const replace = e.target.value.split(" ").join("_")
    if(replace.length > 0){
      setPlayerName(replace)
    }else{
      alert("Please enter player's name")
    }
  }

  useEffect(() => {
    getPlayerId();
    getPlayerStats();
  }, []);

  const getPlayerId = () => {
    axios
      .get(`https://www.balldontlie.io/api/v1/players?search=${playerName}`)
      .then(async (res) => {
        console.log("playerId", res.data.data);
        await getPlayerStats(res.data.data[0].id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPlayerStats = (playerId) => {
    axios
      .get(
        `https://www.balldontlie.io/api/v1/season_averages?season=2019&player_ids[]=${playerId}`
      )
      .then(async (res) => {
        console.log("playerStats", res.data.data);
        setPlayerStats(res.data.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={playerName}
            onChange={handleChange}
            placeholder="Please enter the player's name..."
          />
        </label>
        <input type="submit" value='submit'/>
      </form>
    </div>
  );
}

export default App;
