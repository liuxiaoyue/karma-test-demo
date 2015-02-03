/**
 * @fileoverview 业务内全局广播
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/channel/global',function(require,exports,module){

	var $listener = require('lib/common/listener');
	module.exports = new $listener([
		'notice-audio-pause'
	]);
});
