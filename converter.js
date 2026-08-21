const fromFlagImg = document.querySelector("#from-flag-img");
const toFlagImg = document.querySelector("#to-flag-img");
const selectFrom = document.querySelector("#selectFrom");
const selectTo = document.querySelector("#selectTo");
const form = document.querySelector("#form");
const toInputAmt = document.querySelector("#to-input-amt");
const fromInputAmt = document.querySelector("#from-input-amt");
const displayField = document.querySelector(".display");
const swapBtn = document.querySelector("#swap-btn");

// To populate dropdowns
function populateCurrencyDropdown(currencyArray){
    
    currencyArray.forEach((object) => {

        // console.log("Check the keys inside this object:", object);
        let isoCode = object.iso_code;

        // OPTIONs : option1: from Flag     option2: to Flag
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        option1.textContent = isoCode;
        option2.textContent = isoCode;
        option1.value = isoCode;
        option2.value = isoCode;

        // INITIALLY : To keep Values selected INR in from
        if(isoCode === 'INR') option1.selected = true;
        selectFrom.append(option1); //add to dropdown
        if(isoCode === 'USD') option2.selected = true;
        selectTo.append(option2); //add to dropdown
        
    });        
        
}       

// RESET (used at each refresh or first load)
function reset(){
    // Just initiate with 1000 indian Rupees and always its conversion to Dollars 
    fromInputAmt.value = 1000;
    // this converts that to dollars
    convert(fromInputAmt, toInputAmt);
}    



//GET CURRENCY DATA FROM NETWORK AND STOREIN SESSION STORAGE CACHE
async function getCurrencyAPIData() {

    try{

        const res = await fetch(`https://api.frankfurter.dev/v2/currencies`);
        const data = await res.json();
    
        console.log(`This DATA is Printed in async Function \n${data}`);
        
        if(Array.isArray(data)){
            // console.log("ITS ARRAY")
        }            
        // STORE ARRAY TO LOCAL(CACHE IT)
        // localStorage.setItem('myCurrencies', JSON.stringify(data));
        //STORE IN SESSION
        sessionStorage.setItem('myCurrencies', JSON.stringify(data));

        //return that data...its an array 
        return data;
        
    } catch(error){
        // IN CASE API FAILED
        console.error("API Fetch Failed:", error);
        return [];
    }    
}    



//-----THIS below PREVENTS UNECESSARY NEW API CALL ON EACH REFRESH-------

// VERY FIRST THIS FUNCTION CALLS
async function initializeApp() {
    
    // To get cached currenies
    const cachedCurrencies = sessionStorage.getItem('myCurrencies');
    
    // Check if exists in cache instantly load without calling Network API for currency
    if(cachedCurrencies){

        //1.  LOAD from CACHED instantly
        // Parse the string back into the array and pass to helper function
        const cachedCurrenciesARRAY = JSON.parse(cachedCurrencies);
        populateCurrencyDropdown(cachedCurrenciesARRAY);
        console.log("Loaded from CACHE: ",cachedCurrenciesARRAY);  
        
    }    
    else{
        
        //2.  LOAD Directly from API
        const freshData = await getCurrencyAPIData();
        populateCurrencyDropdown(freshData); //its already an ARRAY
        console.log("Loaded from network API: ", freshData);
    }    

    // RUNS ONLY AFTER 1. or 2. above completes, causing no conversion before dropdown populated
    reset();

    
}    

//IMPORTANT AT FIRST LOAD
initializeApp();

//-----THIS PREVENTS UNECESSARY NEW API CALL ON EACH REFRESH-------






//SWAP COUNTRIES DROPDOWN(if India in from and US in to, then US becomes in from and India in to, and converts from to to rate instantly)
function swapCountriesDropdown(){

    // BETTER USE OF DESTRUCTURING
    // Swap Change Dropdown seleted Values
    [selectFrom.value, selectTo.value] = [selectTo.value, selectFrom.value];

    // FLAG SWAP
    [fromFlagImg.src, toFlagImg.src] = [toFlagImg.src, fromFlagImg.src];
    
    //FLAG ALT also Swapped
    [fromFlagImg.alt, toFlagImg.alt] = [toFlagImg.alt, fromFlagImg.alt];
    

    // And Convert 
    convert(fromInputAmt, toInputAmt);

    
    // document.activeElement.blur();
}
// Listener on that SWAP BUTTON
swapBtn.addEventListener('click', (e)=>{
    e.preventDefault();
    swapCountriesDropdown();
});





// DISPLAY AFTER CONVERSION
function displayConversionRate(amount, convertedAmt, fromCurrencyCode, toCurrencyCode) {


    // first check in Cache
    const cachedCurrencies = sessionStorage.getItem('myCurrencies');

    if (!cachedCurrencies) return; // Guard clause: Exit early if cache is empty

    const currenciesArray = JSON.parse(cachedCurrencies);

    // 1. Use .find() to target specific objects directly instead of looping through everything
    const fromCurrency = currenciesArray.find(obj => obj.iso_code === fromCurrencyCode) || {};  //either found object or|| nothing {}
    const toCurrency = currenciesArray.find(obj => obj.iso_code === toCurrencyCode) || {};

    // 2. Destructure properties with fallbacks so the code doesn't crash if a property is missing
    const { symbol: symbolFrom = '', name: nameFrom = '' } = fromCurrency; //This tells JavaScript: "Go inside fromCurrency. Grab the symbol key, but rename the variable to symbolFrom. If it doesn't exist, default to an empty string ''."
    const { symbol: symbolTo = '', name: nameTo = '' } = toCurrency; //same like above

    // 3. Destructure the DOM elements from the layout wrapper in one clean line
    const [first, mid, last] = displayField.children;

    // 4. Update the text fields
    if (first && mid && last) {
        first.textContent = `${symbolFrom}${amount} "${nameFrom}"`;
        mid.textContent = " is Equals To ";
        last.textContent = `${symbolTo}${convertedAmt} "${nameTo}"`;
    }
}





// MAIN CONVERSION FUNCTION
function convert(trigerredInput, otherInput){

    // SHIELD: If the text box is empty, don't waste time calculating or fetching.
    // Just clear out the other box and stop!
    if (trigerredInput.value.trim() === "") {
        otherInput.value = "";
        return;
    }
    
    let fromCurrencyCode = selectFrom.value;
    let toCurrencyCode = selectTo.value;
    
    
    // TO SWAP CONVERSION to consider which input should be taken as base
    if(trigerredInput.id === "from-input-amt"){
        
        fromCurrencyCode = selectFrom.value;
        toCurrencyCode = selectTo.value;
    }
    else if(trigerredInput.id === "to-input-amt"){
        
        // SWAP if input field is different
        fromCurrencyCode = selectTo.value;
        toCurrencyCode =  selectFrom.value;

    }




    // let amount = 50000;
    let amount = parseFloat(trigerredInput.value);
    // let convertedAmt = otherInput.value;

    const url = `https://api.frankfurter.dev/v2/rate/${fromCurrencyCode}/${toCurrencyCode}`


    // FETCH API
    fetch(url)
    .then((res)=> res.json())
    .then((data)=>{
        // console.log(data);
       
        let convertedAmt = (amount*data.rate).toFixed(3);

        // DISPLAY FUNCTION CALLED after conversion
        displayConversionRate(amount, convertedAmt, fromCurrencyCode, toCurrencyCode);

        console.log(`${amount} ${fromCurrencyCode}  = ${convertedAmt} ${toCurrencyCode}`);

        
        // Display in other input box(OUTPUT)
        otherInput.value = `${convertedAmt}`
        
        // for DEBUGGING 2 lines(input event is also triggered by select so avoid it)
        // console.log(`Triggered Input is ${trigerredInput}`);
        // console.log(`Other Input is ${otherInput}`);
    })
    .catch(err => {
        console.log("Conversion Failed");
        otherInput.value = "Error";
    });



}




// DEBOUNCE FUNCTION
function debounce(MyConvert, delay){

    let timerId;
    // let counter = 1;

     //so when we put our arguments in returned function(here --->convertWithDebounce ), it starts timer and executes only after time is up, otherwise resets
    return function(...args)
    {
        clearTimeout(timerId); //clears previous closure timerId

        // Set AGAIN new timerId for same closure
        timerId = setTimeout(()=>{
            
            MyConvert(...args);
            // console.log(`API CALLED ${counter++} times`);
            
        }, delay)
    }
}

// RETURNED FUNCTION with its CLOSURE(timerId, counter)
// convert function is callback, 1000 delay on that
const convertWithDebounce = debounce(convert, 1000);

// To apply on INPUT
form.addEventListener('input', (e)=>{

    //INPUT<----------
    const trigerredInput = e.target;
    
    // IMPORTANT : If the event came from a dropdown (<select>), stop right here and ignore it!
    if (trigerredInput.tagName === "SELECT") return; //MAJOR
    // Because when we select dropdown input event fires again , means it becomes two times
    
    //OUTPUT<------
    let otherInput;
    
    //This allows input from any of inputs, for REVERSE conversion from right to left left to right
    if(trigerredInput.id === "from-input-amt"){
        console.log("Typing in FROM");
        
        otherInput = toInputAmt;
    }    
    
    if(trigerredInput.id === "to-input-amt"){
        console.log("Typing in TO");

        otherInput = fromInputAmt;
    }    
    

    // FINALLY CONVERT

    // MAIN DEBOUNCE CALL, It updates same Closure Variables
    convertWithDebounce(trigerredInput, otherInput);
    

    // Without Debounce(simple)but API call for each Input
    // convert(trigerredInput, otherInput)
})    

// Function  to change flag, takes triggered dropdown, and image element to change
function changeFlag(triggeredDropdown, flagImage){
        let currencyCode = triggeredDropdown.value
        let flagCode = currencyCode.slice(0,2).toLowerCase();
        let flagURL = `https://flags.restcountries.com/v5/w160/${flagCode}-4x3.png`;
        flagImage.src = flagURL;
        flagImage.alt = currencyCode; //if no Image to display

}
// DROPDOWN CHANGE
form.addEventListener('change', (e)=>{
    const currentDropdown = e.target;

    //GATEKEEPER: If changed something else in the form not dropdown, exit early
    if (currentDropdown.id !== "selectFrom" && currentDropdown.id !== "selectTo") return;
    
    if(currentDropdown.id === "selectFrom"){
        changeFlag(currentDropdown, fromFlagImg);
    }
    else if(currentDropdown.id === "selectTo"){
        
        changeFlag(currentDropdown, toFlagImg);
    }

       
    convert(fromInputAmt, toInputAmt);

})


// To exit when Enter on mobile key down
// Target your form


// https://api.frankfurter.dev/v2/currencies
//https://api.frankfurter.dev/v2/rate/INR/USD

// let flagCode = 'gb';

// let flagURL = `https://flags.restcountries.com/v5/w160/${flagCode}.png`;

// 4x3 wide 
// let flagURL = `https://flags.restcountries.com/v5/w160/${flagCode}-4x3.png`;

// flag.src = flagURL;
