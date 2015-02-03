describe('karma tests with should', function(){
	
	it('test zepto lithe', function(done){
		lithe.use('conf/global', function(){
			var el = $('<div id="b">111</div>');
			$('body').append(el);
			$('#b').text().should.equal("111");
			done();
		});
	});
	
});
