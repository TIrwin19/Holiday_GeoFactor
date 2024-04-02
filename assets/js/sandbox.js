// const options = { method: 'GET' };
const today = dayjs()
console.log(today)
var yearVal = today.format('YYYY')
var monthVal = today.format('MM')
var dayVal = today.format('DD')



var paramsForHoliday = new URLSearchParams({
    api_key: "4657a48c034a4f669efcb46c03aa821f",
    country: "US",
    year: yearVal,
    month: monthVal,
    day: dayVal
});

var urlForHoliday = "https://holidays.abstractapi.com/v1/"

function getHolidays(dateObj) {
    paramsForHoliday.set("year", `${dateObj.year}`);
    paramsForHoliday.set("month", `${dateObj.month}`);
    paramsForHoliday.set("day", `${dateObj.day}`);
    fetch(`${urlForHoliday}?${paramsForHoliday}`)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));

}
// fetch(`${urlForHoliday}?${paramsForHoliday}`)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));


// fetch('https://holidays.abstractapi.com/v1/?api_key=4657a48c034a4f669efcb46c03aa821f&country=US&year=2024&month=04&day=04')
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));




function getUserInput(event) {
    event.preventDefault()
    const Date = $('#date').val().split('-')
    const year = Date[0]
    const Month = Date[1]
    const Day = Date[2]
    const DateOBJ = {
        year: year,
        month: Month,
        day: Day
    }
    console.log(DateOBJ)
    getHolidays(DateOBJ)
    return DateOBJ;
}
$(document).ready(function () {
    fetch(`${urlForHoliday}?${paramsForHoliday}`)
        .then(response => response.json())
        .then(response => response.forEach(holiday => $('#holidays').append(`<div class="holiday">${holiday.name}</div>`)))
        .catch(err => console.error(err));

    // $('.holidays')
});

function displayModel() {
    console.log("")
}

$('form').on('submit', getUserInput)
$('#holidays').on('click', '.holiday', function (event) {
    console.log('Clicked on ' + this.innerHTML)
    getWikiArticalArray(this.innerHTML)
        .then(getWikiExerpt)
})

function getWikiExerpt(pageId) {
    const url = "https://en.wikipedia.org/w/api.php";
    var params2 = new URLSearchParams({
        action: "query",
        format: "json",
        prop: "extracts",
        titles: pageId,
        formatversion: "2",
        exsentences: "10",
        exlimit: "1",
        explaintext: 1,
        origin: "*"
    });
    console.log(`${params2}`)
    fetch(`${url}?${params2}`)
        .then(response => response.json())
        .then(response => console.log(response.query.pages[0].extract))
        .catch(err => console.error(err));
}


function getWikiArticalArray(holiday) {
    const url = "https://en.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
        action: "query",
        list: "search",
        srsearch: holiday,
        format: "json",
        origin: "*"
    });
    return pageId = fetch(`${url}?${params}`)
        .then(response => response.json())
        .then(response => response.query.search[0].title)
        .catch(err => console.error(err));


}
// var url = "https://en.wikipedia.org/w/api.php";

// var params = new URLSearchParams({
//     action: "query",
//     list: "search",
//     srsearch: "United Nations' Mine Awareness Day",
//     format: "json",
//     origin: "*"
// });
// console.log(`${url}?${params}`)

// fetch(`${url}?${params}`)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));

// var params2 = new URLSearchParams({
//     action: "query",
//     format: "json",
//     prop: "extracts",
//     titles: "",
//     formatversion: "2",
//     exsentences: "10",
//     exlimit: "1",
//     explaintext: 1,
//     origin: "*"
// });

// params2.set("titles", "United Nations Mine Action Service");

// fetch(`${url}?${params2}`)
//     .then(response => response.json())
//     .then(response => console.log(response))
//     .catch(err => console.error(err));
