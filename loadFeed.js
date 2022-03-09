// this script loads atom/rss feed to the "block-content" div

//creates an empty textbox which inherits the values of clean-blog-post
function makeBlogPost() {
    var postElem = document.createElement("div")
    var CSSattr = document.createAttribute("class")
    CSSattr.value = "clean-blog-post"
    postElem.setAttributeNode(CSSattr)
    return postElem;
}

//fetches the posts from the rss feed
function fetchPosts() {
    var request = new XMLHttpRequest();
    const getUrl = window.location;
    const baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    const ATOM_FEED_URL = baseUrl + "/feed.xml";
    const ERROR_MSG = "Uh Oh: Cannot load posts at the moment :("
    request.open("GET", ATOM_FEED_URL, true);

    request.send();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            loadPosts(this.responseXML);
        } else if (this.readyState == 4) {
            let textbox = makeBlogPost();
            textbox.innerHTML = ERROR_MSG;
            document.querySelector("#page > main > section > div > div.block-content").appendChild(textbox)
        }
    };
}


function loadPosts(feedXml) {
    const listPosts = feedXml.getElementsByTagName("feed")[0].getElementsByTagName("entry");

    for (let i=0; i<listPosts.length; i++) {
        let post = listPosts.item(i); //gets the post from the list

        //extracts the information needed from the post
        const link = post.getElementsByTagName("link")[0].attributes.getNamedItem("href").value;
        const excerpt = post.getElementsByTagName("summary")[0].textContent;
        const title = post.getElementsByTagName("title")[0].textContent;
        let published = post.getElementsByTagName("published")[0].textContent;
        published = published.substring(0, 10).replaceAll("-","/") //cleans to YYYY-MM-DD

        let postElem = makeBlogPost(); //creates an empty textbox from the function above

        //this code just creates the html for our textbox using the variables defined above, and then pushes it the inner HTML of the post element
        postElem.innerHTML = `
    <h3>${title}</h3>
    <div class=\"info\">
        <span style="color: var(--muted-text-color)">${published}</span>
    </div>
    <p>${excerpt}</p>
    <a class="btn btn-outline-primary btn-sm" role="button" href="${link}" style="border-color: var(--highlight-color); color: var(--highlight-color);">
        Read More
    </a>
    `

        //finally, here we push the final post element into the block-content div
        document.querySelector("#page > main > section > div > div.block-content").appendChild(postElem)
    }
}
fetchPosts()
