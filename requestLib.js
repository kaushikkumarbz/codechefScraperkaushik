const request = require('request-promise');



module.exports.getData = async (url, userAgent)=>{

    try {

        // Define optional request options (headers, query parameters, etc.)
        const requestOptions = {
            uri: url,
            method: 'GET',
            headers: {
                'User-Agent': userAgent,
            },
            // Other options like 'qs' (query string parameters), 'json' (parse response as JSON), etc.
        };

        console.log(requestOptions)

        const response = await request(requestOptions);
        return response ;

        // You can process the response here
    } catch (error) {
        console.error(error); // Handle any errors
    }
}