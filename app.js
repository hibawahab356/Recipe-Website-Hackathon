const supabaseUrl = "https://kiulnjjmsqqcpvjcqrau.supabase.co";
const supabaseKey = "sb_publishable_NXAFoZcWnwwSVoH7syBfDw_zcduVLPc";

const { createClient } = supabase;

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);



// signp start

let signupBtn = document.querySelector("#signup")


signupBtn && signupBtn.addEventListener("click",(event)=>{
    event.preventDefault()
    window.location.href = "./signup.html"

})


let formdetails = document.querySelector("#alldata")


formdetails && formdetails.addEventListener("submit",async(event)=>{
    event.preventDefault()
try{

    const alldata = new FormData(formdetails)
     let emptyField = false 
        
        let inputs = document.querySelectorAll("input")
        
        
        inputs.forEach((input)=>{
            if(input.value === ""){
                input.style.border = "2px solid red"
                emptyField = true
            }
        })
    const data = Object.fromEntries(alldata)

    const {email,password,fullname} = data
    console.log(email,password,fullname);

// sign up authentication start
    const { data:signupdata, error } = await client.auth.signUp({
        email,
        password,
      })


console.log(signupdata);
console.log(error);

      // signup code from supabse end

      const id = signupdata?.user?.id
      console.log(id);


      const { error:insertionerror } = await client
  .from('recipe_data')
  .insert({ fullname,
    user_id : id })


    console.log(insertionerror);


    if(signupdata){
        console.log(signupdata,fullname);
    }
    else{
        console.log(error.message);
    }

    

}


catch(error){
    console.log(error);
}
   
})




// for blue inputs fields

let inputs = document.querySelectorAll("input")


inputs.forEach((input)=>{
    input.addEventListener("input",()=>{
        if(input.value !== ""){
            input.style.border = ""
            
        }
    })
    
})







// login page start
 


let loginEmail = document.querySelector("#loginEmail")
let loginPassword = document.querySelector("#loginPass")
let loginBtn = document.querySelector("#loginButton")

let loginFirst = document.querySelector("#login")


loginFirst && loginFirst.addEventListener("click",(event)=>{
    event.preventDefault()
    
    window.location.href = "./login.html"
})


loginBtn && loginBtn.addEventListener("click",async(event)=>{
event.preventDefault() 


try{
    const { data:signindata, error:signinerror } = await client.auth.signInWithPassword({
  email: loginEmail.value,
  password: loginPassword.value,
})

console.log(signindata);
console.log(signinerror);

window.location.href = "./dashboard.html"
}


catch(error){
console.log(error);

}

})



if (document.querySelector("#totalRecipes")) {

    const checkUser = async () => {

        const { data, error } = await client.auth.getUser()

        console.log(data)
        console.log(error)

        if (!data.user) {
            window.location.href = "./login.html"
            return
        }

        console.log(data.user)
    }

    checkUser()
}




if (document.querySelector("#totalRecipes")) {

    const totalRecipes = async () => {

        const { data, error } = await client
            .from("recipes")
            .select("id")

        console.log(data)
        console.log(error)

        if (error) {
            console.log(error)
            return
        }

        document.querySelector("#totalRecipes").innerText = data.length
    }

    totalRecipes()
}



if (document.querySelector("#myRecipes")) {

    const myRecipes = async () => {

        const { data: userData, error: userError } = await client.auth.getUser()

        console.log(userData)
        console.log(userError)

        if (userError) {
            console.log(userError)
            return
        }

        const user = userData.user

        const { data, error } = await client
            .from("recipes")
            .select("id")
            .eq("user_id", user.id)

        console.log(data)
        console.log(error)

        if (error) {
            console.log(error)
            return
        }

        document.querySelector("#myRecipes").innerText = data.length
    }

    myRecipes()
}



// logout 
let logoutBtn = document.querySelector("#logoutBtn")

logoutBtn && logoutBtn.addEventListener("click", async () => {

    const { error } = await client.auth.signOut()

    console.log(error)

    if (!error) {
        window.location.href = "./login.html"
    }
})



// recent recipes 
if (document.querySelector("#recipeContainer")) {

    const recentRecipes = async () => {

          const { data, error } = await client
            .from("recipes")
            .select("id, title, description, category, cooking_time")

        console.log(data)
        console.log(error)

        if (error) {
            console.log(error)
            return
        }

        let container = document.querySelector("#recipeContainer")

        data.forEach((recipe) => {

            container.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4">

                    <div class="card h-100">

                        <div class="card-body">

                            <h5>${recipe.title}</h5>

                            <p>${recipe.description}</p>

                            <p>Category: ${recipe.category}</p>

                            <p>Cooking Time: ${recipe.cooking_time}</p>

                        </div>

                    </div>

                </div>
            `
        })
    }

    recentRecipes()
}






// recipe page satart


if (document.querySelector("#recipeForm")) {

    let recipeForm = document.querySelector("#recipeForm")

    let title = document.querySelector("#title")
    let description = document.querySelector("#description")
    let category = document.querySelector("#category")
    let ingredients = document.querySelector("#ingredients")
    let instructions = document.querySelector("#instructions")
    let cookingTime = document.querySelector("#cookingTime")
    let recipeImage = document.querySelector("#recipeImage")


    recipeForm.addEventListener("submit", async (event) => {

        event.preventDefault()

        try {

            const { data: userData, error: userError } = await client.auth.getUser()

            console.log(userData)
            console.log(userError)

            if (userError) {
                console.log(userError)
                return
            }

            let user = userData.user


            let imageUrl = ""

            if (recipeImage.files.length > 0) {

                let imageFile = recipeImage.files[0]

                const { data: uploadData, error: uploadError } = await client
                    .storage
                    .from("recipe_images")
                    .upload(imageFile.name, imageFile)

                console.log(uploadData)
                console.log(uploadError)

                if (uploadError) {
                    console.log(uploadError)
                    return
                }

                const { data: urlData } = client
                    .storage
                    .from("recipe_images")
                    .getPublicUrl(imageFile.name)

                imageUrl = urlData.publicUrl

                console.log(imageUrl)
            }


            const { error } = await client
                .from("recipes")
                .insert({
                    user_id: user.id,
                    title: title.value,

                    description: description.value,
                    category: category.value,

                    ingredients: ingredients.value,
                    instructions: instructions.value,
                 cooking_time : cookingTime.value,
                    image_url: imageUrl
                })

            console.log(error)

            if (error) {
                console.log(error)
                return
            }

            alert("Recipe Added Successfully")

            recipeForm.reset()

        }
        catch (error) {

            console.log(error)

        }

    })
}







// my recipe start
if (document.querySelector("#myRecipeContainer")) {

    const myRecipes = async () => {

        try {

            const { data: userData, error: userError } = await client.auth.getUser()

            if (userError) {
                console.log(userError)
                return
            }

            let user = userData.user

            const { data, error } = await client
                .from("recipes")
                .select("id, title, description, category, ingredients, instructions, cooking_time, image_url")
                .eq("user_id", user.id)

            if (error) {
                console.log(error)
                return
            }

            let container = document.querySelector("#myRecipeContainer")

            data.forEach((recipe) => {

                container.innerHTML += `
                    <div class="col-md-6 col-lg-4">

                        <div class="card h-100">

                            <img src="${recipe.image_url}" class="card-img-top">

                            <div class="card-body">

                                <h5>${recipe.title}</h5>

                                <p>${recipe.description}</p>

                                <p>Category: ${recipe.category}</p>

                                <p>Cooking Time: ${recipe.cooking_time}</p>

                                <button class="btn btn-dark editBtn" data-id="${recipe.id}">
                                    Edit
                                </button>

                                <button class="btn btn-danger deleteBtn" data-id="${recipe.id}" data-image="${recipe.image_url}">
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>
                `
            })


            let deleteButtons = document.querySelectorAll(".deleteBtn")

            deleteButtons.forEach((button) => {

                button.addEventListener("click", async () => {

                    let id = button.getAttribute("data-id")
                    let imageUrl = button.getAttribute("data-image")

                    try {

                        if (imageUrl) {

                            let imagePath = imageUrl.split("/recipe_images/")[1]

                            const { error: imageError } = await client
                                .storage
                                .from("recipe_images")
                                .remove([imagePath])

                            if (imageError) {
                                console.log(imageError)
                                return
                            }
                        }

                        const { error } = await client
                            .from("recipes")
                            .delete()
                            .eq("id", id)

                        if (error) {
                            console.log(error)
                            return
                        }

                        alert("Recipe Deleted Successfully")

                        location.reload()

                    }
                    catch (error) {

                        console.log(error)

                    }

                })

            })


            let editButtons = document.querySelectorAll(".editBtn")

            editButtons.forEach((button) => {

                button.addEventListener("click", async () => {

                    let id = button.getAttribute("data-id")

                    let title = prompt("Enter Recipe Title")
                    let description = prompt("Enter Recipe Description")
                    let category = prompt("Enter Category")
                    let ingredients = prompt("Enter Ingredients")
                    let instructions = prompt("Enter Instructions")
                    let cookingTime = prompt("Enter Cooking Time")

                    if (!title || !description || !category || !ingredients || !instructions || !cookingTime) {
                        alert("Please fill all fields")
                        return
                    }

                    try {

                        const { error } = await client
                            .from("recipes")
                            .update({
                                title: title,
                                description: description,
                                category: category,
                                ingredients: ingredients,
                                instructions: instructions,
                                cooking_time: cookingTime
                            })
                            .eq("id", id)

                        if (error) {
                            console.log(error)
                            return
                        }

                        alert("Recipe Updated Successfully")

                        location.reload()

                    }
                    catch (error) {

                        console.log(error)

                    }

                })

            })

        }
        catch (error) {

            console.log(error)

        }

    }

    myRecipes()
}

let homerecipe = document.querySelector("#home")
homerecipe && homerecipe.addEventListener("click",(event)=>{
    event.preventDefault()
    window.location.href = "./all-recipes.html"
})


if (document.querySelector("#allRecipeContainer")) {

    let searchRecipe = document.querySelector("#searchRecipe")
    let categoryFilter = document.querySelector("#categoryFilter")
    let container = document.querySelector("#allRecipeContainer")


    const loadCategories = async () => {

        const { data, error } = await client
            .from("categories")
            .select("id, name")

        if (error) {
            console.log(error)
            return
        }

        data.forEach((category) => {

            categoryFilter.innerHTML += `
                <option value="${category.name}">
                    ${category.name}
                </option>
            `

        })

    }


    const loadRecipes = async () => {

        try {

            const { data, error } = await client
                .from("recipes")
                .select("id, title, description, category, cooking_time, image_url, user_id")

            if (error) {
                console.log(error)
                return
            }

            container.innerHTML = ""

            data.forEach(async (recipe) => {

                const { data: recipeIngredients, error: ingredientError } = await client
                    .from("recipe_ingredients")
                    .select("ingredient_id")
                    .eq("recipe_id", recipe.id)

                if (ingredientError) {
                    console.log(ingredientError)
                    return
                }

                let ingredientText = ""

                recipeIngredients.forEach(async (item) => {

                    const { data: ingredient, error } = await client
                        .from("ingredients")
                        .select("name")
                        .eq("id", item.ingredient_id)

                    if (error) {
                        console.log(error)
                        return
                    }

                    if (ingredient.length > 0) {
                        ingredientText += ingredient[0].name + ", "
                    }

                })


                const { data: favoriteData, error: favoriteError } = await client
                    .from("recipe_favorites")
                    .select("id")
                    .eq("recipe_id", recipe.id)

                if (favoriteError) {
                    console.log(favoriteError)
                }


                let favoriteText = "Favorite"

                if (favoriteData.length > 0) {
                    favoriteText = "Favorited"
                }


                container.innerHTML += `
                    <div class="col-12 col-md-6 col-lg-4">

                        <div class="card h-100">

                            <img src="${recipe.image_url}" class="card-img-top">

                            <div class="card-body">

                                <h5>${recipe.title}</h5>

                                <p>${recipe.description}</p>

                                <p>
                                    Category: ${recipe.category}
                                </p>

                                <p>
                                    Cooking Time: ${recipe.cooking_time}
                                </p>

                                <p>
                                    Ingredients: ${ingredientText}
                                </p>

                                <button class="btn btn-dark detailsBtn"
                                    data-id="${recipe.id}">
                                    View Details
                                </button>

                                <button class="btn btn-outline-dark favoriteBtn"
                                    data-id="${recipe.id}">
                                    ${favoriteText}
                                </button>

                            </div>

                        </div>

                    </div>
                `

            })


            setTimeout(() => {

                let detailsButtons = document.querySelectorAll(".detailsBtn")

                detailsButtons.forEach((button) => {

                    button.addEventListener("click", () => {

                        let id = button.getAttribute("data-id")

                        window.location.href =
                            "recipe-details.html?id=" + id

                    })

                })


                let favoriteButtons = document.querySelectorAll(".favoriteBtn")

                favoriteButtons.forEach((button) => {

                    button.addEventListener("click", async () => {

                        let recipeId = button.getAttribute("data-id")

                        const { data: userData, error: userError } =
                            await client.auth.getUser()

                        if (userError) {
                            console.log(userError)
                            return
                        }

                        let user = userData.user

                        const { error } = await client
                            .from("recipe_favorites")
                            .insert({
                                recipe_id: recipeId,
                                user_id: user.id
                            })

                        if (error) {
                            console.log(error)
                            return
                        }

                        button.innerText = "Favorited"

                    })

                })

            }, 500)

        }
        catch (error) {

            console.log(error)

        }

    }


    loadCategories()

    loadRecipes()


    searchRecipe.addEventListener("input", () => {

        let searchValue = searchRecipe.value.toLowerCase()

        let cards = document.querySelectorAll("#allRecipeContainer .col-12")

        cards.forEach((card) => {

            let title = card.querySelector("h5").innerText.toLowerCase()

            if (title.includes(searchValue)) {
                card.style.display = "block"
            }
            else {
                card.style.display = "none"
            }

        })

    })


    categoryFilter.addEventListener("change", () => {

        let selectedCategory = categoryFilter.value

        let cards = document.querySelectorAll("#allRecipeContainer .col-12")

        cards.forEach((card) => {

            let category = card.querySelector("p").innerText

            if (
                selectedCategory == "" ||
                category.includes(selectedCategory)
            ) {
                card.style.display = "block"
            }
            else {
                card.style.display = "none"
            }

        })

    })

}