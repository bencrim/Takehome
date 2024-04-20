'use client'
import { useEffect, useState } from 'react';
import styles from "./page.module.css";
import Table from 'react-bootstrap/Table';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Stack from 'react-bootstrap/Stack';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [games, setGames] = useState(() => GetGames());
  const [gamesArray, setGamesArray] = useState((false));

  const [giveaways, setGiveaways] = useState(() => GetGiveaways());
  const [giveawayArray, setGiveawaysArray] = useState((false));

  if (!gamesArray){
    games.then((data) => {
      setGames(data);
      setGamesArray(true);
    });
  }

  if (!giveawayArray){
    giveaways.then((data) => {
      setGiveaways(data);
      setGiveawaysArray(true);
    });
  }
  
  return (
    <Stack gap={3}>
      <p className={styles.title}>Takehome</p>
      <NavTabs 
        games={games}
        giveaways={giveaways}
      />
    </Stack>
  );
}

function NavTabs( {games, giveaways} ) {
  return (
    <Tabs  
      defaultActiveKey="profile"
      className="mb-3 justify-content-center"
    >
      <Tab eventKey="games" title="Free Games">
        <div className='container'>
          <GamesTable 
            games={games}
          />
        </div>
      </Tab>
      <Tab eventKey="giveaways" title="Giveaways">
        <div className='container'>
          <GiveawaysTable 
          giveaways={giveaways}
        />
        </div> 
      </Tab>
    </Tabs>
  );
}

function GamesTable({ games }) {
  let platforms = [];
  let genres = [];
  for (let i = 0; i < games.length; i++) {
    let platform = games[i].platform;
    if (platform.includes(",")){
      let platformEntrys = platform.split(", ");
      for (let j = 0; j < platformEntrys.length; j++){
        if (!platforms.includes(platformEntrys[j])) {
          platforms.push(platformEntrys[j]);
        }
      }
    } else {
      if (!platforms.includes(platform)) {
        platforms.push(platform);
      }
    }

    let genre = games[i].genre;
    if (!genres.includes(genre)) {
      genres.push(genre);
    }
  }

  const [platform, setPlatform] = useState((""));
  const [genre, setGenre] = useState((""));
  const [sortBy, setSortBy] = useState((""));
  const [sortedGames, setSortedGames] = useState([]);

  GetGamesSorted({platform, genre, sortBy, setSortedGames});
  //useEffect(() => {GetGamesSorted({platform, genre, sortBy, setSortedGames});}, [platform, genre, sortBy]);

  if (sortedGames.length == 0){
    setSortedGames(["Loading..."])
  }

  return (
    <Table responsive striped>
      <thead className='table-info'>
        <tr>
          <Platform 
            platforms={platforms}
            setPlatform={setPlatform}
            games={true}
          />
          <Genre
            genres={genres}
            setGenre={setGenre}
          />
          <SortGames
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </tr>
      </thead>
      <tbody>
        {sortedGames.map(
          (game) => (
            <tr key={game.id}>
              <td>{game.platform}</td>
              <td>{game.genre}</td>
              <td ><img src={game.thumbnail} class="img-thumbnail" alt="Responsive image"></img></td>
              <td><a href={game.game_url}>{game.title}</a></td>
              <td>{game.release_date}</td>
            </tr>
          )
        )}
      </tbody>
    </Table>
  );
}

function GiveawaysTable({ giveaways }) {
  let platformsArray = [];
  let typesArray = [];
  for (let i = 0; i < giveaways.length; i++) {
    let platforms = giveaways[i].platforms;
    if (platforms.includes(",")){
      let platformEntrys = platforms.split(", ");
      for (let j = 0; j < platformEntrys.length; j++){
        if (!platformsArray.includes(platformEntrys[j])) {
          platformsArray.push(platformEntrys[j]);
        }
      }
    } else {
      if (!platformsArray.includes(platforms)) {
        platformsArray.push(platforms);
      }
    }
    
    
    let type = giveaways[i].type;
    if (!typesArray.includes(type)) {
      typesArray.push(type);
    }
  }

  const [platform, setPlatform] = useState((""));
  const [type, setType] = useState((""));
  const [sortBy, setSortBy] = useState((""));
  const [sortedGiveaways, setSortedGiveaways] = useState([]);

  GetGiveawaysSorted({platform, type, sortBy, setSortedGiveaways})

  if (sortedGiveaways.length == 0){
    setSortedGiveaways(["Loading..."])
  }

  return (
    <Table responsive striped>
      <thead className='table-warning'>
        <tr>
          <Platform 
            platforms={platformsArray}
            setPlatform={setPlatform}
            games={false}
          />
          <Type
            types={typesArray}
            setType={setType}
          />
          <SortGiveaways
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </tr>
      </thead>
      <tbody>
        {sortedGiveaways.map(
          (giveaway) => (
            <tr key={giveaway.id}>
              <td>{giveaway.platforms}</td>
              <td>{giveaway.type}</td>
              <td>{giveaway.worth}</td>
              <td><a href={giveaway.open_giveaway_url}>{giveaway.title}</a></td>
              <td>{giveaway.end_date}</td>
            </tr>
          )
        )}
      </tbody>
    </Table>
  );
}

function SortGames({ sortBy, setSortBy }) {
  let relevance = "Relevance";
  let title = "Title";
  let release = "Release";
  
  if(sortBy == "relevance") {
    relevance = "Relevance ▾"
  }
  else if(sortBy == "alphabetical") {
    title = "Title ▾"
  }
  else if(sortBy == "release-date") {
    release = "Release ▾"
  }

  return (
    <>
      <th onClick={() => setSortBy("relevance")}>{relevance}</th>
      <th onClick={() => setSortBy("alphabetical")}>{title}</th>
      <th onClick={() => setSortBy("release-date")}>{release}</th>
    </>
  );
}

function SortGiveaways({ sortBy, setSortBy }) {
  let value = "Value";
  let popularity = "Popularity";
  let date = "End Date";
  
  if(sortBy == "value") {
    value = "Value ▾"
  }
  else if(sortBy == "popularity") {
    popularity = "Popularity ▾"
  }
  else if(sortBy == "date") {
    date = "End Date ▾"
  }

  return (
    <>
      <th onClick={() => setSortBy("value")}>{value}</th>
      <th onClick={() => setSortBy("popularity")}>{popularity}</th>
      <th onClick={() => setSortBy("date")}>{date}</th>
    </>
  );
}

function Platform({ platforms, setPlatform, games }) {
  if (platforms.length == 0){
    platforms == ["Loading..."];
  }
  if (!platforms.includes("All")){
    platforms.unshift("All");
  }
  let variant = "";
  if (games){
    variant = "info";
  }
  else {
    variant = "warning";
  }
  return (
    <th>
      <DropdownButton id="dropdown-basic-button" title="Platform" variant={variant}>
        {platforms.map(
          (platform) => (
            <Dropdown.Item key={platform} onClick={() => {
              let platformOut = "";
              if (platform == "All"){
                platformOut = "";
              }
              else if (platform == "PC (Windows)" || platform == "PC"){
                platformOut = "pc";
              }
              else if (platform == "Web Browser"){
                platformOut = "browser";
              }
              else if (platform == "Epic Games Store"){
                platformOut = "epic-games-store";
              }
              else if (platform == "Steam"){
                platformOut = "steam";
              }
              else if (platform == "DRM-Free"){
                platformOut = "drm-free";
              }
              else if (platform == "Playstation 5"){
                platformOut = "ps5";
              }
              else if (platform == "Playstation 4"){
                platformOut = "ps4";
              }
              else if (platform == "Xbox Series X|S"){
                platformOut = "xbox-series-xs";
              }
              else if (platform == "Xbox One"){
                platformOut = "xbox-one";
              }
              else if (platform == "Android"){
                platformOut = "android";
              }
              else if (platform == "iOS"){
                platformOut = "ios";
              }
              else if (platform == "Itch.io"){
                platformOut = "itchio";
              }
              else if (platform == "Nintendo Switch"){
                platformOut = "switch";
              }
              else if (platform == "Xbox 360"){
                platformOut = "xbox-360";
              }
              else if (platform == "GOG"){
                platformOut = "gog";
              }
              else if (platform == "Battle.net"){
                platformOut = "battlenet";
              }
              else if (platform == "VR"){
                platformOut = "vr";
              }
              else if (platform == "Origin"){
                platformOut = "origin";
              }
              else if (platform == "Ubisoft"){
                platformOut = "ubisoft";
              }
              setPlatform(platformOut)
            }}>{platform}</Dropdown.Item>
          )
        )}
      </DropdownButton>
    </th>
  );
}

function Genre({ genres, setGenre }) {
  if (genres.length == 0){
    genres == ["Loading..."];
  } 
  if (!genres.includes("All")) {
    genres.unshift("All");
  }
  return (
    <th>
      <DropdownButton id="dropdown-basic-button" title="Genre" variant='info'>
        {genres.map(
          (genre) => (
            <Dropdown.Item key={genre} onClick={() => {
              let genreOut = "";
              if (genre == "All"){
                genreOut = "";
              }
              else if (genre == "Shooter"){
                genreOut = "shooter";
              }
              else if (genre == "ARPG" || genre == "Action RPG"){
                genreOut = "action-rpg";
              }
              else if (genre == "Strategy"){
                genreOut = "strategy";
              }
              else if (genre == "Battle Royale"){
                genreOut = "battle-royale";
              }
              else if (genre == "MMORPG" || genre == "MMOARPG" || genre == " MMORPG"){
                genreOut = "mmorpg";
              }
              else if (genre == "Fighting"){
                genreOut = "fighting";
              }
              else if (genre == "MOBA"){
                genreOut = "moba";
              }
              else if (genre == "Action Game" || genre == "Action"){
                genreOut = "action";
              }
              else if (genre == "Card" || genre == "Card Game"){
                genreOut = "card";
              }
              else if (genre == "Sports"){
                genreOut = "sports";
              }
              else if (genre == "Racing"){
                genreOut = "racing";
              }
              else if (genre == "Social"){
                genreOut = "social";
              }
              else if (genre == "Fantasy"){
                genreOut = "fantasy";
              }
              else if (genre == "MMO"){
                genreOut = "mmo";
              }
              else if (genre == "Survival"){
                genreOut = "survival";
              }
              else if (genre == "Tank"){
                genreOut = "tank";
              }
              setGenre(genreOut)
            }}>{genre}</Dropdown.Item>
          )
        )}
      </DropdownButton>
    </th>
  )
}

function Type({ types, setType }) {
  if (types.length == 0){
    types == ["Loading..."];
  }
  if (!types.includes("All")){
    types.unshift("All");
  }
  return (
    <th>
        <DropdownButton id="dropdown-basic-button" title="Type" variant='warning'>
        {types.map(
          (type) => (
            <Dropdown.Item key={type} onClick={() => {
              let typeOut = "";
              if (type == "All"){
                typeOut = "";
              }
              else if (type == "DLC"){
                typeOut = "loot";
              }
              else if (type == "Game"){
                typeOut = "game";
              }
              else if (type == "Early Access"){
                typeOut = "beta";
              }
              setType(typeOut)
            }}>{type}</Dropdown.Item>
          )
        )}
      </DropdownButton>
    </th>
  )
}

async function GetGames() {
  const url = 'https://free-to-play-games-database.p.rapidapi.com/api/games';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': `${process.env.REACT_APP_API_KEY}`,
      'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
    }
  };
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }

  
}

async function GetGamesSorted({ platform, genre, sortBy, setSortedGames}) {
  let url = `https://free-to-play-games-database.p.rapidapi.com/api/games?`;
  if (platform != ""){
    url += `platform=${platform}&`;
  }
  if (genre != ""){
    url += `category=${genre}&`;
  }
  if (sortBy != ""){
    url += `sort-by=${sortBy}`;
  }

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': `${process.env.REACT_APP_API_KEY}`,
      'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    setSortedGames(result);
  } catch (error) {
    console.error(error);
  }
}

async function GetGiveaways() {
  const url = 'https://gamerpower.p.rapidapi.com/api/giveaways';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': `${process.env.REACT_APP_API_KEY}`,
      'X-RapidAPI-Host': 'gamerpower.p.rapidapi.com'
    }
  };
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function GetGiveawaysSorted({ platform, type, sortBy, setSortedGiveaways}) {
  let url = `https://gamerpower.p.rapidapi.com/api/giveaways?`;
  if (platform != ""){
    url += `platform=${platform}&`;
  }
  if (type != ""){
    url += `type=${type}&`;
  }
  if (sortBy != ""){
    url += `sort-by=${sortBy}`;
  }

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': `${process.env.REACT_APP_API_KEY}`,
      'X-RapidAPI-Host': 'gamerpower.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    setSortedGiveaways(result);
  } catch (error) {
    console.error(error);
  }
}

