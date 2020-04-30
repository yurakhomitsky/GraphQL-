export const TASKS = [
    { id: "1", name: "Work", completed: false, userId: "3" },
    { id: "2", name: "Ead", completed: true, userId: "1" },
    { id: "3", name: "Shopping", completed: true, userId: "4" },
    { id: "4", name: "Gym", completed: true, userId: "2" },
];
export const USERS = [
    { id: "1", name: "Yura", email: "kevin@gmail.com" },
    { id: "2", name: "Roman", email: "roman@gmail.com" },
    { id: "3", name: "John", email: "john@gmail.com" },
    { id: "4", name: "Bob", email: "bob@gmail.com" },
]

export default {TASKS, USERS};


// (async function () {
//   console.log(await promiseHandler(fetchData)('Yura'));
//   console.log(await promiseHandler(fetchData)('Roman'));
//   console.log(await promiseHandler(fetchData)('Luyda'));
// })();
// function fetchData(name) {
//   return new Promise((resolve, reject) => {
//     if (name == 'Roman') {
//       reject('Йуй ти ромку');
//     }
//     setTimeout(() => {
//       resolve(`Data ready for ${name} `);
//     }, 1000);
//   });
// }


