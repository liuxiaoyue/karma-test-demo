/**
 * @fileoverview 文字区块高度限制
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/ui/textlimit',function(require,exports,module){

	var $ = require('lib');
	var $htmlRender = require('lib/common/htmlRender');

	var UI_NAME = 'ui-textlimit';
	var selector = '[' + UI_NAME + ']';

	var uiconf = {};

	var limitText = function(options){
		var conf = $.extend({
			root : null,
			box : null,
			text : null,
			extra : '...'
		}, options);

		var root = $(conf.root);
		var box = root.find(conf.box);
		var text = root.find(conf.text);

		if(box.length === 0){
			box = root;
		}
		if(text.length === 0){
			text = box;
		}

		// 此处需要提前设置节点高度
		if(conf.deepRead){
			var titleHeight = box.prev().height();
			var compHeight = box.closest('ul').height();
			var compPadding = parseInt(box.closest('.M_depth').css('padding-top'), 10);
			box.css('height', compHeight - compPadding*2 - titleHeight);
		}
		
		var boxNode = box.get(0);
		var textNode = text.get(0);
		var height = box.height();
		var str = text.html();

		var nodesCache = (function(){
			var nodes = [];
			var node = textNode;
			var height;
			while(node.parentNode && node !== boxNode){
				height = $(node).css('height');
				if(height !== 'auto'){
					nodes.push({
						height : height,
						node : node
					});
				}
				node = node.parentNode;
			}
			return nodes;
		})();

		//放开父元素的高度
		nodesCache.forEach(function(item){
			$(item.node).css('height', 'auto');
		});
		var count = str.length;
		if(boxNode.scrollHeight > height){
			//用二分法截取字符串
			var unit = 32;
			var index = 0;
			while((unit > 1) || (boxNode.scrollHeight > height)){
				if(boxNode.scrollHeight > height){
					count = count - unit;
				}else{
					unit = unit / 2;
					count = count + unit;
				}
				if(conf.deepRead){
					text.html(str.slice(0, count) + conf.extra +conf.deepRead);
				}else{
					text.html(str.slice(0, count) + conf.extra);
				}
				index ++;
			}
		}else{
			if(conf.deepRead){
				text.html( text.html() + conf.deepRead);
			}
		}

		
		//部分android手机上，未能在循环文字更新后更新scrollHeight值
		//检测发现用计时器打断后可以得到正确的高度，因此在最后阶段使用计时器来循环检测文本内容是否超出区域
		//部分android手机，如果初次timeout设置太短，依然无法取得正确的scrollHeight值
		setTimeout(function(){
			if(boxNode.scrollHeight > height){
				count = count - 1;
				if(conf.deepRead){
					text.html(str.slice(0, count) +conf.extra + conf.deepRead);
				}else{
					text.html(str.slice(0, count) +conf.extra);
				}
				setTimeout(arguments.callee, 10);
			}else{
				//重置父元素的高度
				nodesCache.forEach(function(item){
					$(item.node).css('height', '');
				});
			}
		}, 100);
	};

	var buildTextLimit = function(){
		$(selector).each(function(){
			//此组件 只有深度阅读和微博组 两个组件再用 截取文字上有区别，以deepRead标志做区分，请注意！
			var deepReadFlag = $(this).closest('.M_grouptxt').attr('data-pl') === 'deep_read_module';
			var deepExtra = '';
			if(deepReadFlag){
				deepExtra = '<span>查看详情&gt;&gt;</span>';
			}
			limitText({
				root : this,
				box : '[textlimit-role="box"]',
				text : '[textlimit-role="text"]',
				deepRead : deepExtra
			});
		});
	};
	
	$htmlRender.ready(buildTextLimit);

	module.exports = {
		init : function(options){
			$.extend(uiconf, options);
		}
	};

});

