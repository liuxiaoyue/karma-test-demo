/**
 * @fileoverview 幻灯组件
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/ui/slides',function(require,exports,module){

	var $ = require('lib');
	var $htmlRender = require('lib/common/htmlRender');
	var $iScroll = require('vendor/iscroll4');

	var UI_NAME = 'ui-slides';
	var selector = '[' + UI_NAME + ']';

	var uiconf = {};

	var createIScroll = function(box){

		var links = box.find('[ui-link]');

		//scroller高度为0时，会导致 chrome 的 transition 动画无法执行。
		//因此加上最小1像素的高度。
		var scroller = $(box.children().get(0));
		scroller.css('min-height', '1px');

		//目前使用的幻灯，marginLeft和marginRight不一致
		//为了能够让幻灯运行到末尾时，与右边对齐，需要设置两边margin一致
		//由于使用了百分比适配页面宽度，所以需要再计算px单位宽度，避免设置父元素margin时引发幻灯宽度变化
		var ul = box.find('ul');
		var li = box.find('li');
		var itemWidth = li.width();
		li.css('width', itemWidth + 'px');
		ul.css('width', itemWidth * li.length + 'px');

		var marginLeft = parseInt(box.css('margin-left'), 10);
		var marginRight = parseInt(box.css('margin-right'), 10);
		var margin = Math.min(marginLeft, marginRight);
		box.css('margin-left', margin + 'px');
		box.css('margin-right', margin + 'px');

		new $iScroll(box.get(0), {
			hScroll: true,
			vScroll: false,
			momentum: false,
			hScrollbar: false,
			vScrollbar: false,
			snap: 'li',
			overflow : '',
			onBeforeScrollEnd : function(){
				if(this.moved){
					this.enabled = false;
					links.attr('link-status', 'disabled');
				}
			},
			onScrollEnd : function(){
				links.attr('link-status', '');
				this.enabled = true;
			}
		});

	};

	var buildSlides = function(){
		$(selector).each(function(){
			createIScroll($(this));
		});
	};

	$htmlRender.ready(buildSlides);

	module.exports = {
		init : function(options){
			$.extend(uiconf, options);
		}
	};

});


