const cheerio = require("cheerio")
const requestLib = require("./requestLib")
const fs = require("fs")
const jsonData = require("./one.json")
const async = require("async")
console.log(jsonData)

let url = "https://www.codechef.com/recent/user?page=0&user_handle="

const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36",
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function myFunction(username) {
    try {
        const htmlContent = await requestLib.getData(url + username, headers)

        // Define a regular expression to match the "max_page" attribute and its value
        const regex = /max_page":(\d+)/
        const match = htmlContent.match(regex)
        let maxPageValue = 0

        if (match) {
            maxPageValue = parseInt(match[1])
        } else {
        }

        let submissionCount = 0
        let flag = false

        for (let i = 0; i < maxPageValue; i++) {
            if (flag) return submissionCount

            let url = `https://www.codechef.com/recent/user?page=${i}&user_handle=${username}`
            const htmlContent = await requestLib.getData(url, headers)

            // Load the HTML content into Cheerio
            const $ = cheerio.load(JSON.parse(htmlContent).content)

            // Select the table rows containing submission information
            const submissionRows = $("table.dataTable tbody tr")

            // Initialize a count for submissions

            // Iterate through each row and check if it contains submission data
            submissionRows.each((index, row) => {
                const timeCell = $(row).find("td:nth-child(1) span.tooltiptext").text()
                const resultCell = $(row).find('td:nth-child(3) span[title="accepted"]').length > 0 ? "Accepted" : "Not Accepted"

                const [, , datePart] = timeCell.split(" ")
                // Split the date part into day and month
                const [day, month] = datePart.split("/").map(Number)


                // console.log(day, month, resultCell);

                if (month >= 10 && day >= 23) {

                    if (resultCell == "Accepted" && !flag){
                        submissionCount += 1
                        // console.log("increment")
                   }

                    // console.log("accepted")

                } else {
                    // console.log("mark true")
                    flag = true
                    return submissionCount
                }
            })
            if (flag) return submissionCount
            console.log("submissioncount", submissionCount)
        }

        return submissionCount
    } catch (error) {
        console.log("ERROR", error)
    }
}

async function getDataOfAllUser() {
    async.eachSeries(
        jsonData,
        async function (user_handle, next) {
            try {
                await sleep(10000)
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
