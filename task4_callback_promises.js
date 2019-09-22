const MILLISECONDS_PER_YEAR = 1000 * 60 * 60 * 24 * 365;

function getMyAge(birthdayDate,callback) {
  let time_diff = Math.abs( Date.now() - birthdayDate.getTime() );
  let age = Math.trunc(time_diff/MILLISECONDS_PER_YEAR);

  callback(age);
}

getMyAge(new Date(2002,02,23), function(age) {
  let about_my_age = new Promise(function(resolve, reject) {
    if (age < 18) {
      resolve("tenageer");
    } else {
      reject("man");
    }
  });

about_my_age.then(function(value) {
  console.log("Mom doesn't let me drink beer with friends because i'm", value);
  }).catch(function(value) {
      console.log("I drink beer with friends because I'm a ", value);
    }).finally(function() {
        console.log("And mother will not know :)");
    });
});
  