const MY_NUMBER = 4;


async function getRandomNumberWithTimeout() {
  const random_number = Math.trunc( Math.random() * 5 );

  const promise = new Promise((resolve, reject) => {
      setTimeout(() => resolve(random_number), 1000)
    });
  
  return await promise;
}



let promise_about_js = new Promise(function(resolve, reject) {
  let result_compare = (async() => {
    let random_number = await getRandomNumberWithTimeout();
    
    MY_NUMBER === random_number ? resolve(random_number) : reject(random_number);   
  })();
  
  result_compare.finally((value) => value === MY_NUMBER ? resolve(value): reject(value));
});

promise_about_js.then(function(value) {
  console.log("Угадал: ", value);
  }).catch(function(value) {
      console.log(`Не угадал. Я загадывал ${my_number}, а не ${value}`);
    }).finally(function() {
        console.log("I did my best");
    });








