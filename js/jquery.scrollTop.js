(function($){
	function ScrollTop(elem){
		this.elem = elem;
		this.timer = null;
		this.init();
	}

	ScrollTop.prototype.init = function(){
		var _this = this;

		this.getElem().on('scrollTop', function(){
			$(window).on('scroll', function(){
				if(_this.v == 2){
					clearInterval(_this.timer);
				}
				_this.v = 2;
			});
			_this.getElem().on('click', function(){
				clearInterval(_this.timer);
				var iCur = 0;
				var iSpeed = 0;

				_this.timer = setInterval(function(){
					iCur = document.documentElement.scrollTop || document.body.scrollTop;
					iSpeed = Math.floor((0 - iCur)/8);

					if(iCur == 0){
						clearInterval(_this.timer);
					}else{
						document.documentElement.scrollTop = document.body.scrollTop = iCur + iSpeed;
					}
					_this.v = 1;

				},30);
			});
		});
	};

	ScrollTop.prototype.v = 0;
	ScrollTop.prototype.getElem = function(){
		return this.elem;
	}
	
	$.fn.extend({
		scrollTop: function(){
			return this.each(function() {
				var elem = $(this);
				var scrollTop = new ScrollTop(elem);
				scrollTop.getElem().trigger('scrollTop');
			});
		}
	});
})(jQuery);