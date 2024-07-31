const displayArray = [] //keep track of what object ids have been displayed

//Generate a random index value using the length of the array of object Ids
function getRandomIndex(artObjectIDs){
    return Math.floor(Math.random() * artObjectIDs.length)
}

//Test if the index of the given array of object ids returns a valid object with an image URL
function testIfImage(artObjectIDs,randomIndex){
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${artObjectIDs[randomIndex]}`)
    .then(response => {
        //If object is not valid run function again with different random index
        if(response.ok != true){
            testIfImage(artObjectIDs, getRandomIndex(artObjectIDs))
        }
        else{
            response.json()
            .then(json => {
                //clear image description contents
                const imgDescription = document.getElementById('description')
                imgDescription.textContent = ""

                //if object does not have an image URL run function again with different random index
                if(json.primaryImage === ""){
                    testIfImage(artObjectIDs,getRandomIndex(artObjectIDs))
                }
                else{
                    //display image
                    if (displayArray.includes(artObjectIDs[randomIndex]) === false){
                        displayArray.push(artObjectIDs[randomIndex])
                    }
                    const primaryImg = document.getElementById('todays-image')
                    const imgLink = document.getElementById('img-link')
                    primaryImg.src = json.primaryImage
                    imgLink.href = json.objectURL

                    //display image description
                    const imgDescription = document.getElementById('description')
                    const descriptionArray = [['Title',json.title], ['Date',json.objectDate],['Artist',json.artistDisplayName],
                    ['Department',json.department],['Culture',json.culture],['Country',json.country],['Period',json.period],
                    ,['Medium',json.medium],['Dimensions',json.dimensions]]
                    
                    //Test if description fields are blank, otherwise display them
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
                    
                }
            })
            .catch((error) =>{
                alert('Something went wrong.',error)
            })
        }
    })
}

//fetch and display data for any given resource URL
function fetchData(resource){
    fetch(resource)
    .then(response => response.json())
    .then(json => {
        if(json.total === 0){
            alert('No images match the search result!')
        }
        else{
            testIfImage(json.objectIDs,getRandomIndex(json.objectIDs))            
        }
    })
}

function main(){
    //display random image on page open
    fetchData("https://collectionapi.metmuseum.org/public/collection/v1/objects")

    //Change URL used to fetch data depending on dropdown input or search value
    const inputForm = document.getElementById('description-input')
    inputForm.addEventListener('submit', (event) =>{
        event.preventDefault()
        const dropdownElement = document.getElementById('departments')
        const searchElement = document.getElementById('subject-query')
        const searchValue = searchElement.value.replace(/ /g, '%20')

        if(dropdownElement.value === "0" && searchValue === ""){
            fetchData("https://collectionapi.metmuseum.org/public/collection/v1/objects")
        }
        else if(dropdownElement.value != "0" && searchValue === ""){
            fetchData(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${dropdownElement.value}`)
        }
        else if(dropdownElement.value != "0" && searchValue != ""){
            fetchData(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${dropdownElement.value}&q=${searchValue}`)
        }
        else if(dropdownElement.value == "0"  && searchValue != ""){
            fetchData(`https://collectionapi.metmuseum.org/public/collection/v1/search?&q=${searchValue}`)
        }
    })

    //Change border color when image moused over
    const primaryImg = document.getElementById('todays-image')
    primaryImg.addEventListener("mouseover",()=>{
        primaryImg.style.border = "3px solid blue"
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