const supabaseUrl = "https://kiulnjjmsqqcpvjcqrau.supabase.co";
const supabaseKey = "sb_publishable_NXAFoZcWnwwSVoH7syBfDw_zcduVLPc";

const { createClient } = supabase;

const client = createClient(supabaseUrl, supabaseKey);

console.log(client);


// signup

let signupBtn = document.querySelector("#signup");

signupBtn && signupBtn.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = "./signup.html";
});


let formdetails = document.querySelector("#alldata");

formdetails && formdetails.addEventListener("submit", async (event) => {

    event.preventDefault();

    try {

        const alldata = new FormData(formdetails);

        let inputs = document.querySelectorAll("input");

        let emptyField = false;

        inputs.forEach((input) => {

            if (input.value === "") {
                input.style.border = "2px solid red";
                emptyField = true;
            }

        });

        if (emptyField) {
            alert("Please fill all fields");
            return;
        }


        const data = Object.fromEntries(alldata);

        const { email, password, fullname } = data;


        const { data: signupdata, error } = await client.auth.signUp({
            email,
            password
        });


        console.log(signupdata);
        console.log(error);


        if (error) {
            alert(error.message);
            return;
        }


        const id = signupdata?.user?.id;


        const { error: insertionerror } = await client
            .from("recipe_data")
            .insert({
                fullname: fullname,
                user_id: id
            });


        console.log(insertionerror);


        alert("Signup successful!");

        window.location.href = "./login.html";

    }
    catch (error) {

        console.log(error);

    }

});


// input border

let inputs = document.querySelectorAll("input");

inputs.forEach((input) => {

    input.addEventListener("input", () => {

        if (input.value !== "") {
            input.style.border = "";
        }

    });

});


// login

let loginEmail = document.querySelector("#loginEmail");
let loginPassword = document.querySelector("#loginPass");
let loginBtn = document.querySelector("#loginButton");

let loginFirst = document.querySelector("#login");


loginFirst && loginFirst.addEventListener("click", (event) => {

    event.preventDefault();

    window.location.href = "./login.html";

});


loginBtn && loginBtn.addEventListener("click", async (event) => {

    event.preventDefault();

    try {

        const { data: signindata, error: signinerror } =
            await client.auth.signInWithPassword({
                email: loginEmail.value,
                password: loginPassword.value
            });


        console.log(signindata);
        console.log(signinerror);


        if (signinerror) {
            alert(signinerror.message);
            return;
        }


        window.location.href = "./dashboard.html";

    }
    catch (error) {

        console.log(error);

    }

});


// dashboard user check

if (document.querySelector("#totalRecipes")) {

    const checkUser = async () => {

        const { data, error } = await client.auth.getUser();

        console.log(data);
        console.log(error);


        if (!data.user) {

            window.location.href = "./login.html";

            return;
        }

    };


    checkUser();

}


// total recipes

if (document.querySelector("#totalRecipes")) {

    const totalRecipes = async () => {

        const { data, error } = await client
            .from("recipes")
            .select("id");


        console.log(data);
        console.log(error);


        if (error) {
            console.log(error);
            return;
        }


        document.querySelector("#totalRecipes").innerText = data.length;

    };


    totalRecipes();

}


// my recipes count

if (document.querySelector("#myRecipes")) {

    const myRecipes = async () => {

        const { data: userData, error: userError } =
            await client.auth.getUser();


        if (userError) {
            console.log(userError);
            return;
        }


        let user = userData.user;


        const { data, error } = await client
            .from("recipes")
            .select("id")
            .eq("user_id", user.id);


        if (error) {
            console.log(error);
            return;
        }


        document.querySelector("#myRecipes").innerText = data.length;

    };


    myRecipes();

}


// logout

let logoutBtn = document.querySelector("#logoutBtn");


logoutBtn && logoutBtn.addEventListener("click", async () => {

    const { error } = await client.auth.signOut();


    console.log(error);


    if (!error) {

        window.location.href = "./login.html";

    }

});


// dashboard recent recipes

if (document.querySelector("#recipeContainer")) {

    const recentRecipes = async () => {

        const { data, error } = await client
            .from("recipes")
            .select("id, title, description, category, cooking_time");


        console.log(data);
        console.log(error);


        if (error) {
            console.log(error);
            return;
        }


        let container = document.querySelector("#recipeContainer");

        container.innerHTML = "";


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
            `;

        });

    };


    recentRecipes();

}


// create recipe

if (document.querySelector("#recipeForm")) {

    let recipeForm = document.querySelector("#recipeForm");

    let title = document.querySelector("#title");
    let description = document.querySelector("#description");
    let category = document.querySelector("#category");
    let ingredients = document.querySelector("#ingredients");
    let instructions = document.querySelector("#instructions");
    let cookingTime = document.querySelector("#cookingTime");
    let recipeImage = document.querySelector("#recipeImage");


    recipeForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        try {

            const { data: userData, error: userError } =
                await client.auth.getUser();


            if (userError || !userData.user) {

                alert("Please login first");

                window.location.href = "./login.html";

                return;
            }


            let user = userData.user;

            let imageUrl = "";


            if (recipeImage.files.length > 0) {

                let imageFile = recipeImage.files[0];


                const { data: uploadData, error: uploadError } =
                    await client
                        .storage
                        .from("recipe_images")
                        .upload(imageFile.name, imageFile);


                console.log(uploadData);
                console.log(uploadError);


                if (uploadError) {

                    console.log(uploadError);

                    alert(uploadError.message);

                    return;
                }


                const { data: urlData } = client
                    .storage
                    .from("recipe_images")
                    .getPublicUrl(imageFile.name);


                imageUrl = urlData.publicUrl;

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
                    cooking_time: cookingTime.value,
                    image_url: imageUrl
                });


            console.log(error);


            if (error) {

                console.log(error);

                alert(error.message);

                return;
            }


            alert("Recipe Added Successfully");

            recipeForm.reset();

        }
        catch (error) {

            console.log(error);

        }

    });

}


// my recipes

if (document.querySelector("#myRecipeContainer")) {

    const myRecipes = async () => {

        try {

            const { data: userData, error: userError } =
                await client.auth.getUser();


            if (userError || !userData.user) {

                window.location.href = "./login.html";

                return;
            }


            let user = userData.user;


            const { data, error } = await client
                .from("recipes")
                .select("id, title, description, category, ingredients, instructions, cooking_time, image_url")
                .eq("user_id", user.id);


            if (error) {

                console.log(error);

                return;
            }


            let container =
                document.querySelector("#myRecipeContainer");


            container.innerHTML = "";


            data.forEach((recipe) => {

                container.innerHTML += `
                    <div class="col-md-6 col-lg-4">

                        <div class="card h-100">

                            <img src="${recipe.image_url}"
                                class="card-img-top">

                            <div class="card-body">

                                <h5>${recipe.title}</h5>

                                <p>${recipe.description}</p>

                                <p>Category: ${recipe.category}</p>

                                <p>Cooking Time: ${recipe.cooking_time}</p>

                                <button
                                    class="btn btn-dark editBtn"
                                    data-id="${recipe.id}">
                                    Edit
                                </button>

                                <button
                                    class="btn btn-danger deleteBtn"
                                    data-id="${recipe.id}"
                                    data-image="${recipe.image_url}">
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>
                `;

            });


            let deleteButtons =
                document.querySelectorAll(".deleteBtn");


            deleteButtons.forEach((button) => {

                button.addEventListener("click", async () => {

                    let id = button.getAttribute("data-id");

                    let imageUrl =
                        button.getAttribute("data-image");


                    try {

                        if (imageUrl) {

                            let imagePath =
                                imageUrl.split("/recipe_images/")[1];


                            if (imagePath) {

                                const { error: imageError } =
                                    await client
                                        .storage
                                        .from("recipe_images")
                                        .remove([imagePath]);


                                if (imageError) {
                                    console.log(imageError);
                                }

                            }

                        }


                        const { error } = await client
                            .from("recipes")
                            .delete()
                            .eq("id", id);


                        if (error) {

                            console.log(error);

                            return;
                        }


                        alert("Recipe Deleted Successfully");

                        location.reload();

                    }
                    catch (error) {

                        console.log(error);

                    }

                });

            });


            let editButtons =
                document.querySelectorAll(".editBtn");


            editButtons.forEach((button) => {

                button.addEventListener("click", async () => {

                    let id = button.getAttribute("data-id");


                    let newTitle =
                        prompt("Enter Recipe Title");

                    let newDescription =
                        prompt("Enter Recipe Description");

                    let newCategory =
                        prompt("Enter Category");

                    let newIngredients =
                        prompt("Enter Ingredients");

                    let newInstructions =
                        prompt("Enter Instructions");

                    let newCookingTime =
                        prompt("Enter Cooking Time");


                    if (
                        !newTitle ||
                        !newDescription ||
                        !newCategory ||
                        !newIngredients ||
                        !newInstructions ||
                        !newCookingTime
                    ) {

                        alert("Please fill all fields");

                        return;
                    }


                    const { error } = await client
                        .from("recipes")
                        .update({
                            title: newTitle,
                            description: newDescription,
                            category: newCategory,
                            ingredients: newIngredients,
                            instructions: newInstructions,
                            cooking_time: newCookingTime
                        })
                        .eq("id", id);


                    if (error) {

                        console.log(error);

                        return;
                    }


                    alert("Recipe Updated Successfully");

                    location.reload();

                });

            });

        }
        catch (error) {

            console.log(error);

        }

    };


    myRecipes();

}


// home button

let homerecipe = document.querySelector("#home");


homerecipe && homerecipe.addEventListener("click", (event) => {

    event.preventDefault();

    window.location.href = "./all-recipes.html";

});


// all recipes

if (document.querySelector("#allRecipeContainer")) {

    let searchRecipe =
        document.querySelector("#searchRecipe");

    let categoryFilter =
        document.querySelector("#categoryFilter");

    let container =
        document.querySelector("#allRecipeContainer");


    categoryFilter.innerHTML = `
        <option value="">All Categories</option>
        <option value="Pakistani">Pakistani</option>
        <option value="Italian">Italian</option>
        <option value="Chinese">Chinese</option>
        <option value="Desserts">Desserts</option>
        <option value="Fast Food">Fast Food</option>
        <option value="Healthy">Healthy</option>
    `;


    const loadRecipes = async () => {

        const { data, error } = await client
            .from("recipes")
            .select("id, title, description, category, cooking_time, image_url");


        console.log(data);
        console.log(error);


        if (error) {

            console.log(error);

            return;
        }


        container.innerHTML = "";


        data.forEach((recipe) => {

            container.innerHTML += `
                <div class="col-12 col-md-6 col-lg-4 recipeCard"
                    data-category="${recipe.category}">

                    <div class="card h-100">

                        <img
                            src="${recipe.image_url}"
                            class="card-img-top">

                        <div class="card-body">

                            <h5>${recipe.title}</h5>

                            <p>${recipe.description}</p>

                            <p>
                                Category: ${recipe.category}
                            </p>

                            <p>
                                Cooking Time:
                                ${recipe.cooking_time}
                            </p>

                            <button
                                class="btn btn-dark detailsBtn"
                                data-id="${recipe.id}">
                                View Details
                            </button>

                        </div>

                    </div>

                </div>
            `;

        });


        let detailsButtons =
            document.querySelectorAll(".detailsBtn");


        detailsButtons.forEach((button) => {

            button.addEventListener("click", () => {

                let id =
                    button.getAttribute("data-id");


                window.location.href =
                    "./recipe-details.html?id=" + id;

            });

        });

    };


    loadRecipes();


    searchRecipe.addEventListener("input", () => {

        let searchValue =
            searchRecipe.value.toLowerCase();


        let cards =
            document.querySelectorAll(".recipeCard");


        cards.forEach((card) => {

            let title =
                card.querySelector("h5")
                    .innerText
                    .toLowerCase();


            if (title.includes(searchValue)) {

                card.style.display = "block";

            }
            else {

                card.style.display = "none";

            }

        });

    });


    categoryFilter.addEventListener("change", () => {

        let selectedCategory =
            categoryFilter.value;


        let cards =
            document.querySelectorAll(".recipeCard");


        cards.forEach((card) => {

            let cardCategory =
                card.getAttribute("data-category");


            if (
                selectedCategory === "" ||
                cardCategory === selectedCategory
            ) {

                card.style.display = "block";

            }
            else {

                card.style.display = "none";

            }

        });

    });

}


// recipe details

if (document.querySelector("#recipeDetails")) {

    const loadRecipeDetails = async () => {

        let url =
            new URLSearchParams(window.location.search);


        let id = url.get("id");


        if (!id) {

            return;

        }


        const { data, error } = await client
            .from("recipes")
            .select("*")
            .eq("id", id)
            .single();


        console.log(data);
        console.log(error);


        if (error) {

            console.log(error);

            return;

        }


        let container =
            document.querySelector("#recipeDetails");


        container.innerHTML = `
            <div class="card">

                <img
                    src="${data.image_url}"
                    class="card-img-top"
                    style="max-height:450px; object-fit:cover;">

                <div class="card-body p-4">

                    <h1>${data.title}</h1>

                    <p>${data.description}</p>

                    <p>
                        <strong>Category:</strong>
                        ${data.category}
                    </p>

                    <p>
                        <strong>Cooking Time:</strong>
                        ${data.cooking_time}
                    </p>

                    <h4>Ingredients</h4>

                    <p>${data.ingredients}</p>

                    <h4>Instructions</h4>

                    <p>${data.instructions}</p>

                    <p>
                        <strong>Date:</strong>
                        ${new Date(data.created_at).toLocaleDateString()}
                    </p>

                </div>

            </div>
        `;

    };


    loadRecipeDetails();

}