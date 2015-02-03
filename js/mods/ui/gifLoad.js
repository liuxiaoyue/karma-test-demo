/**
 * @fileoverview gif图片特殊处理
 * @authors xiaoyue3 <xiaoyue3@staff.sina.com.cn>
 */

define('mods/ui/gifLoad',function(require,exports,module){

	var $ = require('lib');
	var $htmlRender = require('lib/common/htmlRender');
	var $channelGlobal = require('mods/channel/global');
	var $bridge = require('mods/bridge/global');
	var $delay = require('lib/kit/func/delay');
	var $config = window.$CONFIG || {};

	var winHeight = window.innerHeight;
	var compconf = {
		styleError : 'C_download'
	};
	var gifData;
	
	//获取gif图片进入替换的地址
	var getDataSrc = function(imgNode){
		imgNode = $(imgNode);
		var tempData = {};
		if($CONFIG.platform === 'ios' && imgNode.hasAttr('data-src')){
			tempData.enterSrc = imgNode.attr('data-src');
		}

		if($CONFIG.platform === 'android' && imgNode.hasAttr('data-gif')){
			tempData.enterSrc = imgNode.attr('data-gif');
		}

		if(imgNode.hasAttr('data-src')){
			tempData.leaveSrc = imgNode.attr('data-src');
		}

		return tempData;
	};

	function sendGifEnterMessage(data){
		if(data.el.attr('flag') === '0'){
			data.el.attr('flag', '1');
			if($config.osVersion === 1){
				data.icon.hide();
			}else{
				data.icon.addClass('Am_fadeout');
			}
			data.loading.show();
			//此处发消息会有丢失的情况下，主要是由于页面视窗内会有可能两到三张图片，
			//一起发消息，消息密集，由于底层iframe发消息,是以队列的形式发送，会存
			//在消息丢失的可能。现修改底层消息方式发送，改为每次创建iframe发消息即可
			$bridge.request('gifEnterScreen', {
				timeout:30000,
				data : {
					target : data.src.enterSrc,
					//extra此字段android专用 主要是下载gif完成的时候imgload替换静态图 不影响普通图的下载
					extra :data.src.leaveSrc
				}
			});
		}
	}

	function sendGifLeaveMessage(data){
		if(data.el.attr('flag') === '1'){
			data.el.attr('flag', '0');
			if($config.osVersion === 1){
				data.icon.show();
			}else{
				data.icon.removeClass('Am_fadeout');
			}
			data.loading.hide();
			$bridge.request('gifLeaveScreen', {
				data : {
					target : data.src.leaveSrc
				}
			});
		}
	}
	
	function scrollGifLoad(){
		// 滚去的高度
		var sTop = $(window).scrollTop();
		// 窗口的高度
		var iHeight = winHeight;
		gifData.forEach(function(item){
			if(!item.icon.length){
				return;
			}
			//此处计算位置是因为元素相对视窗的位置不断在变化
			var pos = item.el.get(0).getBoundingClientRect();
			if(sTop + iHeight >= item.top){
				if((iHeight - pos.top >0 && pos.bottom - item.height > 0) ||
					(pos.top > - item.height && pos.bottom > 0)
				){
					sendGifEnterMessage(item);
				}else if(pos.top <= -item.height && pos.bottom <=0){
					sendGifLeaveMessage(item);
				}
			}else{
				sendGifLeaveMessage(item);
			}
		});
	}

	function getAllGifData(){
		var gifList = [];
		$('[data-pl="pic"]').each(function(){
			var el = $(this);
			var temp = {};
			temp.el = el;
			temp.img = el.find('img');
			temp.imgbox = el.find('img').parent();
			temp.icon = el.find('span');
			temp.loading = el.find('.C_gifloading');
			temp.src = getDataSrc(temp.img);
			temp.top = el.offset().top;
			temp.height = el.height();
			gifList.push(temp);
		});
		return gifList;
	}

	var buildGifScrollScreenLoad = function(){
		if($('[data-pl="pic"]').find('span').length){
			gifData = getAllGifData();
			scrollGifLoad();
			$(window).on('scroll',scrollGifLoad);
		}
	};
	//发htmlReady事件添加了延时设置，导致gif一进来发消息会在htmlrReady之前，所以此处添加延时。
	setTimeout(function(){
		$htmlRender.ready(buildGifScrollScreenLoad);
	});

	module.exports = {
		init : function(options){
			$.extend(compconf, options);
		}
	};
});
