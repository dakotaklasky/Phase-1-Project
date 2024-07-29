const displayArray = []

//Generate a random index value using the length of the array of object Ids
function getRandomIndex(artObjectIDs){
    return Math.floor(Math.random() * artObjectIDs.length)
}

//Test if the index of the given array of object Ids returns a valid object with an image URL
function testIfImage(artObjectIDs,randomIndex){
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
                        displayArray.push(artObjectIDs[randomIndex])
                        const primaryImg = document.getElementById('todays-image')
                        const imgLink = document.getElementById('img-link')
                        primaryImg.src = json.primaryImage
                        primaryImg.style.height = '500px'
                        imgLink.href = json.objectURL

                        const imgDescription = document.getElementById('description')
                        imgDescription.textContent = "Image Description:"
                        const descriptionArray = [`Title: ${json.title}`,`Department: ${json.department}`,
                            `Culture: ${json.culture}`, `Country: ${json.country}`,`Period: ${json.period}`,
                            `Artist: ${json.artistDisplayName}`,`Date: ${json.objectDate}`,
                            `Medium: ${json.medium}`,`Dimensions: ${json.dimensions}`]
                        
                        descriptionArray.forEach(data =>{
                            const liElement = document.createElement('li')
                            liElement.textContent = data
                            imgDescription.appendChild(liElement)
                        


                        })
                    }
                })
            }
        })
}

function fetchData(resource){
    fetch(resource)
    .then(response => response.json())
    .then(json => {
        testIfImage(json.objectIDs,getRandomIndex(json.objectIDs))
    })
}

function main(){

    const inputForm = document.getElementById('description-input')
    inputForm.addEventListener('submit', (event) =>{
        event.preventDefault()
        const dropdownElement = document.getElementById('departments')
        if(dropdownElement.value === "0"){
            fetchData("https://collectionapi.metmuseum.org/public/collection/v1/objects")
        }
        else{
            fetchData(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${dropdownElement.value}&q=cat`)
        }
    })

    const primaryImg = document.getElementById('todays-image')
    primaryImg.addEventListener("mouseover",()=>{
        primaryImg.style.border = "5px solid blue"
    })

    primaryImg.addEventListener("mouseout",()=>{
        primaryImg.style.border = "none"
    })

    const previousButton = document.getElementById('previous')
    
        previousButton.addEventListener("click",() =>{
            if(displayArray.length >= 2){
                testIfImage(displayArray,displayArray.length-2)
            }
            else{
                alert("There is no previous image!")
            }
        })
    




}

main()




// const departments = ["American Decorative Arts","Ancient Near Eastern Art","Arms and Armor", 
// "Arts of Africa, Oceania, and the Americas","Asian Art","The Cloisters",
// "The Costume Institute","Drawings and Prints","Egyptian Art","European Paintings",
// "European Sculpture and Decorative Arts","Greek and Roman Art","Islamic Art",
// "The Robert Lehman Collection","The Libraries","Medieval Art","Musical Instruments",
// "Photographs","Modern Art"]




//To Do
//submit form event listeners
//Drop down event listeners (change)
//remove empty description elements or input unknown
//formatting

//create dropdown
//when element is changed in dropdown then the object id link is selected from there
//when it is loading add an element to say so

//go back to previous button
//mouseover
