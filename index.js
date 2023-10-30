const cheerio = require("cheerio")
const requestLib = require("./requestLib")
const fs = require("fs")
const jsonData = require("./one.json")
console.log(jsonData)

let url = "https://www.codechef.com/users/"

const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
}


getPlagData = async (username)=>{

    const htmlScript = await requestLib.getData(url + username, headers);

    console.log(htmlScript)

    // fs.writeFileSync('./data.txt', htmlScript);

    const jsonPattern = /jQuery.extend\(Drupal.settings, ({.*?})\);/;

    const match = htmlScript.match(jsonPattern);

    // if (match) {
    //     const jsonString = match[1];
    //     const jsonData = JSON.parse(jsonString);

    //     let d = jsonData?.date_versus_rating?.all

    //     let count = 0;
    //     for( let data of d){
    //         if( data?.penalised_in?.length) count++;
    //     }
    //     console.log(count);

    // } else {
    //     console.log("JSON data not found in the script.");
    // }

}


getdataofalluser = async (username)=>{

    for await (let d of jsonData){

        console.log(`${d.CODECHEF} ${d["Roll No"]}`);
        await getPlagData(d.CODECHEF)

    }

}

getdataofalluser()
