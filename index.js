import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// helper to generate a commit date in a given year
const getCommitDate = (year, x, y) => {
  return moment()
    .year(year)        // fix the year explicitly
    .startOf("year")   // start at Jan 1
    .add(x, "w")       // add random weeks
    .add(y, "d")       // add random days
    .format();
};

const markCommit = (year, x, y) => {
  const date = getCommitDate(year, x, y);

  const data = { date };
  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }).push();
  });
};

const makeCommits = (year, n) => {
  if (n === 0) return simpleGit().push();

  const x = random.int(0, 51); // weeks in a year
  const y = random.int(0, 6);  // days in a week
  const date = getCommitDate(year, x, y);

  const data = { date };
  console.log(date);

  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(date, { "--date": date }, makeCommits.bind(this, year, --n));
  });
};

// Example: 50 commits in 2023, 50 commits in 2024
makeCommits(2021, 50);
makeCommits(2022, 150);
