import { GetServerSideProps, NextPage } from "next";
import { useState } from "react";
import styles from "./index.module.css";
import transleteData from "../assets/pokemon_name_ja.json" assert { type: "json" };
import { type } from "os";
import { assert } from "console";
// getServerSidePropsから渡されるpropsの型
type Props = {
  initialPokemonId: number;
  initialPokemonName: string;
  initialPokemonImageUrl: string;
};

// ページコンポーネント関数にpropsを受け取る引数を追加する
const IndexPage: NextPage<Props> = ({
  initialPokemonId,
  initialPokemonName,
  initialPokemonImageUrl,
}) => {
  const [pokemonId, setPokemonId] = useState(initialPokemonId); // 初期値を渡す
  const [pokemonName, setPokemonName] = useState(initialPokemonName); // 初期値を渡す
  const [imageUrl, setImageUrl] = useState(initialPokemonImageUrl); // 初期値を渡す
  const [loading, setLoading] = useState(false); // 初期状態はfalseにしておく

  // ボタンをクリックしたときに画像を読み込む処理
  const handleClick = async () => {
    setLoading(true); // 読込中フラグを立てる
    const newPokemon = await fetchPokemon();
    setPokemonId(newPokemon.id); // ポケモンIDの状態を更新する
    setPokemonName(newPokemon.forms[0].name); // ポケモン名の状態を更新する
    setImageUrl(newPokemon.sprites.front_default); // 画像URLの状態を更新する
    setLoading(false); // 読込中フラグを倒す
  };

  return (
    <div className={styles.page}>
      <button onClick={handleClick} className={styles.button}>
        他のポケモンも見る
      </button>
      <div className={styles.frame}>
        {loading || <img src={imageUrl} className={styles.img} />}
      </div>
      <div className={styles.text}>
        <span>{loading || pokemonId}</span>
        <span>{loading || transletePokemonName(pokemonId)}</span>
      </div>
    </div>
  );
};
export default IndexPage;

// サーバーサイドで実行する処理
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const pokemon = await fetchPokemon();
  return {
    props: {
      initialPokemonId: pokemon.id,
      initialPokemonName: pokemon.forms[0].name,
      initialPokemonImageUrl: pokemon.sprites.front_default,
    },
  };
};

type Forms = {
  name: string;
  url: string;
};

type Sprites = {
  front_default: string;
  front_shiny: string;
};

type Pokemon = {
  forms: Forms;
  id: number;
  sprites: Sprites;
};

const fetchPokemon = async (): Promise<Pokemon> => {
  const rand = getRandam(1, 721);
  const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + String(rand));
  const pokemon = await res.json();
  return pokemon;
};

const transletePokemonName = (pokemonId: number) => {
  return transleteData[pokemonId - 1].ja;
};

const getRandam = (n: number, m: number): number => {
  const num = Math.floor(Math.random() * (m + 1 - n)) + n;
  return num;
};
