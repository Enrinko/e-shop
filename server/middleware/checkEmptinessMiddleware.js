const _ = require('lodash');
const nodeConsole = require('node:console');

class CheckEmptinessMiddleware {
  async removeEmptyFromStringArray (arr) {
    return await arr.reduce(async (prevItem, thisItem, index, temp_res) => {
      if (thisItem.length === 0) {
        nodeConsole.log('SUCK');
         _.remove(temp_res, (item) => {
           return _.isEqual(item, thisItem);
         });
      }
      return _.uniq(temp_res);
    }, []);
  }
  
  async removeEmptyFromObjectArray (arr) {
    return await arr.reduce(async (prevItem, thisItem, index, temp_res) => {
      let checkedObject = {};
      _.forOwn(thisItem, (value, key) => {
        if (value.length !== 0) {
          checkedObject[key] = value;
        }
      });
      console.log(temp_res.indexOf(thisItem));
      if (!_.isEqual(thisItem, checkedObject)) {
        console.log("SUCK");
        _.remove(temp_res, (item) => {
          return _.isEqual(item, thisItem);
        });
      }
      return _.uniqBy(temp_res, 'id');
    }, []);
  }
}

module.exports = new CheckEmptinessMiddleware();