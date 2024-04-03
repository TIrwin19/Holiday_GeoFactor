// const options = { method: 'GET' };
const today = dayjs()
console.log(today)
var yearVal = today.format('YYYY')
var monthVal = today.format('MM')
var dayVal = today.format('DD')
var countryVal = "US"

var paramsForHoliday = new URLSearchParams({
    api_key: "4657a48c034a4f669efcb46c03aa821f",
    country: countryVal,
    year: yearVal,
    month: monthVal,
    day: dayVal
});

var urlForHoliday = "https://holidays.abstractapi.com/v1/"

function getHolidays(dateObj) {
    paramsForHoliday.set("year", `${dateObj.year}`);
    paramsForHoliday.set("month", `${dateObj.month}`);
    paramsForHoliday.set("day", `${dateObj.day}`);
    return fetch(`${urlForHoliday}?${paramsForHoliday}`)
        .then(response => response.json())
        //.then(response => console.log(response))
        .catch(err => console.error(err));

}

function getUserInput(event) {
    event.preventDefault()
    const inputDate = $('#date').val().split('-')
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
// function to call when form is submitted
function renderNewHolidays(event) {
    event.preventDefault()
    const dateObj = getUserInput(event)
    getHolidays(dateObj)
  .then(renderHolidays)
}
function renderHolidays(holidays) {
    console.log(holidays)
    holidays.forEach(holiday => $('#holidays').append(`<div class="holiday">${holiday.name}</div>`))
}

function getTodaysHolidays() {
    return fetch(`${urlForHoliday}?${paramsForHoliday}`)
        .then(response => response.json())
        .then(renderHolidays)
        .catch(err => console.error(err));
}
$(document).ready(function () {
    getTodaysHolidays()
});

$('#input').on('submit', renderNewHolidays)

$('#holidays').on('click', '.holiday', function (event) {
    document.getElementById('my_modal_1').showModal()
    $('#modal-title').text(this.innerHTML)
    getWikiArticalArray(this.innerHTML, countryVal)
        .then(getWikiExerpt)
        .then(exerpt => $('#modal-content').text(exerpt))
    // .then(openModalWithExerpt)
})

// Takes holiday - Returns title of first relevan wikipedia article
function getWikiArticalArray(holiday, country) {
    const url = "https://en.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: holiday + ' ' + country,
        format: "json",
        origin: "*"
    });
    return pageId = fetch(`${url}?${params}`)
        .then(response => response.json())
        .then(function(data){console.log(data) 
            return data})
        .then(response => response.query.search[0].title)
        .catch(err => console.error(err));
}
// Takes title or article - returns exerpt text

function getWikiExerpt(title) {
    const url = "https://en.wikipedia.org/w/api.php";
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
        .then(response => response.json()).then(function(data){console.log(data) 
            return data})
        .then(response => response.query.pages[0].extract)
        .catch(err => console.error(err));
}