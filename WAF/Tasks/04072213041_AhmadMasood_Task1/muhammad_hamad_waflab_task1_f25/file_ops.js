//PART 01
const { promises } = require("dns");
const fs=require("fs");
// fs.mkdirSync("storage");
const FullName="Muhammad Hamad";
fs.writeFileSync("./storage/info.txt",'')
fs.appendFileSync("./storage/info.txt",FullName)
const data=fs.readFileSync("./storage/info.txt","utf-8")
console.log("Data:",data)
fs.writeFileSync("./storage/info.txt","MH")
const dataUpdated=fs.readFileSync("./storage/info.txt","utf-8")
console.log("Data:",dataUpdated)
fs.writeFileSync("./storage/info.txt","",{ flag: "w" })
fs.appendFileSync("./storage/info.txt",FullName)
//PART 02
// const Mock_Data=JSON.parse(fs.readFileSync("./MOCK_DATA.JSON","utf-8"))
// fs.writeFileSync("com.txt","");
// fs.writeFileSync("org.txt","");
// fs.writeFileSync("edu.txt","");
// fs.writeFileSync("uk.txt","");
// fs.writeFileSync("gov.txt","");
// for (let i = 0; i < Mock_Data.length; i++) {
//   const record = Mock_Data[i];
// if (!record.email || typeof record.email !== "string") continue;
//   const email = record.email.toLowerCase();

//   if (email.endsWith(".com")) {
//     fs.appendFileSync("com.txt", JSON.stringify(record) + "\n");
//   } else if (email.endsWith(".org")) {
//     fs.appendFileSync("org.txt", JSON.stringify(record) + "\n");
//   } else if (email.endsWith(".edu")) {
//     fs.appendFileSync("edu.txt", JSON.stringify(record) + "\n");
//   } else if (email.endsWith(".uk")) {
//     fs.appendFileSync("uk.txt", JSON.stringify(record) + "\n");
//   } else if (email.endsWith(".gov")) {
//     fs.appendFileSync("gov.txt", JSON.stringify(record) + "\n");
//   }
// }
// //PART 03
// function register(callback){
//     setTimeout(()=>{
//         console.log("Register completed")
//         callback()
//     },2500)
// }
// function sendWelcomeMessage(callback){
//     setTimeout(()=>{
//         console.log("Welcome")
//         callback()
//     },3000)
// }
// function login(callback){
//     setTimeout(()=>{
//         console.log("login completed")
//         callback()
//     },2000)
// }
// function fetchProfile(callback){
//     setTimeout(()=>{
//         console.log("fetchProfile completed")
//         callback()
//     },4000)
// }
// function updateStatus(callback){
//     setTimeout(()=>{
//         console.log("updateStatus completed")
//         callback()
//     },1500)
// }
// function logout(callback){
//     setTimeout(()=>{
//         console.log("logout completed")
//         callback()
//     },3500)
// }
// register(()=>{
//     sendWelcomeMessage(()=>{
//         login(()=>{
//             fetchProfile(()=>{
//                 updateStatus(()=>{
//                     logout(()=>{
//                         console.log("All operations finished!")
//                     })
//                 })
//             })
//         })
//     })
// })
// function register() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("Register completed");
//             } else {
//                 rej("Register error");
//             }
//         }, 2500);
//     });
// }

// function sendWelcomeMessage() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("Welcome");
//             } else {
//                 rej("Welcome error");
//             }
//         }, 3000);
//     });
// }

// function login() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("Login completed");
//             } else {
//                 rej("Login error");
//             }
//         }, 2000);
//     });
// }

// function fetchProfile() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("FetchProfile completed");
//             } else {
//                 rej("FetchProfile error");
//             }
//         }, 4000);
//     });
// }

// function updateStatus() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("UpdateStatus completed");
//             } else {
//                 rej("UpdateStatus error");
//             }
//         }, 1500);
//     });
// }

// function logout() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("Logout completed");
//             } else {
//                 rej("Logout error");
//             }
//         }, 3500);
//     });
// }

// register()
//     .then((msg) => {
//         console.log(msg);
//         return sendWelcomeMessage();
//     })
//     .then((msg) => {
//         console.log(msg);
//         return login();
//     })
//     .then((msg) => {
//         console.log(msg);
//         return fetchProfile();
//     })
//     .then((msg) => {
//         console.log(msg);
//         return updateStatus();
//     })
//     .then((msg) => {
//         console.log(msg);
//         return logout();
//     })
//     .then((msg) => {
//         console.log(msg);
//     })
//     .catch((error) => {
//         console.log("Error:", error);
//     })
//     .finally(() => {
//         console.log("All operations finished!");
//     });
// function register() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("Register completed");
//             } else {
//                 rej("Register error");
//             }
//         }, 2500);
//     });
// }

// function sendWelcomeMessage() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("Welcome");
//             } else {
//                 rej("Welcome error");
//             }
//         }, 3000);
//     });
// }

// function login() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("Login completed");
//             } else {
//                 rej("Login error");
//             }
//         }, 2000);
//     });
// }

// function fetchProfile() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("FetchProfile completed");
//             } else {
//                 rej("FetchProfile error");
//             }
//         }, 4000);
//     });
// }

// function updateStatus() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("UpdateStatus completed");
//             } else {
//                 rej("UpdateStatus error");
//             }
//         }, 1500);
//     });
// }

// function logout() {
//     return new Promise((res, rej) => {
//         let flag = true;
//         setTimeout(() => {
//             if (flag) {
//                 res("Logout completed");
//             } else {
//                 rej("Logout error");
//             }
//         }, 3500);
//     });
// }
// async function main() {
//     try{
//         console.log(await register())
//         console.log(await sendWelcomeMessage())
//         console.log(await login())
//         console.log(await fetchProfile())
//         console.log(await updateStatus())
//         console.log(await logout())
//     }catch(error){
//         console.log("Error:", error);
//     }finally{
//         console.log("All operations finished!");
//     }
// }
// main()

//PART 04
const Mock_Data=JSON.parse(fs.readFileSync("./MOCK_DATA.JSON","utf-8"))
fs.writeFileSync("IP_Class_A.txt","");
fs.writeFileSync("IP_Class_B.txt","");
fs.writeFileSync("IP_Class_C.txt","");
fs.writeFileSync("IP_Class_D.txt","");
fs.writeFileSync("IP_Class_E.txt","");
function IPClass(IP){
    const check=parseInt(IP.split(".")[0]);

    if (check >= 1 && check <= 126) return "A";
    else if (check >= 128 && check <= 191) return "B";
    else if (check >= 192 && check <= 223) return "C";
    else if (check >= 224 && check <= 239) return "D";
    else if (check >= 240 && check <= 255) return "E";
    else return null;
}
Mock_Data.forEach(record => {
    if(!record.ip_address) return;
    const ipClass = IPClass(record.ip_address);
    if (ipClass) {
        fs.appendFileSync(`IP_Class_${ipClass}.txt`, JSON.stringify(record) + "\n");
    }
});