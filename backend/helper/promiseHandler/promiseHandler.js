export default function promiseHandler(promise) {
    return function (...args) {
      return promise(...args).catch((err) => {
        console.error(err);
        throw err;
      });
    };
  }