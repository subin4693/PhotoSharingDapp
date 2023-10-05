//SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

error Socialmedia__userNameLenghtMustBeGreatherThanZero();
error Socialmedia__imageCdnLengthMustBeGreatherThanZero();
error Socialmedia__userNameIsAlreadyExist();
error Socialmedia__userNameIsNotExist();
error Socialmedia__notAnOwner();
error Socialmedia__notEnoughEthSended();
error Socialmedia__postOwnerCannotTiptheirPosts();
error Socialmedia__userCannotSendPostToTheSameAccount();
error Socialmedia__userDontHaveThePost();
error Socialmedia__ThereIsNoEthBalance();
error Socialmedia__TransactionFailed();
error Socialmedia__NoPostPosted();
error Socialmedia__PostisNotExist();
error Socialmedia__thisPostIsNotExist();

contract Socialmedia{
    
    User[] public s_users;
    Post[] public s_allPosts;
    uint256 public s_highlyTipedImageIndex;
    mapping (bytes20 => uint256) public s_userNameToUserIndex;
 
    uint256 public s_totalUsers;

    struct User {
        uint256 userId;
        bytes20 userName;
        address ownerAddress;
        bytes profileImageUrl;
        uint256 balanceEth;
        uint256[] posts;
        uint256 totalPosts;
    }

    struct Post {
        uint256 postId;
        uint256 postIndex;
        uint256 userId;
        bytes20 userName;
        bytes postImageUrl;
        uint256 tipedAmount;
        bool isActive;
        bytes20[] tipedUsers;
        bytes20[] owners;
    }  
    


    modifier checkIsValidUserName(string memory userName){
        if(bytes(userName).length <=0){
            revert Socialmedia__userNameLenghtMustBeGreatherThanZero();
        }
        _;
    }

    modifier checkIsValidImageCdn(string memory imageUrl) {
        if(bytes(imageUrl).length <= 0){
            revert Socialmedia__imageCdnLengthMustBeGreatherThanZero();
        }
        _;
    }

    modifier checkTheUserNameIsExists(uint256 userIndex){
        if(userIndex == 0 || s_users[userIndex].userId != userIndex){
            revert Socialmedia__userNameIsNotExist();
        }
        _;
    }

    modifier checkIsOwner(uint256 userIndex){
        if(s_users[userIndex].ownerAddress != msg.sender){
            revert Socialmedia__notAnOwner();
        }
        _;
    }

    modifier checkSendrAndReciverBothAreSame(uint256 userId, uint256 postOwnerId){

         if(userId == postOwnerId){
            revert Socialmedia__postOwnerCannotTiptheirPosts();
        }
        _;
    }   

    //Events
    event newUserSignup(uint256 indexed userId, string indexed  userName, string indexed  profileImage);
    event profileImageChanged(uint256 indexed userId,   string indexed newProfileImageUrl);
    event newPostAdded(uint256 indexed userId, string indexed postImageUr, uint256 indexed imageIndex);
    event postTiped(uint256 indexed postOwnerId,uint256 indexed postId, uint256 indexed tipedAmount);
    event PostDeleted(uint256 indexed userId, uint256 indexed  postId);
    event postSended(uint256 indexed userId, uint256 indexed postReciverId);

    event LogIterationIndex(uint256 index);



    constructor() {
        s_totalUsers = 1;
        uint256[] memory tempPostArray;
        User memory tempUser = User(0,bytes20(0), address(0), "", 0, tempPostArray, 0);
       
        s_users.push(tempUser);
        s_allPosts.push(Post(0,0,0,bytes20(0), "", 0,false,new bytes20[](0), new bytes20[](0)));
    }

    //Auth

    function signUp(string memory userName, string memory profileImageUrl) external checkIsValidUserName(userName) {
        if(s_userNameToUserIndex[convertStringToBytes20(userName)] != 0){
            revert Socialmedia__userNameIsAlreadyExist();
        }
        bytes20 userNameInBytes20 = convertStringToBytes20(userName);
         uint256[] memory tempPostArray;
        User memory tempUser = User(s_totalUsers, userNameInBytes20, msg.sender, bytes(profileImageUrl), 0, tempPostArray, 0);
        s_users.push(tempUser);
        s_userNameToUserIndex[userNameInBytes20] = s_totalUsers;
        s_totalUsers++;
        emit newUserSignup(s_totalUsers-1, userName, profileImageUrl);

    }

    function signIn(string memory userName) external view returns(User memory) {
        bytes20 tempUserName = convertStringToBytes20(userName);
        uint256 userIndex = s_userNameToUserIndex[tempUserName];
        if(s_users[userIndex].ownerAddress != msg.sender){
            revert Socialmedia__notAnOwner();
        }
        
        if(s_users[userIndex].userId == 0){
            revert Socialmedia__userNameIsNotExist();
        }
 
        return s_users[userIndex];
    }

    function changeProfileImage(uint256 userId,   string memory newProfileImageUrl) external checkIsOwner(userId) checkTheUserNameIsExists(userId) checkIsValidImageCdn(newProfileImageUrl) {
        s_users[userId].profileImageUrl = bytes(newProfileImageUrl);
        emit profileImageChanged(userId, newProfileImageUrl);
    }

    //Post

    function addNewPost(uint256 userId,  string memory postImageUrl) external checkIsOwner(userId) checkTheUserNameIsExists(userId) checkIsValidImageCdn(postImageUrl) {
        uint256 postId = s_allPosts.length;
        uint256 postIndex = s_users[userId].posts.length;
        Post memory tempPost = Post(postId, postIndex, userId,s_users[userId].userName, bytes(postImageUrl), 0, true, new bytes20[](0),   new bytes20[](1));
        tempPost.owners[0] = s_users[userId].userName;
        s_allPosts.push(tempPost);
        s_users[userId].posts.push(postId);
        s_users[userId].totalPosts += 1;
        emit newPostAdded(userId, postImageUrl, postId);
    }

    function deletePost(uint256 userId, uint256 postId, uint256 postIndex) external checkIsOwner(userId) checkTheUserNameIsExists(userId) {
        if(!s_allPosts[postId].isActive){
            revert Socialmedia__userDontHaveThePost();
        }    
        s_allPosts[postId].isActive = false;
        s_users[userId].posts[postIndex] = 0;
        s_users[userId].totalPosts -= 1;
        emit PostDeleted(userId, postId);
    }

    function tipPost(uint256 userId,uint256 postId, uint256 postOwnerId) external payable checkIsOwner(userId) checkTheUserNameIsExists(userId) checkTheUserNameIsExists(postOwnerId) checkSendrAndReciverBothAreSame(userId, postOwnerId)  {
        if(msg.value <= 0){
            revert Socialmedia__notEnoughEthSended();
        }
        if(!s_allPosts[postId].isActive){
            revert Socialmedia__thisPostIsNotExist();
        }
        s_allPosts[postId].tipedAmount += msg.value;
        s_users[postOwnerId].balanceEth += msg.value;
        s_allPosts[postId].tipedUsers.push(s_users[userId].userName);
        if(s_allPosts[postId].postId != s_allPosts[s_highlyTipedImageIndex].postId && s_allPosts[postId].tipedAmount > s_allPosts[s_highlyTipedImageIndex].tipedAmount){
            s_highlyTipedImageIndex = postId;
        }
        emit postTiped(postOwnerId, postId, msg.value);
    }

    function sendPostToOtherUser(uint256 userId, uint256 postId, uint256 postIndex, string memory postReciverName) external checkIsOwner(userId) checkTheUserNameIsExists(userId)   {
        if(!s_allPosts[postId].isActive){
            revert Socialmedia__userDontHaveThePost();
        }

        uint256 postReciverId = s_userNameToUserIndex[convertStringToBytes20(postReciverName)];
         if(postReciverId == 0 || s_users[postReciverId].userId != postReciverId){
            revert Socialmedia__userNameIsNotExist();
        }  

         if(userId == postReciverId){
            revert Socialmedia__userCannotSendPostToTheSameAccount();
        }
        s_users[postReciverId].posts.push(postId);
        s_users[userId].posts[postIndex] = 0;
        s_allPosts[postId].postIndex = s_users[postReciverId].posts.length-1;
        s_allPosts[postId].userId = postReciverId;
        s_allPosts[postId].userName = s_users[postReciverId].userName;
        s_allPosts[postId].owners.push(s_users[postReciverId].userName);
        s_users[userId].totalPosts -= 1;
        s_users[postReciverId].totalPosts += 1;
        emit postSended(userId, postReciverId);
    }

    function withdraw(uint256 userId) external checkIsOwner(userId) checkTheUserNameIsExists(userId){
        if(s_users[userId].balanceEth <= 0){
            revert Socialmedia__ThereIsNoEthBalance();
        }
        uint256 tempBalanceEth = s_users[userId].balanceEth;
        s_users[userId].balanceEth -= s_users[userId].balanceEth;
        (bool success,) = s_users[userId].ownerAddress.call{value: tempBalanceEth}("");
        if(!success){
            revert Socialmedia__TransactionFailed();
        }
    }


      function singleUser(uint256 requestUserId, string memory userName) external  view  checkIsValidUserName(userName) returns(User memory,Post[] memory, bool) {
        bytes20 userNameInBytes = convertStringToBytes20(userName);
        uint256 userIndex = s_userNameToUserIndex[userNameInBytes]; 
       
        User memory tempUser = s_users[userIndex];
        if(tempUser.totalPosts == 0){
            return (tempUser,new Post[](0), tempUser.ownerAddress== msg.sender && s_users[requestUserId].userId == tempUser.userId);
        }
        Post[] memory tempPostArray = new Post[](10);
        uint256 startIndex = tempUser.posts.length-1;
        uint256 index=0;  
        for(int  i= int(startIndex); i >= 0 && index < 10  ; i--) {
            if(tempUser.posts[uint256(i)] != 0 && s_allPosts[tempUser.posts[uint256(i)]].isActive){
                tempPostArray[index] = s_allPosts[tempUser.posts[uint256(i)]];
                index++;
            }               
        }

         assembly {
        mstore(tempPostArray, index)
    }
        return(s_users[userIndex], tempPostArray, tempUser.ownerAddress== msg.sender && s_users[requestUserId].userId == tempUser.userId);
    }
    
 function getPosts(uint256 userId, uint256 startIndex) external view checkTheUserNameIsExists(userId) returns(Post[] memory){
        User memory tempUser = s_users[userId];
        if(tempUser.posts.length == 0){
            return(new Post[](0));
        }

        Post[] memory tempPostArray = new Post[](10);

        if(startIndex == 0 || startIndex > tempUser.totalPosts-1){
            startIndex = tempUser.totalPosts-1;
        }
        uint256 index = 0;

        for(int i = int(startIndex); i>= 0 && index < 10; i--){
            if(s_allPosts[tempUser.posts[uint256(i)]].isActive){
                tempPostArray[index] = s_allPosts[tempUser.posts[uint256(i)]];
                index++;
            }
        }
        assembly{
            mstore(tempPostArray, index)
        }
        return tempPostArray;
    }

    function getPostByIndex(uint256 userId, uint256 index) external view checkTheUserNameIsExists(userId) returns(Post memory){
        if(s_allPosts[index].isActive){
            return s_allPosts[index];
        }
    }

    function getAllPosts(uint256 postId,bool isFirstCall) external view returns(Post[] memory){
         if(postId > s_allPosts.length){
            revert Socialmedia__PostisNotExist();
        }

        if(postId == 0 && isFirstCall) {
            postId = s_allPosts.length-1;
        } 
       
        Post[] memory tempPost = new Post[](10);
        uint256 index = 0;
        for(uint256 i = postId; i > 0 && index < 10 ; i--){
            if(s_allPosts[i].isActive){
                tempPost[index] = s_allPosts[i];
                index++;
            }
        }
        assembly{
            mstore(tempPost , index)
        }
        return tempPost;
    }

    function getMostTipedImage()external view returns(Post memory) {
        if(s_allPosts[s_highlyTipedImageIndex].postId != 0){
            return s_allPosts[s_highlyTipedImageIndex];
        }
    }

    function checkUserNameIsExist(string memory userName) external view returns(bool){
        uint256 index = s_userNameToUserIndex[convertStringToBytes20(userName)];
        if(index == 0) return false;
        return true;
    }

 

    function convertStringToBytes20(string memory userName) private pure returns (bytes20 result) {
        bytes memory userNameInBytes = bytes(userName);
        assembly {
            result:= mload(add(userNameInBytes, 32))
        }
    }
    

    fallback() external payable{}
    receive() external payable{}

}

