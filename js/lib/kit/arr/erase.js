/**
 * @fileoverview 删除数组中的对象 
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 * @param {Array} arr 要操作的数组
 * @param {Mixed} item 要清除的对象
 * @return {Number} 对象原本所在位置
 * @example
	var $erase = require('lib/kit/util/erase');
	console.debug($erase([1,2,3,4,5],3));	//[1,2,4,5]
 */

define('lib/kit/arr/erase',function(require,exports,module){

	module.exports = function(arr, item){
		var index = arr.indexOf(item);
		if(index >= 0){ arr.splice(index, 1); }
		return index;
	};

});


