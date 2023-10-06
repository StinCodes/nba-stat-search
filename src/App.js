import "./App.css";
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [playerName, setPlayerName] = useState("");
  const [playerStats, setPlayerStats] = useState({});
  const [selectedSeason, setSelectedSeason] = useState(
    new Date().getFullYear() - 1
  );

  const years = [];
  const currentYear = new Date().getFullYear();
  //descending loop from current year, year represents year in each iteration
  for (let year = currentYear - 1; year >= 1946; year--) {
    years.push(year.toString());
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    getPlayerId();
    // console.log(playerName)
  };

  const handleSeasonChange = (e) => {
    setSelectedSeason(e.target.value);
  };

  const handleChange = (e) => {
    //player name needs to have underscore instead of space
    // const replace = e.target.value.split(" ").join("_");
    // if (replace.length > 0) {
    //   setPlayerName(replace);
    // } else {
    //   alert("Please enter player's name");
    // }
    const newName = e.target.value;
    setPlayerName(newName);
  };

  // useEffect(() => {
  //   getPlayerId();
  //   getPlayerStats();
  // }, []);

  const getPlayerId = () => {
    axios
      .get(`https://www.balldontlie.io/api/v1/players?search=${playerName}`)
      .then(async (res) => {
        // console.log("playerId", res.data.data);
        if (res.data.data[0] === undefined) {
          alert("This player is injured/hasn't played yet!");
        } else if (res.data.data.length > 1) {
          alert(
            "Multiple player results, please further specify the player's name!"
          );
        } else {
          await getPlayerStats(res.data.data[0].id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getPlayerStats = (playerId) => {
    axios
      .get(
        `https://www.balldontlie.io/api/v1/season_averages?season=${selectedSeason}&player_ids[]=${playerId}`
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
      <img
        src="https://www.freelogodesign.org/manager/logos/732b1f3f663d470e99b9b993847f4def/download/logo_free"
        alt="nbastatsearchlogo"
        className="logo"
      />
      <br />
      <form onSubmit={handleSubmit} className="playerForm">
        <label>
          Name:
          <input
            type="text"
            value={playerName}
            onChange={handleChange}
            placeholder="Enter player's name..."
          />
        </label>
        <br />
        <label>
          Season:
          <select value={selectedSeason} onChange={handleSeasonChange}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <br />
        <input type="submit" value="Search" />
      </form>
      <br />
      <div className="gridContainer">
        {/*if playerStats has a value and object has more than 1 property (key) then run code*/}
        {playerStats && Object.keys(playerStats).length > 0 && (
          <div className="statCard">
            <div className="gridItem">
              Games Played: {playerStats["games_played"]}
            </div>
            <br />
            <div className="gridItem">
              Minutes: {playerStats["min"]} minutes
            </div>
            <br />
            <div className="gridItem">Points: {playerStats["pts"]}</div>
            <br />
            <div className="gridItem">Assists: {playerStats["ast"]}</div>
            <br />
            <div className="gridItem">Rebounds: {playerStats["reb"]}</div>
            <br />
            <div className="gridItem">Turnovers: {playerStats["turnover"]}</div>
            <br />
            <div className="gridItem">
              Field Goal Percentage: {playerStats["fg_pct"] * 100 + "%"}
            </div>
            <br />
            <div className="gridItem">
              3-Point Percentage: {playerStats["fg3_pct"] * 100 + "%"}
            </div>
            <br />
            <div className="gridItem">Steals: {playerStats["stl"]}</div>
            <br />
            <div className="gridItem">Blocks: {playerStats["blk"]}</div>
          </div>
        )}
      </div>
      <footer className="footer">
        Created by Austin Song
        <br/>
        <a href="https://github.com/StinCodes/nba-stat-search">Github Repository</a>
      </footer>
    </div>
  );
}

export default App;
