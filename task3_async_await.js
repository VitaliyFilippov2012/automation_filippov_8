const MY_NUMBER = 4;

console.log(`Загадал число: ${MY_NUMBER}`);

async function getRandomNumberWithTimeout() {
  let random_number = Math.trunc(Math.random() * 10);

  let promise = new Promise((resolve, reject) => {
        setTimeout(() => resolve(random_number), 1000)
  });
  
  return await promise;
}

(async() => {
  let random_number = await getRandomNumberWithTimeout();

  my_number == random_number ? console.log(`Угадал ${random_number}`) : 
    console.log(`Проиграаал ты загадал ${random_number} , а я загадал ${my_number}`);
})();


