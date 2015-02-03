/**
 * @fileoverview 与客户端交互的广播
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/channel/app',function(require,exports,module){

	var $ = require('lib');
	var $listener = require('lib/common/listener');
	var $bridge = require('mods/bridge/global');

	var clientEventList = [
		//字体字号发生变更
		'font-change',
		//图片加载完成
		'img-load',
		//页面失去焦点
		'page-blur',
		//延迟插入后续内容
		'content-insert',
		//延迟替换后续内容
		'content-load'
	];

	var appListener = new $listener();

	appListener.register = function(localEvent, clientEvent){
		if(!localEvent){return;}
		if(!clientEvent){
			clientEvent = localEvent;
		}
		appListener.define(localEvent);
		$bridge.request('addEventListener', {
			event : clientEvent,
			callback : 'try{window.listener.trigger("' + localEvent + '",[data]);}catch(e){}'
		});
	};

	clientEventList.forEach(function(name){
		appListener.register(name);
	});

	window.listener = appListener;

	module.exports = appListener;

});
