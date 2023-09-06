
const http = require("http");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");

const server = http.createServer((request, response) => {
    if (request.url === "/" && request.method === "GET") {

        fs.readFile(path.join(__dirname, "index.html"), "utf8", (err, data) => {
            if (err) {
                response.writeHead(500, { "content-type": "text/plain" });
                response.end("Internal Server Error");
                console.error(err);
            } else {
                response.writeHead(200, { "content-type": "text/html" });
                response.end(data);
            }
        });
    } else if (request.url === "/submit" && request.method === "POST") {
        let body = "";

        request.on("data", (chunk) => {
            body += chunk;
        });

        request.on("end", () => {
            const formData = qs.parse(body);

            fs.readFile(path.join(__dirname, "hs.json"), "utf8", (err, existingData) => {
                if (err) {
                    console.error(err);
                    response.writeHead(500, { "content-type": "text/plain" });
                    response.end("Internal Server Error");
                } else {
                    let existingDataArray = [];

                    try {
                        existingDataArray = JSON.parse(existingData);
                        if (!Array.isArray(existingDataArray)) {
                            existingDataArray = [];
                        }
                    } catch (parseError) {
                        existingDataArray = [];
                    }

                    existingDataArray.push({
                        name: formData.name,
                        email: formData.email,
                        age: formData.age,
                        id: formData.id,
                    });

                    fs.writeFile(
                        path.join(__dirname, "hs.json"),
                        JSON.stringify(existingDataArray, null, 2),
                        (err) => {
                            if (err) {
                                response.writeHead(500, { "content-type": "text/plain" });
                                response.end("Internal Server Error");
                                console.error(err);
                            } else {
                                response.writeHead(302, { "Location": "/data", "Content-Type": "text/plain" });
                                response.end("Data successfully stored. Redirecting...");

                            }
                        }
                    );
                }
            });
        });
    } else if (request.url === "/data" && request.method === "GET") {
        
        fs.readFile(path.join(__dirname, "display.html"), "utf8", (err, data) => {
            if (err) {
                response.writeHead(500, { "content-type": "text/plain" });
                response.end("Internal Server Error");
                console.error(err);
            } else {
                response.writeHead(200, { "content-type": "text/html" });
                response.end(data);
            }
        });
    }
    else if (request.url === "/fetchData.js" && request.method === "GET") {

        fs.readFile(path.join(__dirname, "hs.json"), "utf8", (err, data) => {
            if (err) {
                response.writeHead(500, { "content-type": "text/plain" });
                response.end("Internal Server Error");
                console.error(err);
            } else {
                response.writeHead(200, { "content-type": "text/html" });
                response.end(data);
            }
        })

    }
   

// ***** delete data
else if (request.url.startsWith("/delete") && request.method === "DELETE") {
    const itemId = request.url.split("/")[2];

    fs.readFile(path.join(__dirname, "hs.json"), "utf8", (err, data) => {
        if (err) {
            response.writeHead(500, { "content-type": "text/plain" });
            response.end("Internal Server Error");
            console.error(err);
        } else {
            let existingDataArray = [];

            try {
                existingDataArray = JSON.parse(data);
                if (!Array.isArray(existingDataArray)) {
                    existingDataArray = [];
                }
            } catch (parseError) {
                existingDataArray = [];
            }

       
            const index = existingDataArray.findIndex((item) => item.name === itemId);
            if (index !== -1) {
                existingDataArray.splice(index, 1);

                fs.writeFile(
                    path.join(__dirname, "hs.json"),
                    JSON.stringify(existingDataArray, null, 2),
                    (err) => {
                        if (err) {
                            response.writeHead(500, { "content-type": "text/plain" });
                            response.end("Internal Server Error");
                            console.error(err);
                        } else {
                            response.writeHead(200, { "content-type": "text/plain" });
                            response.end("Data successfully deleted.");
                        }
                    }
                );
            } else {
                response.writeHead(404, { "content-type": "text/plain" });
                response.end("Data not found");
            }
        }
    });
}


// *****update data


else if (request.url.startsWith("/update/") && request.method === "PUT") {
    const itemId = request.url.split("/")[2];

    let body = "";

    request.on("data", (chunk) => {
        body += chunk;
    });

    request.on("end", () => {
        const updatedData = JSON.parse(body);

        fs.readFile(path.join(__dirname, "hs.json"), "utf8", (err, data) => {
            if (err) {
                response.writeHead(500, { "content-type": "text/plain" });
                response.end("Internal Server Error");
                console.error(err);
            } else {
                let existingDataArray = [];

                try {
                    existingDataArray = JSON.parse(data);
                    if (!Array.isArray(existingDataArray)) {
                        existingDataArray = [];
                    }
                } catch (parseError) {
                    existingDataArray = [];
                }

             
                const itemIndex = existingDataArray.findIndex((item) => item.id === itemId);
                if (itemIndex !== -1) {
                    existingDataArray[itemIndex].name = updatedData.name;
                    existingDataArray[itemIndex].email = updatedData.email;
                    existingDataArray[itemIndex].age = updatedData.age;

                    fs.writeFile(
                        path.join(__dirname, "hs.json"),
                        JSON.stringify(existingDataArray, null, 2),
                        (err) => {
                            if (err) {
                                response.writeHead(500, { "content-type": "text/plain" });
                                response.end("Internal Server Error");
                                console.error(err);
                            } else {
                                response.writeHead(200, { "content-type": "text/plain" });
                                response.end("Data successfully updated.");
                            }
                        }
                    );
                } else {
                    response.writeHead(404, { "content-type": "text/plain" });
                    response.end("Data not found");
                }
            }
        });
    });
}
  
    
    else {
        response.writeHead(404, { "content-type": "text/plain" });
        response.end("Page not found");
    }
});

server.listen(3002, () => {
    console.log("Server is listening on port 3002");
});

// alert("hello")



