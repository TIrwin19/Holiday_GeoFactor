// get todays holidays and render them to
const today = dayjs()
console.log(today)
var yearVal = today.format('YYYY')
var monthVal = today.format('MM')
var dayVal = today.format('DD')
var countryVal = "US"
var country = "United States"

var dayObj = {
    year: yearVal,
    month: monthVal,
    day: dayVal
}

var paramsForHoliday = new URLSearchParams({
    api_key: "4657a48c034a4f669efcb46c03aa821f",
    country: countryVal,
    year: yearVal,
    month: monthVal,
    day: dayVal
});

var urlForHoliday = "https://holidays.abstractapi.com/v1/"
let favoriteList = JSON.parse(localStorage.getItem('Holiday')) || []

console.log(favoriteList)

function renderHolidays(holidays, date, country) {
    console.log(date)
    $('#day-country').text(`${country} Holidays - ${date.month}/${date.day}/${date.year}`)
    $('#holidays').empty()
    if (holidays.length) {

        holidays.forEach(holiday => $('#holidays').append(`
        <div class="flex flex-col justify-center mx-3 my-5 text-white text-lg w-56 h-36 bg-gradient-to-br from-slate-500 via-gray-500 to-zinc-800 border border-stone-700 rounded-3xl hover:drop-shadow-2xl transition ease-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300">
            <p class="holiday text-center" data-date="${date.month}/${date.day}/${date.year}">${holiday.name}</p>
            <button class= "favorite mt-1 btn btn-outline btn-info scale-75" data-holiday="${holiday.name}" data-country="${country}" data-date="${date.month}/${date.day}/${date.year}">Add to Favorites</button>
        </div>`))
    } else {
        $('#holidays').append(`
        <div class = "mx-3 my-5 text-white text-lg w-56 h-36 bg-gradient-to-br from-slate-500 via-gray-500 to-zinc-800 border border-stone-700 rounded-3xl hover:drop-shadow-2xl flex justify-center items-center transition ease-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300">
            <p class= "no-holiday"  data-date="${date.month}/${date.day}/${date.year}">No Holiday Today</p>
        </div>`)
    }
}

function getTodaysHolidays() {
    return fetch(`${urlForHoliday}?${paramsForHoliday}`)
        .then(response => response.json())
        .then(res => renderHolidays(res, dayObj, country))
        .catch(err => console.error(err));
}
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
    console.log(dateObj)
    // getHolidays(dateObj)
    //     .then(renderHolidays)
    return dateObj;
}

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
    console.log(dateObj)
    // getHolidays(dateObj)
    //     .then(renderHolidays)
    return { date: dateObj, country: countryCode };
}
function getHolidays(dateObj, country) {
    paramsForHoliday.set("year", `${dateObj.year}`);
    paramsForHoliday.set("month", `${dateObj.month}`);
    paramsForHoliday.set("day", `${dateObj.day}`);
    paramsForHoliday.set("country", `${country}`);
    return fetch(`${urlForHoliday}?${paramsForHoliday}`)
        .then(response => response.json())
        // .then(response => console.log(response))
        .catch(err => console.error(err));

}
// function to call when form is submitted
async function renderNewHolidays(event) {
    event.preventDefault()
    const data = getUserInput(event)
    console.log(data)
    const holidayList = await getHolidays(data.date, data.country)
    renderHolidays(holidayList, data.date, data.country)
}
function renderAllFavorites(){
    favoriteList.forEach(favorite => renderFav(favorite))
}

$(document).ready(function () {
    getTodaysHolidays()
   renderAllFavorites()

});
$('#holiday-form').on('submit', renderNewHolidays)

$('#holidays').on('click', '.holiday', async function (event) {
    document.getElementById('my_modal_1').showModal()
    $('#modal-title').text(this.innerHTML)
    const title = await getWikiArticalArray(this.innerHTML, this.dataset['date'])
    getWikiExerpt(title)
        .then(res => {
            $('#modal-content').text(res.exerpt)
            $('#modal-link').attr('href', res.url)
        })
})
$('tbody').on('click', '.holiday', async function (event) {
    document.getElementById('my_modal_1').showModal()
    $('#modal-title').text(this.innerHTML)
    const title = await getWikiArticalArray(this.innerHTML, this.dataset['date'])
    getWikiExerpt(title)
        .then(res => {
            $('#modal-content').text(res.exerpt)
            $('#modal-link').attr('href', res.url)
        })
})

$('tbody').on('click', '.delete', function (event) {
    // remove item from DOM and local storage
    console.log('clicked delete')
    this.parentElement.parentElement.remove()
    console.log(favoriteList)
    console.log(favoriteList[0].holiday)
    console.log(this.dataset.holiday)
   favoriteList = favoriteList.filter(holidayObj => holidayObj.holiday != this.dataset.holiday)
    console.log(favoriteList.length)
    localStorage.setItem('Holiday',JSON.stringify(favoriteList))
   

})

$('#holidays').on('click', '.favorite', function (event) {
    const OBJ = {
        holiday: this.dataset.holiday,
        date: this.dataset.date,
        country: this.dataset.country
    }
    console.log(OBJ)
    console.log(favoriteList.filter(fav => fav==OBJ))
    let check = favoriteList.filter(fav => fav.holiday==OBJ.holiday)
    console.log(check)
    if(!check.length){
        favoriteList.push(OBJ)
        console.log(favoriteList)
        localStorage.setItem('Holiday',JSON.stringify(favoriteList))
        renderFav(OBJ)
    }


    // if(!favoriteList.find(fav => fav==OBJ)){
        
    // }

    return OBJ;

})



function renderFav(favoriteObj) {
    $('tbody').append(`<tr class="hover">
          <th></th>
          <td>${favoriteObj.country}</td>
          <td class="holiday">${favoriteObj.holiday}</td>
          <td>${favoriteObj.date}</td>
          <td><button class="delete btn btn-outline btn-accent scale-75" data-holiday = "${favoriteObj.holiday}" data-country="${favoriteObj.country}" data-date="${favoriteObj.date}">Delete</button></td>
      </tr>`)

}
// Takes holiday - Returns title of first relevan wikipedia article
function getWikiArticalArray(holiday, date) {
    const url = "https://en.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: holiday,
        format: "json",
        origin: "*",
        claims: "en"
    });
    return fetch(`${url}?${params}`)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            return response   
        })
        .then(response => response.query.search[0].title)
        .catch(err => console.error(err));
}
// Takes title or article - returns exerpt text

function getWikiExerpt(title) {
    const url = "https://en.wikipedia.org/w/api.php";
    underscoreTitle = title.replace(' ', '_')
    wikiUrl = "https://en.wikipedia.org/wiki/" + underscoreTitle
    var params2 = new URLSearchParams({
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
    console.log(`${params2}`)
    return fetch(`${url}?${params2}`)
        .then(response => response.json())
        .then(response => { return { exerpt: response.query.pages[0].extract, url: wikiUrl } })
        .catch(err => console.error(err));
}