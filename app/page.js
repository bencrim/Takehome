'use client'
import { useState } from 'react';
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
        <GamesTable 
          games={games}
        />
      </Tab>
      <Tab eventKey="giveaways" title="Giveaways">
        <GiveawaysTable 
          giveaways={giveaways}
        />
      </Tab>
    </Tabs>
  );
}

function GamesTable({ games }) {
  let platforms = [];
  let genres = [];
  for (let i = 0; i < games.length; i++) {
    let platform = games[i].platform;
    if (!platforms.includes(platform)) {
      platforms.push(platform);
    }

    let genre = games[i].genre;
    if (!genres.includes(genre)) {
      genres.push(genre);
    }
  }

  const [platform, setPlatform] = useState((""));
  const [genre, setGenre] = useState((""));
  const [sortBy, setSortBy] = useState((""));

  return (
    <Table responsive>
      <thead>
        <tr>
          <Platform 
            platforms={platforms}
            setPlatform={setPlatform}
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
        <tr>
          <td>{platform}</td>
          <td>{genre}</td>
          <td>{sortBy}</td>
        </tr>
      </tbody>
    </Table>
  );
}

function GiveawaysTable({ giveaways }) {
  let platformsArray = [];
  let typesArray = [];
  for (let i = 0; i < giveaways.length; i++) {
    let platforms = giveaways[i].platforms;
    if (!platformsArray.includes(platforms)) {
      platformsArray.push(platforms);
    }

    let type = giveaways[i].type;
    if (!typesArray.includes(type)) {
      typesArray.push(type);
    }
  }

  const [platform, setPlatform] = useState((""));
  const [type, setType] = useState((""));
  const [sortBy, setSortBy] = useState((""));

  return (
    <Table responsive>
      <thead>
        <tr>
          <Platform 
            platforms={platformsArray}
            setPlatform={setPlatform}
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
        <tr>
          <td>{platform}</td>
          <td>{type}</td>
          <td>{sortBy}</td>
        </tr>
      </tbody>
    </Table>
  );
}

function Games({ games }) {

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
  let title = "Title";
  let release = "Release";
  
  if(sortBy == "worth") {
    value = "Value ▾"
  }
  else if(sortBy == "alphabetical") {
    title = "Title ▾"
  }
  else if(sortBy == "release-date") {
    release = "Release ▾"
  }

  return (
    <>
      <th onClick={() => setSortBy("worth")}>{value}</th>
      <th onClick={() => setSortBy("alphabetical")}>{title}</th>
      <th onClick={() => setSortBy("release-date")}>{release}</th>
    </>
  );
}

function Platform({ platforms, setPlatform }) {
  if (platforms.length == 0){
    platforms == ["Loading..."];
  }
  return (
    <th>
      <DropdownButton id="dropdown-basic-button" title="Platform">
        {platforms.map(
          (platform) => (
            <Dropdown.Item onClick={() => setPlatform(platform)}>{platform}</Dropdown.Item>
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
  return (
    <th>
        <DropdownButton id="dropdown-basic-button" title="Genre">
        {genres.map(
          (genre) => (
            <Dropdown.Item onClick={() => setGenre(genre)}>{genre}</Dropdown.Item>
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
  return (
    <th>
        <DropdownButton id="dropdown-basic-button" title="Type">
        {types.map(
          (type) => (
            <Dropdown.Item onClick={() => setType(type)}>{type}</Dropdown.Item>
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
      'X-RapidAPI-Key': '',
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

async function GetGamesSorted({ platform, genre, sortBy}) {
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
      'X-RapidAPI-Key': '',
      'X-RapidAPI-Host': 'free-to-play-games-database.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function GetGiveaways() {
  const url = 'https://gamerpower.p.rapidapi.com/api/giveaways';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '',
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

