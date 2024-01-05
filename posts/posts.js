/* Posts Page JavaScript */

"use strict";


window.onload = function (_event) {
    getPosts()
        .then(populatePostcards)
}

function getPosts() {
    const { token } = getLoginData()
    const options = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    
    return fetch(`http://microbloglite.us-east-2.elasticbeanstalk.com/api/posts`, options)
    .then(response => response.json()) 
    .then(data =>  populatePostcards(data))
    .catch((error) => {
        console.error('Error:', error);
    });
    
}  



function populatePostcards(posts) {
    const postCards = document.getElementById("postDiv")
    let html = ""
    for (const currentPost of posts){
        currentPost.text = currentPost.text.replace("?autoplay=1", "").replace("autoplay;")
        html += `
            <div class="card border-light mb-3" style="max-width: 50rem;">
                <div class="card-title">${currentPost.username}</div>
                <div class="card-body">
                    <h4>${currentPost.text}</h4>
                </div>
                <p class="text">${formatDate(currentPost.createdAt)}</p>
                <p class="text"><strong>Likes:</strong> ${currentPost.likes.length}</p>
                <button onclick="createLike('${currentPost._id}')" id="likeButton" class="btn btn-primary btn-sm">LIKE</button>
                
            </div>
        `
    }

    postCards.innerHTML+= html
}

function createLike(postIdString){
    const json = {
        postId: postIdString
    }
    console.log("Like button clicked for post id#" + postIdString)
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getLoginData().token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    }
    //fetch (website/api/likes, options)
    fetch (`http://microbloglite.us-east-2.elasticbeanstalk.com/api/likes`, options)
    .then (response => response.json())
    .then(data => console.log(data))

}

function formatDate(timestamp) {
    const date = new Date(timestamp)
    const formatOptions = {
        dateStyle: 'long',  // "long", "medium", "short"
        timeStyle: 'short',   // "long", "medium", "short"
    }
    return new Intl.DateTimeFormat(undefined, formatOptions).format(date)
}

// Example usage: formatDate('2024-01-03T21:16:54.441Z')  ➡️  'Jan 3, 2024, 4:16 PM'
// For more information on the format options, check out: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#style_shortcuts


//const resultDiv = document.getElementById("populatePostcards")
//resultDiv.innerHTML += html


