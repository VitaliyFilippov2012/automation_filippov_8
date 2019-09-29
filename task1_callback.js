const MILLISECONDS_PER_YEAR = 1000 * 60 * 60 * 24 * 365;

function getMyAge(birthdayDate, callback) {
  let time_diff = Math.abs( Date.now() - birthdayDate.getTime() );
  let age = Math.trunc(time_diff/MILLISECONDS_PER_YEAR);

  callback(age);
}

getMyAge(new Date(2000,2,23), age => console.log(`I'm ${age} years old.`));