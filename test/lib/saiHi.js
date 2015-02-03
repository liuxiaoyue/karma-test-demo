lithe.use('lib/kit/arr/contains', function(contains){
	describe('lithe use contains', function(){
		it('array is contain item ', function(){
			contains([1,2,3,4,5],3).should.be.true;
		});
	});
});


