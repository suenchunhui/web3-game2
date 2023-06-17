const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")
const LINK_TOKEN_ABI = require("@chainlink/contracts/abi/v0.4/LinkToken.json")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("API Consumer Staging Tests", async function () {
          //set log level to ignore non errors
          ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR)

          let wordsNFT

          before(async function () {
              const [deployer] = await ethers.getSigners()

              const chainId = network.config.chainId
              const apiConsumerFactory = await ethers.getContractFactory("wordsNFT")
              wordsNFT = await apiConsumerFactory
                  .connect(deployer)
                  .deploy()
               await wordsNFT.deployed()
          })

          it("Our event should successfully fire on callback", async function () {
            const [deployer] = await ethers.getSigners()

            await wordsNFT.connect(deployer).superMintTo(deployer.address,1 ,20)
            let tokenURL = await wordsNFT.tokenURL(1);
            console.log(tokenURL)


             let tokenURL2 = await wordsNFT.buildImage("TEST")
            console.log(tokenURL2)

          })
      })
