(function(window){
	function ScrollTop(id){
		this.obj = document.getElementById(id);
		this.timer = null;
		this.init();
	}

	ScrollTop.prototype.init = function(){
		var _this = this;
		this.setTop();
		this.bind(window, 'scroll', function(){
			if(_this.v == 2){
				clearInterval(_this.timer);
			}
			_this.v = 2;
			_this.setTop();
		});
		this.bind(this.obj, 'click', function(){
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
	}

	ScrollTop.prototype.v = 0;

	ScrollTop.prototype.setTop = function(){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		this.obj.style.top = scrollTop + document.documentElement.clientHeight - this.obj.offsetHeight + 'px';
	}
	
	ScrollTop.prototype.bind = function(obj, evname, fn){
		if(obj.addEventListener){
			obj.addEventListener(evname, fn, false);
		}else{
			obj.attachEvent('on'+evname, function(){
				fn.call(obj);
			});
		}
	}

	window.scrollTop = function(id){
		new ScrollTop(id);
	}
})(window);