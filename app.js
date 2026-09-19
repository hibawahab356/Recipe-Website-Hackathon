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