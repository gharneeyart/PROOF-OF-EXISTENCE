# Proof of Existence

A smart contract that lets you prove a document existed at a specific point in time, without revealing what's in it.

---

## What is this?

Ever needed to prove you wrote something before someone else claimed they did? Or that a contract, idea, or record existed on a specific date? That's exactly what this does.

You take your document, hash it, and store that hash on the Ethereum blockchain. The blockchain's timestamp becomes your proof. Nobody can fake it, backdate it, or tamper with it. And since you're only storing the hash, not the document itself — your content stays private.

---
## Deployed Address

ProofOfExistence - 0xBE76F8F0CbF763f5B8cda81D66bB46177966a483

---

## How it works

1. You have a document (a PDF, a string, anything)
2. You hash it with `keccak256`
3. You call `notarize()` with that hash
4. The contract stores who submitted it, when, and at which block
5. Anyone can call `verify()` to check it — forever

That's it. No servers. No middlemen. No "trust us."

---

## Contract Features

### Notarize a document
```solidity
function notarize(bytes32 _docHash, string calldata _description) external
```
Registers a document hash on-chain. Reverts if the hash has already been notarized. Stores the submitter's address, timestamp, block number, and a short description.

---

### Hash a raw string
```solidity
function notarizeString(string calldata _rawContent) external pure returns (bytes32 hash)
```
Helper function. Pass in a raw string and get back its `keccak256` hash. Useful for computing the hash client-side before calling `notarize()`.

---

### Verify a document
```solidity
function verify(bytes32 _docHash) external view returns (Document memory)
```
Returns the full record for a document hash — submitter, timestamp, block number, description, and whether it's been revoked.

---

### Check if something is notarized
```solidity
function isNotarized(bytes32 _docHash) external view returns (bool)
```
Quick check. Returns `true` if the document exists and hasn't been revoked.

---

### Revoke a document
```solidity
function revoke(bytes32 _docHash) external
```
Only the original submitter can revoke their document. Useful if a document was submitted by mistake or is no longer valid. Revoked documents still exist in the registry — they're just flagged.

---

### Get all docs by a submitter
```solidity
function getDocsBySubmitter(address _submitter) external view returns (bytes32[] memory)
```
Returns every document hash ever submitted by a specific address.

---

## Events

| Event | When it fires |
|---|---|
| `Notarized(bytes32 docHash, address submitter, uint256 timestamp)` | A new document is registered |
| `Revoked(bytes32 docHash, address submitter)` | A document is revoked |

---

## Custom Errors

| Error | When it triggers |
|---|---|
| `AlreadyNotarized(bytes32, address, uint256)` | You try to notarize a hash that's already in the registry |
| `NotTheOriginalSubmitter()` | You try to revoke a document you didn't submit |

---

## The Document Struct

Every registered document is stored as:

```solidity
struct Document {
    bytes32 docHash;      // the hash of your document
    address submitter;    // who registered it
    uint256 timestamp;    // when (unix time)
    uint256 blockNumber;  // which block
    string description;   // a short label
    bool revoked;         // has it been revoked?
}
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Hardhat

### Install

```bash
npm install
```

### Compile

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

### Deploy to a local node

```bash
npx hardhat node
npx hardhat run scripts/deploy.ts --network localhost
```

---

## Running the Tests

The test suite covers:

- Notarizing a document hash
- Hashing a raw string and comparing the result
- Verifying a stored document
- Checking `isNotarized` returns correctly
- Revoking — by the owner and by a non-owner (should fail)
- Fetching all documents by a submitter

```bash
npx hardhat test
```

---

## Project Structure

```
contracts/
  Pof.sol     # the main contract

test/
  Pof.ts      # all tests

scripts/
  deploy.ts                # deployment script

hardhat.config.ts          # hardhat configuration
```

---

## Tech Stack

- Solidity `^0.8.30`
- Hardhat
- TypeScript
- Chai + Hardhat Chai Matchers
- ethers.js v6

---

## License

MIT