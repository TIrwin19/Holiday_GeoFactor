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

function renderHolidays(holidays, date, country) {
    console.log(date)
    $('#day-country').text(`${country} Holidays - ${date.month}/${date.day}/${date.year}`)
    $('#holidays').empty()
    if (holidays.length) {
        holidays.forEach(holiday => $('#holidays').append(`<div class="mx-3 my-5 text-white text-lg w-56 h-36 bg-gradient-to-br from-slate-500 via-gray-500 to-zinc-800 border border-stone-700 rounded-3xl hover:drop-shadow-2xl flex justify-center items-center transition ease-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300""><p
    class="holiday" data-country="${country}" data-date="${date.month}/${date.day}/${date.year}">${holiday.name}</p>
    <button data-holiday = "${holiday.name}" data-country="${country}" data-date="${date.month}/${date.day}/${date.year}"class= "favorite">Add to Favorites</button></div>`))
    } else {
        $('#holidays').append(`<div class = "mx-3 my-5 text-white text-lg w-56 h-36 bg-gradient-to-br from-slate-500 via-gray-500 to-zinc-800 border border-stone-700 rounded-3xl hover:drop-shadow-2xl flex justify-center items-center transition ease-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300"><p
    class= "no-holiday" data-country="${country}" data-date="${date.month}/${date.day}/${date.year}">No Holiday Today</p></div>`)
    }
}

{/* <p
class=" holiday mx-3 my-5 text-white text-lg size-36 bg-gradient-to-br from-slate-500 via-gray-500 to-zinc-800 border border-stone-700 rounded-3xl hover:drop-shadow-2xl flex justify-center items-center transition ease-out delay-75 hover:-translate-y-1 hover:scale-110 duration-300" data-date="${date.month}/${date.day}/${date.year}">${holiday.name}</p> */}

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
    return {date:dateObj, country:countryCode};
}
function getHolidays(dateObj,country) {
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
    console.log (data)
    const holidayList = await getHolidays(data.date,data.country)
    renderHolidays(holidayList, data.date, data.country)
}

$(document).ready(function () {
    getTodaysHolidays()
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

$('#holidays').on('click', '.favorite', function (event) {
    // 
        })


// Takes holiday - Returns title of first relevan wikipedia article
function getWikiArticalArray(holiday, date) {
    const url = "https://en.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: holiday,
        format: "json",
        origin: "*"
    });
    return fetch(`${url}?${params}`)
        .then(response => response.json())
        // .then(response => console.log(response))
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
        .then(response => { return {exerpt: response.query.pages[0].extract, url: wikiUrl} })
        .catch(err => console.error(err));
}