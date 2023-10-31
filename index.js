const cheerio = require("cheerio")
const requestLib = require("./requestLib")
const fs = require("fs")
const jsonData = require("./one.json")
const async = require("async")
console.log(jsonData)

let url = "https://www.codechef.com/users/"

const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


async function myFunction(username) {
    const htmlScript = await requestLib.getData(url + username, headers)

    await sleep(4000);

    const jsonPattern = /jQuery.extend\(Drupal.settings, ({.*?})\);/

    const match = htmlScript.match(jsonPattern)

    if (match) {
        const jsonString = match[1]
        const jsonData = JSON.parse(jsonString)

        let d = jsonData?.date_versus_rating?.all

        let count = 0
        if (d) {
            for (let data of d) {
                if (data?.penalised_in?.length) count++
            }
        }

        return count
    } else {
        console.log("JSON data not found in the script.")
    }
}

async function getDataOfAllUser() {
    async.eachSeries(
        jsonData,
        async function (user_handle, next) {
            try {
                let count = await myFunction(user_handle.CODECHEF)
                console.log(`${user_handle.CODECHEF},${user_handle["Roll No"]},${count}`)
            } catch (err) {}
        },
        function (err) {
            if (err) {
                console.error("Error:", err)
            } else {
                console.log("All iterations are complete.")
            }
        }
    )
}

getDataOfAllUser()
