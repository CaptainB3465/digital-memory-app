export const withTimeout = (promise, ms, operationName) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${operationName} (Firebase) timed out. Please ensure you have clicked 'Create Database' inside Firestore and 'Get Started' inside Storage in your Firebase Console.`));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
};
