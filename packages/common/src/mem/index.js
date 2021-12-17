const { memoryUsage } = require("process");

const getHeadUsedInGB = () => {
  return memoryUsage().heapUsed / 1024 / 1024 / 1024;
};

function exitWhenTooMuchMem(gb = 1) {
  const memUsedInGB = getHeadUsedInGB();
  if (memUsedInGB > gb) {
    console.log(
      `${memUsedInGB}GB heap used, restart process in case of memory leak`
    );
    process.exit(0);
  }
}

module.exports = {
  getHeadUsedInGB,
  exitWhenTooMuchMem,
};
