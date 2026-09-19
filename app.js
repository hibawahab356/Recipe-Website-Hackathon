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
            .from("recipe_data")
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


