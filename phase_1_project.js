//Generate a random index value using the length of the array of object Ids
function getRandomIndex(artObjectIDs){
    return Math.floor(Math.random() * artObjectIDs.length)
}

//Test if the index of the given array of object Ids returns a valid object with an image URL
function testIfImage(artObjectIDs,randomIndex){
    //console.log(randomIndex)
    const imgDescription = document.getElementById('description')
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${artObjectIDs[randomIndex]}`)
        .then(response => {
            //If object is not valid run function again with different random index
            if(response.ok != true){
                testIfImage(artObjectIDs, getRandomIndex(artObjectIDs))
            }
            else{
                response.json()
                .then(json => {
                    //if object does not have an image URL run function again with different random index
                    if(json.primaryImage === ""){
                        testIfImage(artObjectIDs,getRandomIndex(artObjectIDs))
                    }
                    //display image URL
                    else{
                        const primaryImg = document.getElementById('todays-image')
                        primaryImg.src = json.primaryImage
                        primaryImg.style.height = '500px'

                        const imgDescription = document.getElementById('description')
                        imgDescription.textContent = "Image Description:"
                        const descriptionArray = [`Title: ${json.title}`,`Department: ${json.department}`,`Culture: ${json.culture}`,
                            `Period: ${json.period}`,`Artist: ${json.artistDisplayName}`,`Date: ${json.objectDate}`,`Medium: ${json.medium}`,
                            `Dimensions: ${json.dimensions}`]
                        
                        descriptionArray.forEach(data =>{
                            const liElement = document.createElement('li')
                            liElement.textContent = data
                            imgDescription.appendChild(liElement)
                        })
                        
                        
            
                        const linkElement = document.createElement('a')
                        linkElement.textContent = json.objectWikidata_URL
                        linkElement.href = json.objectWikidata_URL
                        imgDescription.appendChild(linkElement)
                        

                    }
                })
            }
        })
}

function main(){
    
    const imgButton = document.getElementById('generate-img')
    imgButton.addEventListener('click', () => {
        fetch("https://collectionapi.metmuseum.org/public/collection/v1/objects")
        .then(response => response.json())
        .then(json => {
            testIfImage(json.objectIDs,getRandomIndex(json.objectIDs))
        })
    })
}

main()



//Requirements for assessment at 
//* At least 1 variable declared using either the const or let keyword.
//* At least 1 named function declared, and at least 1 anonymous function or arrow function used.
//* At least 1 array and 1 object accessible either within your project code or retrieved from your db.json or external API using the fetch() function.
//* Write the code to search for at least 1 element from the DOM, store it into a variable, and change at least 1 property for the element such as textContent or src.
//* Write the code to add at least 1 event listener to an element, to make the element listen for an event such as click or submit and execute code in response to the event.
//* Write the code to call the fetch() function to make a GET request to a server (either db.json server or external API) to retrieve data from the server.



