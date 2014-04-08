(function(window){
	var toTop = document.getElementById('toTop');
	var iTimer = null;
	var v = 0;

	setTop();

	window.onscroll = function(){

		if(v == 2){
			clearInterval(iTimer);
		}
		v = 2;
		setTop();
	};

	toTop.onclick = function(){
		clearInterval(iTimer);
		var iCur = 0;
		var iSpeed = 0;

		iTimer = setInterval(function(){
			iCur = document.documentElement.scrollTop || document.body.scrollTop;
			iSpeed = Math.floor((0 - iCur)/8);

			if(iCur == 0){
				clearInterval(iTimer);
			}else{
				document.documentElement.scrollTop = document.body.scrollTop = iCur + iSpeed;
			}
			
			v = 1;

		},30);

	};

	function setTop(){
		var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

		toTop.style.top = scrollTop + document.documentElement.clientHeight - toTop.offsetHeight + 'px';
	}
})(window);