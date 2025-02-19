const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contract with:", deployer.address);

    // Load the deployed contract
    const liquidityContract = await ethers.getContractAt(
        "LiquidityExamples",
        "YOUR_DEPLOYED_CONTRACT_ADDRESS"
    );

    // Amounts to supply for liquidity
    const amount0 = ethers.utils.parseUnits("100", 18); // 100 DAI (18 decimals)
    const amount1 = ethers.utils.parseUnits("100", 6);  // 100 USDC (6 decimals)

    console.log("Approving tokens for liquidity...");

    // Approve tokens (this must be done before adding liquidity)
    const DAI = await ethers.getContractAt("IERC20", "0x6B175474E89094C44Da98b954EedeAC495271d0F");
    const USDC = await ethers.getContractAt("IERC20", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");

    await (await DAI.connect(deployer).approve(liquidityContract.address, amount0)).wait();
    await (await USDC.connect(deployer).approve(liquidityContract.address, amount1)).wait();

    console.log("Adding liquidity...");
    
    // Call the function to mint a new liquidity position
    const tx = await liquidityContract.mintNewPosition();
    const receipt = await tx.wait();
    
    console.log("Liquidity added successfully!");
    console.log("Transaction Hash:", receipt.transactionHash);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
