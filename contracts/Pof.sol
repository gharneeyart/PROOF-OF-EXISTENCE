// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract ProofOfExistence {
    event Notarized(bytes32 docHash, address submitter, uint256 timestamp);
    event Revoked(bytes32 docHash,address submitter);

    error AlreadyNotarized(bytes32 docHash, address originalSubmitter, uint256 timestamp);
    error NotTheOriginalSubmitter();

    struct Document { 
        bytes32 docHash; 
        address submitter; 
        uint256 timestamp; 
        uint256 blockNumber; 
        string description; 
        bool revoked; 
    }

    mapping(bytes32 => Document) private registry;
    mapping(address => bytes32[]) private submitterDocuments;

    bytes32[] private allDocHashes; 
    uint256 public documentCount;

    function notarize(bytes32 _docHash, string calldata _description) external {
        require(registry[_docHash].timestamp == 0, AlreadyNotarized(_docHash, registry[_docHash].submitter, registry[_docHash].timestamp));
        Document memory document = Document(_docHash, msg.sender, block.timestamp, block.number, _description, false);
        registry[_docHash] = document;
        allDocHashes.push(_docHash);
        submitterDocuments[msg.sender].push(_docHash);
        documentCount++;

        emit Notarized(_docHash, msg.sender, block.timestamp);
    }

    function notarizeString(string calldata _rawContent) external pure returns(bytes32 hash){
        return hash = keccak256(abi.encodePacked(_rawContent));
    }

    function verify(bytes32 _docHash) external view returns(Document memory){
        return registry[_docHash];
    }

    function isNotarized(bytes32 _docHash) external view returns(bool){
    return registry[_docHash].timestamp != 0 && !registry[_docHash].revoked;
    }

    function revoke(bytes32 _docHash) external {
        require(registry[_docHash].submitter == msg.sender, NotTheOriginalSubmitter());
        registry[_docHash].revoked = true;

        emit Revoked(_docHash, msg.sender);
    }

    function getDocsBySubmitter(address _submitter) external view returns(bytes32[] memory){
        return submitterDocuments[_submitter];
    }


}



