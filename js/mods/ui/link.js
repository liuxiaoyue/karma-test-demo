/**
 * @fileoverview 链接类型的UI，点击后触发功能
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/ui/link',function(require,exports,module){
	var $ = require('lib');
	var $htmlRender = require('lib/common/htmlRender');
	var $bridge = require('mods/bridge/global');
	var $imgbox = require('mods/ui/imgbox');
	var $propQuery = require('lib/kit/util/propQuery');

	var UI_NAME = 'ui-link';
	var CLICK_TYPE = 'click-type';
	var selector = '[' + UI_NAME + ']';

	var $doc = $(document);
	var uiconf = {};

	var checkTap = function(el){
		var disabled = el.attr('link-status') === 'disabled';
		if(disabled){return;}

		if($imgbox.isEmptyImgbox(el)){
			return;
		}

		var data = el.attr(UI_NAME);
		data = $propQuery.parse(data);

		if(data.offset){
			data.offset = el.offset();
		}
		if(data.pos){
			data.pos = {};
			var pos = el.get(0).getBoundingClientRect();
			//ios8下 pos对象未能正常解析json字符串 所以遍历属性输出值
			['bottom','height','left','right','top','width'].forEach(function(key){
				data.pos[key] = pos[key];
			});
		}

		var method = data.method || 'link';
		delete data.method;

		$bridge.request(method, {
			data : data
		});
	};

	$htmlRender.ready(function(){
		$doc.delegate(selector, 'tap', function(evt){
			var el = $(evt.currentTarget);
			var target = $(evt.target);
			var isUILink = true;
			if(
				(!target.hasAttr(UI_NAME) &&
				target.prop('tagName').toLowerCase() === 'a' &&
				target.attr('href') &&
				!target.hasAttr('disabled'))
			){
				isUILink = false;
			}
			if(isUILink){
				checkTap(el);
			}
		});
	});

	module.exports = {
		uiname : UI_NAME,
		selector : selector,
		init : function(options){
			$.extend(uiconf, options);
		}
	};

});

