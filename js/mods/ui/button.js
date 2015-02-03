/**
 * @fileoverview 按钮类型的UI，带有active状态
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/ui/button',function(require,exports,module){

	var $ = require('lib');
	var $doc = $(document);

	var UI_NAME = 'ui-button';
	var selector = '[' + UI_NAME + ']';

	var uiconf = {};

	$doc.delegate(selector, 'touchstart', function(evt){
		$(evt.currentTarget).addClass('active');
	});

	$doc.delegate(selector, 'touchend', function(evt){
		$(evt.currentTarget).removeClass('active');
	});

	$doc.delegate(selector, 'touchmove', function(evt){
		$(evt.currentTarget).removeClass('active');
	});

	module.exports = {
		init : function(options){
			$.extend(uiconf, options);
		}
	};

});

