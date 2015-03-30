(function($){
	$.fn.html5uploader = function(opts){
		var defaults = {
			fileTypeExts:'*.*',//允许上传的文件类型，格式'*.jpg;*.doc'
			uploader:'',//文件提交的地址
			auto:false,//是否开启自动上传
			method:'post',//发送请求的方式，get或post
			multi:true,//是否允许选择多个文件
			formData:null,//发送给服务端的参数，格式：{key1:value1,key2:value2}
			fileObjName:'file',//在后端接受文件的参数名称，如PHP中的$_FILES['file']
			fileSizeLimit:2048,//允许上传的文件大小，单位KB
			buttonText:'选择文件',//上传按钮上的文字
		}

		var option = $.extend(defaults,opts);

		//定义一个通用函数集合
		var F = {
			//将文件的单位由bytes转换为KB或MB，若第二个参数指定为true，则永远转换为KB
			formatFileSize : function(size,withKB){
				if (size > 1024 * 1024 && !withKB){
					size = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
				}
				else{
					size = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
				}
				return size;
			},
			//将输入的文件类型字符串转化为数组,原格式为*.jpg;*.png
			getFileTypes : function(str){
				var result = [];
				var arr1 = str.split(";");
				for(var i=0, len=arr1.length; i<len; i++){
					result.push(arr1[i].split(".").pop());
				}
				return result;
			},
			//根据文件序号获取文件
			getFile : function(index,files){
				for(var i=0;i<files.length;i++){	   
					if(files[i].index == index){
						return files[i];
					}
				}
				return null;
			}
		};

		this.each(function(index, element){
			var _this = $(element);
			var instanceNumber = $('.uploadify').length+1;
			var uploadManager = {
				container : _this,
				filteredFiles : [],//过滤后的文件数组
				init : function(){

					var inputStr = '<input id="select_btn_'+instanceNumber+'" class="selectbtn" style="display:none;" type="file" name="fileselect[]"';
					inputStr += option.multi ? ' multiple' : '';
					inputStr += ' accept="';
					inputStr += F.getFileTypes(option.fileTypeExts).join(",");
					inputStr += '"/>';
					inputStr += '<a id="file_upload_'+instanceNumber+'-button" href="javascript:void(0)" class="uploadify-button">';
					inputStr += option.buttonText;
					inputStr += '</a>';
					var uploadFileListStr = '<div id="file_upload_'+instanceNumber+'-queue" class="uploadify-queue"></div>';
					_this.append(inputStr+uploadFileListStr);

					//初始化选择按钮事件
					var fileInput = this._getInputBtn();
				  	if (fileInput.length>0) {
						fileInput.change(function(e) { 
							uploadManager._getFiles(e); 
					 	});	
				 	}
				  
					//点击选择文件按钮时触发file的click事件
					_this.find('.uploadify-button').on('click',function(){
						_this.find('.selectbtn').trigger('click');
					});
				  
				},
				_filter: function(files) {		//选择文件组的过滤方法
					var arr = [];
					var typeArray = F.getFileTypes(option.fileTypeExts);
					if(typeArray.length>0){
						for(var i=0,len=files.length;i<len;i++){
							var f = files[i];
							if(parseInt(F.formatFileSize(f.size,true))<=option.fileSizeLimit){
								if($.inArray('*',typeArray)>=0 || $.inArray(f.name.split('.').pop(),typeArray)>=0){
									arr.push(f);
								}
								else{
									alert('文件 "'+f.name+'" 类型不允许！');
								}
							}
							else{
								alert('文件 "'+f.name+'" 大小超出限制！');
								continue;
							}
						}
					}
					return arr;
				},
				_getInputBtn : function(){
					return _this.find('.selectbtn');
				},
				_getFileList : function(){
					return _this.find('.uploadify-queue');
				},
				//根据选择的文件，渲染DOM节点
				_renderFile : function(file){
					var $html = $('<div id="fileupload_'+instanceNumber+'_'+file.index+'" class="uploadify-queue-item"><div class="uploadify-progress"><div class="uploadify-progress-bar"></div></div><span class="up_filename">'+file.name+'</span><a href="javascript:void(0);" class="uploadbtn">上传</a><a href="javascript:void(0);" class="delfilebtn">删除</a></div>');
					//如果是非自动上传，显示上传按钮
					if(!option.auto){
						$html.find('.uploadbtn').css('display','inline-block');
					}

					//预览图片
					if(file.type.indexOf('image')>=0){
						var reader = new FileReader();
						reader.onload = function(e){
							var imgData = e.target.result,
								img = $('<div class="imageview"><img src="'+imgData+'" /></div>');
							$html.prepend(img);
						}
						reader.readAsDataURL(file);	
					}

					uploadManager._getFileList().append($html);

					//判断是否是自动上传
					if(option.auto){
						uploadManager._uploadFile(file);
					}
					else{
						//如果配置非自动上传，绑定上传事件
					 	$html.find('.uploadbtn').on('click',function(){
					 		if(!$(this).hasClass('.disabledbtn')){
					 			$(this).addClass('.disabledbtn');
					 			uploadManager._uploadFile(file);
					 		}
				 		});
					}

					//为删除文件按钮绑定删除文件事件
			 		$html.find('.delfilebtn').on('click',function(){
			 			if(!$(this).hasClass('.disabledbtn')){
					 		$(this).addClass('.disabledbtn');
			 				uploadManager._deleteFile(file);
			 			}
			 		});
				},
				//获取选择后的文件
				_getFiles : function(e){
			  		var files = e.target.files;
			  		files = uploadManager._filter(files);
			  		var fileCount = _this.find('.uploadify-queue .uploadify-queue-item').length;//队列中已经有的文件个数
		  			for(var i=0,len=files.length;i<len;i++){
		  				files[i].index = ++fileCount;
		  				files[i].status = 0;//标记为未开始上传
		  				uploadManager.filteredFiles.push(files[i]);
		  				var l = uploadManager.filteredFiles.length;
		  				uploadManager._renderFile(uploadManager.filteredFiles[l-1]);
		  			}
				},
				//删除文件
				_deleteFile : function(file){
					for (var i = 0,len=uploadManager.filteredFiles.length; i<len; i++) {
						var f = uploadManager.filteredFiles[i];
						if (f.index == file.index) {
							uploadManager.filteredFiles.splice(i,1);
							_this.find('#fileupload_'+instanceNumber+'_'+file.index).fadeOut();
							break;
						}
			  		}
				},
				//校正上传完成后的进度条误差
				_regulateView : function(file){
					var thisfile = _this.find('#fileupload_'+instanceNumber+'_'+file.index);
					thisfile.find('.uploadify-progress-bar').css('width','100%');
				},
				onProgress : function(file, loaded, total) {
					var eleProgress = _this.find('#fileupload_'+instanceNumber+'_'+file.index+' .uploadify-progress');
					var percent = (loaded / total * 100).toFixed(2) +'%';
					eleProgress.children('.uploadify-progress-bar').css('width',percent);
			  	},
			  	_uploadFile : function(file){
					var xhr = null;
					try{
						xhr=new XMLHttpRequest();
					}catch(e){	  
						xhr=ActiveXobject("Msxml12.XMLHTTP");
				  	}
				  	if(xhr.upload){
				  		// 上传中
					  	xhr.upload.onprogress = function(e) {
							uploadManager.onProgress(file, e.loaded, e.total);
						};

						xhr.onreadystatechange = function(e) {
							if(xhr.readyState == 4){
								if(xhr.status == 200){
									uploadManager._regulateView(file);
									file.status = 2;//标记为上传成功
									
									//在指定的间隔时间后删掉进度条
									setTimeout(function(){
										_this.find('#fileupload_'+instanceNumber+'_'+file.index).fadeOut();
									},option.removeTimeout);
								}
								else {
									file.status = 3;//标记为上传失败	
								}
								
								//清除文件选择框中的已有值
								uploadManager._getInputBtn().val('');
							}
						}

						if(file.status===0){
							file.status = 1;//标记为正在上传
							
							// 开始上传
							xhr.open(option.method, option.uploader, true);
							//xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
							var fd = new FormData();
							fd.append(option.fileObjName,file);
							if(option.formData){
							 	for(key in option.formData){
							  		fd.append(key,option.formData[key]);
							  	}
							}
							xhr.send(fd);
						}
						
				  	}
				}
			}
			uploadManager.init();
		});

	}
})(jQuery);