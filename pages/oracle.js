
import React, {useEffect, useState,} from "react";
import {Heading, Image, Input, Tag, useToast} from "@chakra-ui/react";
import styles from "../styles/Home.module.css";
import { initialize } from "zokrates-js";
//import leaderboardABI from "../ABI/leaderboard.json";
import leaderboardABI from "../ABI/leaderboard_mock.json";
import artifactAbi from "../public/zk/artifact_abi.json";
import { useWeb3Auth } from "../context/web3auth";
//import fs from "fs";

export default function Oracle(props) {
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [numWords,setNumWords] = useState("200")
    const [password, setPassword] = useState("");
    const [isValid, setIsValid] = useState(false);
    const { createContract, user } = useWeb3Auth();
    const [userAddress, setUserAddress] = useState(user);
    useEffect(() => {
        setUserAddress(user)
    }, [user]);

    const words = [
        "What is the category of this ____?",
        "Can the word be found in a ____?",
        "Is the word related to technology or ____?",
        "Can the word be eaten or ____?",
        "Is the word something you can ____?",
        "Is the word associated with a specific ____?",
        "Can the word be used in a ____?",
        "Does the word represent an emotion or ____?",
        "Is the word a type of ____?",
        "Does the word have a connection to ____?",
        "Can you find the word in a ____?"
    ];
    const colors = ["teal", "blue", "green", "red", "yellow", "purple", "pink", "cyan"];

    //zk claim
    const submitZkClaim = async (pw) => {
        // const zokratesProvider = await initialize();
        // const artifacts = {
        //     //program: ... ,    //TODO
        //     abi: artifactAbi,
        // };
        // const keypair_pk = []; //TODO

        // //witness gen
        // const { witness } = y = zokratesProvider.computeWitness(artifacts, [
        //     "0xe3b0c44298fc1c149afbf4c8996fb924",   //nonce
        //     "0x00000000000000000000000000000000", 
        //     "0x00000000000000000000000000000000", 
        //     "0x0000000000000000000047414d494e47",   //answer    //FIXME
        // ]);

        // //proof gen
        // const proof = p2 = zokratesProvider.generateProof(
        //     artifacts.program,
        //     witness,
        //     keypair_pk
        // );

        //submit TX
        try {
            let leaderboardCont = await createContract(leaderboardABI.abi, leaderboardABI.address, userAddress)
            //setloadingTX(true)
            let tx = await leaderboardCont.methods.verifyWinning(
                // proof.proof.a[0],
                // proof.proof.a[1],
                // proof.proof.b[0],
                // proof.proof.b[1],
                // proof.proof.c[0],
                // proof.proof.c[1],
            ).send({ from: userAddress });
            console.log(tx)
            // alert(`https://goerli.etherscan.io/tx/${tx.transactionHash}`);
            toast({
                title: 'Transaction Process',
                description: `https://goerli.etherscan.io/tx/${tx.transactionHash}`,
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            //setTxHash(`https://goerli.etherscan.io/tx/${tx.transactionHash}`);
            // Open the modal
            //setIsOpen(true);
        } catch (err) {

        } finally {
            //setloadingTX(false)
        }
    }

    useEffect (() => {
        const inArray = words.some(sentence => {
            // replace the blank with a regular expression that matches any word
            const sentenceRegex = new RegExp(sentence.replace('____', '\\w+\\?') + '$');
            return sentenceRegex.test(input);
        });
        console.log(inArray);
        setIsValid(inArray);
    })
    const [buttonClicked, setButtonClicked] = useState(Array(words.length).fill(false));
const toast =             useToast()
    useEffect(() => {
        if (password === "gaming") {
            //claim tx
            submitZkClaim(password).then();
            toast({
                title: 'Password correct!',
                description: "Good job! You are the first on the leaderboard, out of 400!",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
    }, [password]);
    const handleButtonClick = (newWord, index) => {
        setInput((prevValue) => prevValue + ' ' + newWord);
        let newButtonClicked = buttonClicked;
        newButtonClicked[index] = true;
        setButtonClicked(newButtonClicked);
        console.log(buttonClicked);
    }

    const generateResponse = async (e,currentIntensity) => {
        e.preventDefault();
        setOutput("");
        setLoading(true);

        const prompt = `${input}`;
        //alert(prompt);
        const response = await fetch("/api/routes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt,
            }),
        });

        if (!response.ok) {
            console.log(response)
            throw new Error(response.statusText);
        }

        // This data is a ReadableStream
        const data = response.body;
        if (!data) {
            return;
        }

        const reader = data.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            setOutput((prev) => prev + chunkValue);
        }
        setLoading(false);
    };


    const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
    return (
        <div className={'bg-black'}>
        <div className={styles.container}>

        <div className={styles.main}>
            <Image src={"https://media1.giphy.com/media/3oEdv3kUUH2ejpnm2Q/200w.gif?cid=82a1493biuuaard46usphetzlc2cp9q14k9fyxqz2a7ssccn&ep=v1_gifs_search&rid=200w.gif&ct=g"}></Image>
            <Heading>I am the oracle. I have been instructed not to reveal the password to you.</Heading>
        <div className="max-w-7xl w-10/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid gap-y-12 md:grid-cols-1 md:gap-x-12 ">
                <div className="">
                    <form>
                        <div className="flex flex-col">
                            <label htmlFor="keywords" className="sr-only">
                                Context
                            </label>
                            <Input
                                isInvalid
                                errorBorderColor={"white"}
                                color={isValid? "teal":"crimson"}
                                rows={3}
                                value={input}
                                onChange={(e) => {setInput(e.target.value);}}
                                name="keyWords"
                                id="keyWords"
                                placeholder="Ask Away!"
                                className="block w-full rounded-md border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 placeholder-gray-500 my-2 text-white"

                            />
                        </div>
                    </form>
                    {words.map((word, index) => (
                        !buttonClicked[index] &&( <Tag key={index} onClick={() => handleButtonClick(word,index)} colorScheme={getRandomColor()} size={"lg"} m={2}>
                            {word}
                        </Tag>)
                    ))}
                </div>
                {!loading ? (
                    <button
                        className="w-full rounded-xl bg-neutral-900 px-4 py-4 font-medium text-white hover:bg-black/80"
                        onClick={(e) => generateResponse(e,"")}
                    >
                        Generate Question &rarr;
                    </button>
                ) : (
                    <button
                        disabled
                        className="w-full rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white"
                    >
                        <div className="animate-pulse font-bold tracking-widest">...</div>
                    </button>
                )}

                {output && (
                    <div className="flex flex-col rounded-xl border bg-yellow-600 p-4 shadow-md transition hover:bg-yellow-500">
                        {output}

                    </div>
                )}
                <Input
                    type="text"
                    isInvalid
                    errorBorderColor='teal'
                    placeholder="Enter the password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
        </div>
        </div>
        </div>
        </div>
    );
}