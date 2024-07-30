const displayArray = [] //keep track of what object ids have been displayed

//Generate a random index value using the length of the array of object Ids
function getRandomIndex(artObjectIDs){
    return Math.floor(Math.random() * artObjectIDs.length)
}

//Test if the index of the given array of object ids returns a valid object with an image URL
function testIfImage(artObjectIDs,randomIndex){
    const imgDescription = document.getElementById('description')
    imgDescription.textContent = ""
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
                else{
                    //display image
                    if (displayArray.includes(artObjectIDs[randomIndex]) === false){
                        displayArray.push(artObjectIDs[randomIndex])
                    }
                    //console.log(displayArray)
                    const primaryImg = document.getElementById('todays-image')
                    const imgLink = document.getElementById('img-link')
                    primaryImg.src = json.primaryImage
                    imgLink.href = json.objectURL

                    //display image description
                    const imgDescription = document.getElementById('description')
                    const descriptionArray = [['Title',json.title], ['Artist',json.artistDisplayName],
                    ['Department',json.department],['Culture',json.culture],['Country',json.country],['Period',json.period],
                    ,['Medium',json.medium],['Dimensions',json.dimensions]]

                    descriptionArray.forEach(data =>{
                        if(data[1] != ""){
                        const liElement = document.createElement('li')
                        liElement.id = data[0]
                        if(['Title','Artist','Date'].includes(data[0])){
                            liElement.textContent = data[1]
                        }
                        else{
                            liElement.textContent = `${data[0]}: ${data[1]}`
                        }
                        imgDescription.appendChild(liElement)
                        }
                    })

                    const titleElement = document.getElementById('Title')
                        if(json.objectDate != ""){
                            titleElement.append(`, ${json.objectDate}`)
                        }
                    
                }
            })
        }
    })
}


//fetch and display data for any given resource URL
function fetchData(resource){
    fetch(resource)
    .then(response => response.json())
    .then(json => {
        testIfImage(json.objectIDs,getRandomIndex(json.objectIDs))
    })
}

function main(){
    //display image on page open
    fetchData("https://collectionapi.metmuseum.org/public/collection/v1/objects")

    //Change URL used to fetch data depending on dropdown input
    const inputForm = document.getElementById('description-input')
    inputForm.addEventListener('submit', (event) =>{
        event.preventDefault()
        const dropdownElement = document.getElementById('departments')
        const searchElement = document.getElementById('subject-query')

        if(dropdownElement.value === "0" && searchElement.value === ""){
            fetchData("https://collectionapi.metmuseum.org/public/collection/v1/objects")
        }
        else if(dropdownElement.value != "0" && searchElement.value === ""){
            fetchData(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${dropdownElement.value}`)
        }
        else if(dropdownElement.value != "0" && searchElement.value != ""){
            fetchData(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${dropdownElement.value}&q=${searchElement.value}`)
        }
        else if(dropdownElement.value == "0"  && searchElement.value != ""){
            fetchData(`https://collectionapi.metmuseum.org/public/collection/v1/search?=${searchElement.value}`)
        }
    })

   


    //Change border color when image moused over
    const primaryImg = document.getElementById('todays-image')
    primaryImg.addEventListener("mouseover",()=>{
        primaryImg.style.border = "2px solid blue"
    })

    //Remove border when mouse moves
    primaryImg.addEventListener("mouseout",()=>{
        primaryImg.style.border = "none"
    })

    //display previous image if it exists
    const previousButton = document.getElementById('previous')
        previousButton.addEventListener("click",() =>{
            if(displayArray.length >= 2){
                displayArray.pop()
                testIfImage(displayArray,displayArray.length-1)
            }
            else{
                alert("There is no previous image!")
            }
        })

}

main()


