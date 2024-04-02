// const options = { method: 'GET' };

fetch('https://holidays.abstractapi.com/v1/?api_key=4657a48c034a4f669efcb46c03aa821f&country=US&year=2024&month=04&day=04')
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

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
