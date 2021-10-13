import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

interface pokemon {
  name: string;
  url: string;
}

interface apiData {
  count: number;
  next: null | string;
  previous: null | string;
  results: pokemon[];
}

const Home: NextPage = () => {
  const [pokemonsData, setPokemonsData] = useState<apiData>();
  const [optionState, setOptionState] = useState("hidden");
  const [searchText, setSearchText] = useState("");
  const [searchedPokemons, setSearchedPokemons] = useState<pokemon[]>();
  const [noPokemonFound, setNoPokemonFound] = useState(false);
  const [lastSearchedText, setLastSearchedText] = useState("");

  useEffect(() => {
    const lastSearched = localStorage.getItem("lastSearched");
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1118")
      .then((res) => res.json())
      .then((data) => setPokemonsData(data));

    window.addEventListener("click", (e) => {
      (e.target as HTMLElement).id === "searchBar"
        ? setOptionState("block")
        : setOptionState("hidden");
    });

    lastSearched !== null && setLastSearchedText(lastSearched);
  }, []);

  useEffect(() => {
    if (searchText.length > 2) {
      const matchedResults = pokemonsData?.results?.filter((data: any) => {
        return data.name.startsWith(searchText);
      });
      matchedResults !== undefined && setSearchedPokemons([...matchedResults]);
    } else {
      setSearchedPokemons([]);
    }
  }, [searchText]);

  useEffect(() => {
    if (searchText.length > 2) {
      searchedPokemons === undefined || searchedPokemons.length == 0
        ? setNoPokemonFound(true)
        : setNoPokemonFound(false);
    } else {
      setNoPokemonFound(false);
    }
  }, [searchedPokemons]);

  useEffect(() => {
    lastSearchedText !== "" &&
      localStorage.setItem("lastSearched", lastSearchedText);
  }, [lastSearchedText]);

  function inputEvent(show: boolean) {
    show ? setOptionState("block") : setOptionState("hidden");
  }

  const colors = ["green", "pink", "indigo", "blue", "yellow"];
  function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  function getPokeCards() {
    const pokemons =
      searchedPokemons == undefined || searchedPokemons.length == 0
        ? pokemonsData?.results
        : searchedPokemons;
    return pokemons?.map((pokemon: any, index: number) => {
      const color = colors[getRandomInt(5)];
      return (
        <div
          key={index}
          className={`py-8 bg-${color}-300 rounded-lg shadow-xl cursor-pointer text-center transition duration-500 ease-in-out transform hover:scale-110`}
        >
          <p className={`antialiased text-3xl text-${color}-600`}>
            {pokemon.name}
          </p>
        </div>
      );
    });
  }

  function searchBar() {
    return (
      <div className="flex items-center mx-auto mt-10 border-2 rounded border-gray-300 relative">
        <input
          type="text"
          placeholder="Search"
          className="py-1 px-3 text-2xl outline-none text-gray-500 bg-gray-100 transition duration-500"
          id="searchBar"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <button
          className="py-1 px-3 text-xl text-gray-400 transition duration-300 hover:bg-blue-100"
          onClick={(e) => setLastSearchedText(searchText)}
        >
          <i className="fas fa-search"></i>
        </button>
        {searchResults()}
      </div>
    );
  }

  function searchResults() {
    return (
      <ul
        className={`${optionState} absolute w-full text-center top-10 z-10 bg-gray-50 border-2 border-gray-400 overflow-y-auto max-h-56`}
      >
        <li
          className="bg-yellow-100 w-full text-sm text-left py-2 px-3 text-yellow-700 border-b-2 border-gray-400 cursor-pointer hover:bg-blue-200"
          onClick={(e) => setSearchText(lastSearchedText)}
        >
          Last Searched:{" "}
          <span className={`text-lg text-blue-400`}>
            {lastSearchedText ? lastSearchedText : "No Results Found"}
          </span>
        </li>
        {searchedPokemons?.map((pokemon: any, index: number) => {
          return (
            <li
              key={index}
              className="bg-blue-100 w-full text-lg py-3 border-b-2 border-gray-400 cursor-pointer hover:bg-blue-200"
              onClick={(e) => {
                const text = (e.target as HTMLLIElement).innerText;
                setSearchText(text);
                setLastSearchedText(text);
              }}
            >
              {pokemon.name}
            </li>
          );
        })}
        {noPokemonFound && (
          <li className="bg-red-100 w-full text-lg py-3 border-b-2 border-gray-400 cursor-pointer text-red-400">
            No Pokemon Found
          </li>
        )}
      </ul>
    );
  }

  return (
    <div className={`bg-gray-200 min-h-screen`}>
      <Head>
        <title>Pokemon Index</title>
        <meta name="description" content="Find info related to any pokemon" />
        <link rel="icon" href="/pokeball.png" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
          integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>

      <main className={`container mx-auto flex flex-col`}>
        {searchBar()}
        <div
          className={
            "grid  lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-8 px-5 py-10"
          }
        >
          {getPokeCards()}
        </div>
      </main>
    </div>
  );
};

export default Home;
