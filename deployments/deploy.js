async function main() {
    const Election = await ethers.getContractFactory("Election");
    const election = await Election.deploy();
    console.log("Contract Deployed to Address:", election.address);
}
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });