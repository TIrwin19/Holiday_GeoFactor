// get todays date and initialize some vars for use with holiday api
const today = dayjs()
var yearVal = today.format('YYYY')
var monthVal = today.format('MM')
var dayVal = today.format('DD')
var countryVal = "US"

// Create dayObj for later use
var dayObj = {
    year: yearVal,
    month: monthVal,
    day: dayVal
}

// Get the list of stored favorite holidays from local Storage
let favoriteList = JSON.parse(localStorage.getItem('Holiday')) || []

// Set the base url and basic parameters to call the holidays api
var urlForHoliday = "https://holidays.abstractapi.com/v1/"
var paramsForHoliday = new URLSearchParams({
    api_key: "639cbdb5a556466ba320ef4ed2559e55",
    country: countryVal,
    year: yearVal,
    month: monthVal,
    day: dayVal
});

// Render holiday objects to the DOM
function renderHolidays(holidays, date, country) {
    console.log(date)
    $('#day-country').text(`${country} Holidays - ${date.month}/${date.day}/${date.year}`)
    $('#holidays').empty()
    if (holidays.length) {

        holidays.forEach(holiday => $('#holidays').append(`
        <div class="flex flex-col justify-center mx-3 my-5 text-white w-60 h-40 bg-gradient-to-br from-slate-500 via-gray-500 to-zinc-800 border border-stone-700 rounded-3xl hover:drop-shadow-2xl transition ease-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300">
            <p class="hover:cursor-pointer holiday text-center px-1" data-date="${date.month}/${date.day}/${date.year}">${holiday.name}</p>
            <button class= "favorite mt-1 btn btn-outline btn-info scale-75" data-holiday="${holiday.name}" data-country="${country}" data-date="${date.month}/${date.day}/${date.year}">Add to Favorites</button>
        </div>`))
    } else {
        $('#holidays').append(`
        <div class = "mx-3 my-5 text-white text-lg w-56 h-36 bg-gradient-to-br from-slate-500 via-gray-500 to-zinc-800 border border-stone-700 rounded-3xl hover:drop-shadow-2xl flex justify-center items-center transition ease-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300">
            <p class= "no-holiday"  data-date="${date.month}/${date.day}/${date.year}">No Holiday Today</p>
        </div>`)
    }
}

// Gets and Renders todays holidays to the DOM
function getTodaysHolidays() {
    return fetch(`${urlForHoliday}?${paramsForHoliday}`)
        .then(response => response.json())
        .then(res => renderHolidays(res, dayObj, countryVal))
        .catch(err => console.error(err));
}

// gets date and country info from user via the form
function getUserInput(event) {
    event.preventDefault()
    const inputDate = $('#input-date').val().split('-')
    const year = inputDate[0]
    const month = inputDate[1]
    const day = inputDate[2]
    const dateObj = {
        year: year,
        month: month,
        day: day
    }
    const countryCode = $("#input-country").val()
    return { date: dateObj, country: countryCode };
}

// gets holidays given a date and a country
function getHolidays(dateObj, country) {
    paramsForHoliday.set("year", `${dateObj.year}`);
    paramsForHoliday.set("month", `${dateObj.month}`);
    paramsForHoliday.set("day", `${dateObj.day}`);
    paramsForHoliday.set("country", `${country}`);
    return fetch(`${urlForHoliday}?${paramsForHoliday}`)
    .then(response => response.json())
    .catch(err => console.error(err));
    
}

// Gets and renders new holidays when the user chooses a date and country in the form
async function renderNewHolidays(event) {
    event.preventDefault()
    const data = getUserInput(event)
    const holidayList = await getHolidays(data.date, data.country)
    renderHolidays(holidayList, data.date, data.country)
}

// Renders all favorite holidays stored in local storage to the DOM 
function renderAllFavorites() {
    favoriteList.forEach(favorite => renderFav(favorite))
}

// Declare base url for wiki api calls
const urlForWiki = "https://en.wikipedia.org/w/api.php";

// Takes holiday - Returns title of first relevan wikipedia article
function getWikiArticalTitle(holiday, date) {
    // set up api call for the chosen holiday
    const params = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: holiday,
        format: "json",
        origin: "*",
        claims: "en"
    });
    // return the title of the first result in the array of 10 articles
    return fetch(`${urlForWiki}?${params}`)
    .then(response => response.json())
    .then(response => response.query.search[0].title)
    .catch(err => console.error(err));
}

// Takes title - returns exerpt text and link to page
function getWikiExerpt(title) {
    // set up url for wikipedia link in modal
    const underscoreTitle = title.replace(' ', '_')
    const wikiUrl = "https://en.wikipedia.org/wiki/" + underscoreTitle
    // set up url for wiki api call
    const params2 = new URLSearchParams({
        action: "query",
        format: "json",
        prop: "extracts",
        titles: title,
        formatversion: "2",
        exsentences: "3",
        exlimit: "1",
        explaintext: 1,
        origin: "*"
    });
    // make call to wikipedia api and return the exerpt and the link as an object
    return fetch(`${urlForWiki}?${params2}`)
    .then(response => response.json())
    .then(response => { return { exerpt: response.query.pages[0].extract, url: wikiUrl } })
    .catch(err => console.error(err));
}

// Updates the information in the modal and shows it
function updateAndShowModal(event){
    $('#modal-title').text(this.innerHTML)
    getWikiArticalTitle(this.innerHTML, this.dataset['date'])
    .then(res => getWikiExerpt(res))
    .then(res => {
        $('#modal-content').text(res.exerpt)
        $('#modal-link').attr('href', res.url)
    })
    .then(document.getElementById('my_modal_1').showModal())
}

// Deletes a favorite holiday from the DOM and local storage
function deleteFavorite(event) {
    // remove item from DOM and local storage
    this.parentElement.parentElement.remove()
    favoriteList = favoriteList.filter(holidayObj => holidayObj.holiday != this.dataset.holiday)
    localStorage.setItem('Holiday', JSON.stringify(favoriteList))
}

// Adds a favorite holiday to the saved list of holidays and renders it to the DOM
function addFavorite(event) {
    const OBJ = {
        holiday: this.dataset.holiday,
        date: this.dataset.date,
        country: this.dataset.country
    }
    // Checks if Favorite is already present before adding to prevent duplicates
    const check = favoriteList.filter(fav => fav.holiday == OBJ.holiday)
    if (!check.length) {
        favoriteList.push(OBJ)
        localStorage.setItem('Holiday', JSON.stringify(favoriteList))
        renderFav(OBJ)
    }
}

// Appends a holiday to the favorite holiday table in the DOM
function renderFav(favoriteObj) {
    $('tbody').append(`<tr class="hover">
    <th></th>
    <td>${favoriteObj.country}</td>
    <td class="holiday hover:cursor-pointer">${favoriteObj.holiday}</td>
    <td>${favoriteObj.date}</td>
    <td><button class="delete btn btn-outline btn-accent scale-75" data-holiday = "${favoriteObj.holiday}" data-country="${favoriteObj.country}" data-date="${favoriteObj.date}">Delete</button></td>
    </tr>`)
    
}

// Gets and renders todays holidays and saved favorites when the page is loaded
$(document).ready(function () {
    getTodaysHolidays()
    renderAllFavorites()
});

// Listener for the form to get holidays for a different date
$('#holiday-form').on('submit', renderNewHolidays)

// Listener for clicking on a holiday either in the main section or saved section to show the modal with more information
$('main').on('click', '.holiday', updateAndShowModal)

// Listener for adding a favorite holiday
$('#holidays').on('click', '.favorite', addFavorite)

// Listener for deleting favorite holiday from table
$('tbody').on('click', '.delete', deleteFavorite)