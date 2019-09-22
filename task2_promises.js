let promise_about_js = new Promise(function(resolve, reject) {
  const FIRST_CONDITION = '5' -  3 === 2;
  const SECOND_CONDITION = '5' + 3 === '53';
  const THIRD_CONDITION = '5' + - '2' === '5-2';
    
  if (FIRST_CONDITION && SECOND_CONDITION && THIRD_CONDITION) {
    resolve("i will be a prostitute");
  } else {
    reject("i love JS");
  }
});

promise_about_js.then(function(value) {
  console.log("Mom do not buy me a new computer because ", value);
  }).catch(function(value) {
      console.log("Mom buy me a new computer because ", reason);
    }).finally(function() {
        console.log("I did my best");
    });