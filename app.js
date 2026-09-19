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


formdetails && formdetails.addEventListener("submit",(event)=>{
    event.preventDefault()
    const alldata = new FormData(formdetails)
    const data = Object.fromEntries(alldata)
    console.log(data);
   
})