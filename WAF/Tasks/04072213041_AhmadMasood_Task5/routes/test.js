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
        console.log("result1",result1);

        const result2 = await promise2;
        console.log("result2",result2);

        setTimeout(() => {
            console.log("Timeout inside async function");
        }, 500);
    } catch (error) {
        console.log("Error:", error);
    }
}

promise1
    .then((result) => {
        console.log("resultFirstThen",result);
        return promise2;
        
    })
    .then((result) => {
        console.log("resultSecondThen",result);
        setTimeout(() => {
            console.log("Timeoupromise1t inside promise chain");
        }, 1000);
    })
    .catch((error) => {
        console.log("Error:", error);
    });

asyncFunction();

console.log("End");