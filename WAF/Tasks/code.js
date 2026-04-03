console.log("Start");

const promise1 = new Promise((resolve, reject) => {
    console.log("Promise 1 created");
    setTimeout(() => {
        resolve("Promise 1 resolved");
    }, 2000);
});

const promise2 = new Promise((resolve, reject) => {
    console.log("Promise 2 created");
    setTimeout(() => {
        resolve("Promise 2 resolved");
    }, 1000);
});

async function asyncFunction() {
    console.log("Async function started");
    try {
        const result1 = await promise1;
        console.log(result1 + "-sync function");
        const result2 = await promise2;
        console.log(result2 + "-async function");
        setTimeout(() => {
            console.log("Timeout inside async function");
        }, 500);
    } catch (error) {
        console.log("Error:", error);
    }
}

promise1
    .then((result) => {
        console.log(result + "promise chain");
        return promise2;
    })
    .then((result) => {
        console.log(result + "-promise chain");
        setTimeout(() => {
            console.log("Timeout inside promise chain");
        }, 100);
    })
    .catch((error) => {
        console.log("Error:", error);
    });

asyncFunction();
console.log("End");