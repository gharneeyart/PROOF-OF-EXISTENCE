import {time,loadFixture} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("ProofOfExistence", function () {
    async function deployPof() {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const Pof = await hre.ethers.getContractFactory("ProofOfExistence");
        const pof = await Pof.deploy();

    return { pof, owner, otherAccount };
    }

    describe("Deployment", function (){
        it("Should notarize a document", async function(){
            const {pof, owner} = await loadFixture(deployPof);
            const description: string = "All about my life"
            const testBytes32 = "0x9f374a0486717015789ae7ac55d88d0de757ba561becffa30fe8cf4b5f626bf3";
            await pof.notarize(testBytes32, description);
        })
        it("Should notarize string", async function(){
            const {pof, owner} = await loadFixture(deployPof);
            const raw: string = "I'm Ganiyat, a software engineer living in Lagos"
            const hash = await pof.notarizeString(raw);
            
            expect(hash).to.equal(hre.ethers.keccak256(hre.ethers.toUtf8Bytes(raw)));
        })
        it("Should verify document hash", async function(){
            const {pof} = await loadFixture(deployPof);
            const testBytes32 = "0x9f374a0486717015789ae7ac55d88d0de757ba561becffa30fe8cf4b5f626bf3";
            await pof.verify(testBytes32);
        })
        it("Should return true when notarized", async function() {
            const { pof } = await loadFixture(deployPof);
            const testBytes32 = "0x9f374a0486717015789ae7ac55d88d0de757ba561becffa30fe8cf4b5f626bf3";
            await pof.notarize(testBytes32, "All about my life");

            expect(await pof.isNotarized(testBytes32)).to.equal(true);
        });

        it("Should return false for unknown hash", async function() {
            const { pof } = await loadFixture(deployPof);
            const unknownHash = "0x1234560000000000000000000000000000000000000000000000000000000000";

            expect(await pof.isNotarized(unknownHash)).to.equal(false);
            // (only works after fixing isNotarized to return bool instead of require)
        });

        it("Should revoke doc hash", async function() {
            const { pof, owner, otherAccount } = await loadFixture(deployPof);
            const testBytes32 = "0x9f374a0486717015789ae7ac55d88d0de757ba561becffa30fe8cf4b5f626bf3";

            await pof.notarize(testBytes32, "All about my life");

            await expect(pof.notarize(testBytes32, "duplicate")).to.be.revertedWithCustomError(pof, "AlreadyNotarized");

            await expect(pof.revoke(testBytes32)).to.not.be.reverted;

            await expect(
                pof.connect(otherAccount).revoke(testBytes32)
            ).to.be.revertedWithCustomError(pof, "NotTheOriginalSubmitter");
        });

       it("Should get docs by submitter", async function(){
            const { pof, owner } = await loadFixture(deployPof);
            const testBytes32 = "0x9f374a0486717015789ae7ac55d88d0de757ba561becffa30fe8cf4b5f626bf3";

            await pof.notarize(testBytes32, "All about my life");

            const docs = await pof.getDocsBySubmitter(owner.address);
            expect(docs.length).to.equal(1);
            expect(docs[0]).to.equal(testBytes32);
        });
    })
})