import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Authentication from './../components/Authentication'; //       <Authentication isAuth={isAuth} />
import Main from "../components/main";

import {useRouter} from "next/router";
import { Web3AuthProvider } from "../context/web3auth";
import {useEffect, useState} from "react";

export default function Home(props) {
  const router = useRouter();
  const { isAuth, role } = props;
 

  return (
    <div className={styles.container}>
      <Head>
        <title>Crack the NFT Password, Win Prizes!</title>
        <meta name="description" content="Crack the NFT Password" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>

        <h1 className={styles.title}>Introduction</h1> 
        <div className={styles.description}>Welcome to the NFT Password Challenge! <br/>
          Guess the secret password and win awesome prizes. <br/>
          The twist? You&apos;ll need to create your own NFT to get random words for clues. <br/>
          Get ready for a thrilling game of code-breaking and big rewards!</div>

        <h1 className={styles.title}>Game Overview</h1>
        <div className={styles.description}>
          <b>Create Your NFT:</b> Make your unique NFT to receive random words as clues.<br/>
          <b>Decode the Password</b>: Use the NFT words to solve the password puzzle.<br/>
          <b>Make Your Guess:</b> Submit your password guess for a chance to win the grand prize.<br/>
          <b>Win Exciting Rewards:</b> Score exclusive NFTs, digital collectibles, and more.</div>

        <h1 className={styles.title}>Benefits</h1>
        <div className={styles.description}>
          NFT Ownership: Own a valuable digital asset with your NFT creation.
          Engaging and Thrilling: Enjoy the excitement of cracking codes and NFTs.
          Great Prizes: Win diverse rewards, from digital items to real-world experiences.
          Fair and Transparent: Every player gets a fair shot with their unique NFT clues.
          Conclusion: Join the NFT Password Challenge, crack the code, and win amazing prizes. 
          Get ready for an adventure of mystery and rewards!</div>

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
