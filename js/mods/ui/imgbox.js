/**
 * @fileoverview 接受客户端下载的图片并展示
 * @authors liangdong2 <liangdong2@staff.sina.com.cn>
 */

define('mods/ui/imgbox',function(require,exports,module){

	var $ = require('lib');
	var $htmlRender = require('lib/common/htmlRender');
	var $channelApp = require('mods/channel/app');
	var $bridge = require('mods/bridge/global');

	var UI_NAME = 'ui-imgbox';
	var selector = '[' + UI_NAME + ']';

	var $doc = $(document);

	var uiconf = {
		styleError : 'error',
		styleLoading : 'loading',
		styleErrorSmall : 'C_downloadsmall'
	};

	//依据图片元素查找对应图片盒子元素
	var findImgBox = function(imgNode){
		imgNode = $(imgNode);
		var imgBox;
		if(imgNode.hasAttr(UI_NAME)){
			imgBox = imgNode;
		}else{
			imgBox = imgNode.parents(selector);
		}
		return imgBox;
	};

	//依据图片盒子元素查找对应图片元素
	var findImgNode = function(imgBox){
		imgBox = $(imgBox);
		var imgNode;
		if(
			imgBox.hasAttr('data-src') ||
			imgBox.hasAttr('data-bg')
		){
			imgNode = imgBox;
		}else{
			imgNode = imgBox.find('[data-src]');
			if(!imgNode.length){
				imgNode = imgBox.find('[data-bg]');
			}
		}
		return imgNode;
	};

	//获取图片元素的待下载图片地址
	var getDataSrc = function(imgNode){
		imgNode = $(imgNode);
		var data = {};
		if(imgNode.hasAttr('data-src')){
			data.src = imgNode.attr('data-src');
		}else if(imgNode.hasAttr('data-bg')){
			data.src = imgNode.attr('data-bg');
		}

		if(imgNode.hasAttr('data-gif')){
			data.gif = imgNode.attr('data-gif');
		}
		return data;
	};

	//获取图片元素上的当前图片地址
	var getSrc = function(imgNode){
		imgNode = $(imgNode);
		var src = '';
		if(imgNode.hasAttr('data-src')){
			src = imgNode.get(0).getAttribute('src');
		}else if(imgNode.hasAttr('data-bg')){
			src = imgNode.css('background-image');
		}
		return src;
	};

	//判断是否为一个空的图片盒子
	var isEmptyImgbox = function(imgBox){
		var isEmpty = false;
		var imgNode;
		var src = '';
		if(imgBox.hasAttr(UI_NAME)){
			imgNode = findImgNode(imgBox);
			src = getSrc(imgNode);
			src = src || '';
			src = src.trim();
			if(!src || src === 'none' || (/^\[/).test(src)){
				isEmpty = true;
			}else if(
				imgBox.hasClass(uiconf.styleError) ||
				imgBox.hasClass(uiconf.styleLoading)
			){
				isEmpty = true;
			}
		}
		return isEmpty;
	};

	//对于图片下载完成的处理
	var loadImg = function(rs){
		if(!rs || !rs.target){return;}

		//客户端发送的JSON数据需要有3个属性：target, url, local
		//target为图片的ID或者原始地址
		//url为图片的本地地址
		//local 静态图是否下载成功

		var target = rs.target || '';
		var url = rs.url || '';
		var local = rs.local || '';

		target = target.trim();
		url = url.trim();
		$('[data-src="' + target + '"]').add('[data-bg="' + target + '"]').each(function(){
			var imgNode = $(this);
			var imgBox = findImgBox(imgNode);
			imgBox.removeClass(uiconf.styleLoading);
			if((/\.gif$/).test(url)){
				imgNode.css('height', '');
			}
			//此处主要针对gif无论下载成功与否，都必须隐藏loading图
			imgBox.find('.C_gifloading').hide();
			
			if(url){
				imgNode.css('opacity',1);
				if(imgNode.hasAttr('data-src')){
					imgNode.attr('src', url);
				}else{
					imgNode.css('background-image', 'url(' + url + ')');
				}
				if(local){
					imgNode.attr('data-local','1');
				}
			}else{
				// 清空src，添加加载失败样式
				imgNode.attr('src', '');
				//此处添加透明度，是因为部分android手机设置img src＝“” 的时候，即使设置成功，图片并不消失。
				imgNode.css('opacity',0);
				//此处对大图默认图进行优化
				if(!imgBox.closest('[data-pl="pic"]').hasClass('M_picsmall')){
					var height = imgBox.height();
					if(height > 90){
						imgBox.addClass(uiconf.styleError);
					}else{
						imgBox.addClass(uiconf.styleError);
						imgBox.addClass(uiconf.styleErrorSmall);
					}
				}else{
					imgBox.addClass(uiconf.styleError);
				}
			}
		});
	};

	var setDomEvents = function(){
		$doc.delegate(selector, 'tap', function(evt){
			var imgBox = $(evt.currentTarget);
			if(imgBox.hasClass(uiconf.styleError)){
				imgBox.removeClass(uiconf.styleError).addClass(uiconf.styleLoading);
				var imgNode = findImgNode(imgBox);
				var datasrc = getDataSrc(imgNode);
				if(imgNode.attr('data-local') === '1' && datasrc.gif){
					$bridge.request('loadImg', {
						data : {
							target : datasrc.src,
							gif : datasrc.gif,
							local : 1
						}
					});
				}else{
					$bridge.request('loadImg', {
						data : {
							target : datasrc.src
						}
					});
				}
			}
		});
	};

	$channelApp.on('img-load', function(rs){
		$htmlRender.ready(function(){
			loadImg(rs);
		});
	});

	module.exports = {
		uiname : UI_NAME,
		selector : selector,
		uiconf : uiconf,
		init : function(options){
			$.extend(uiconf, options);
			$htmlRender.ready(function(){
				setDomEvents();
			});
		},
		isEmptyImgbox : isEmptyImgbox,
		findImgBox : findImgBox,
		findImgNode : findImgNode,
		getDataSrc : getDataSrc,
		getSrc : getSrc
	};

});
 