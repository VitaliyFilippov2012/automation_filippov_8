const PATH = require('path');
const FS = require('fs');

const DIR_PATH = process.argv[2];
const EXPANSION = process.argv[3];
const NUMBER_OUT_FILES = 3;
const NUMBER_DEEP_DIRS = 5;
const CREATION_TIME_DIFFERENCE = 10000;

let files=[];
let sortedFiles =[];

viewInfo();
getFilesWithExpAndDeep(EXPANSION,DIR_PATH,NUMBER_DEEP_DIRS);
sortByTime();
viewFirstNfiles(NUMBER_OUT_FILES);

function viewInfo() {
  console.log("Path: " + DIR_PATH);
  console.log("Expansion: " + EXPANSION);
  console.log("Number out files: " + NUMBER_OUT_FILES);
  console.log("Number deep directory: " + NUMBER_DEEP_DIRS);
}

function getFilesWithExpAndDeep(expansion, dirPath, numberDeepDirs) {
  try{
    let readPaths = FS.readdirSync(dirPath);

    for(let p of readPaths) {
      if ( !FS.statSync( PATH.join(dirPath,p) ).isDirectory() ) {
        if ( PATH.extname(p) === expansion) {
          files.push( PATH.join(dirPath, p) );
        }
      } else{
        if(numberDeepDirs!=0) {
          getFilesWithExpAndDeep(expansion, PATH.join(dirPath,p),numberDeepDirs-1);
        }
      }
    }
  }
  catch(exception) {
    console.log(exception);
  }
}

function sortByTime() {
  let arrayAllFilesTime = [];
  let arrayFilesTime = [];

  for(let file of files) {
    arrayAllFilesTime.push( FS.statSync(file).birthtimeMs );
  }

  arrayAllFilesTime.sort();
  arrayAllFilesTime.reverse();

  let maxTimeFile = arrayAllFilesTime[0];

  for(let elemTime of arrayAllFilesTime) {
    if (maxTimeFile-elemTime < CREATION_TIME_DIFFERENCE) {
      arrayFilesTime.push(elemTime);
    }
  }

  for(let elemTime of arrayFilesTime) {
    for(let file of files) {
      if(elemTime === FS.statSync(file).birthtimeMs) {
        sortedFiles.push(file);
        break;
      }
    }
  }
}

function viewFirstNfiles(n) {
  if(sortedFiles.length > n) {
    let countPop = sortedFiles.length - n;

    for(let i = 0; i < countPop; i++) {
      sortedFiles.pop();
    }
  }

  console.log(sortedFiles);
}
