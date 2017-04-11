function d(msg){
	console.log(msg);
	console.log("----------------------------------------------------");
}


function networkJson(url, result){
	var targetUrl = "";

	if(url.indexOf("https") == -1){
		targetUrl = DOMAIN_URL + url;
	}else{
		targetUrl = url;
	}

	d("URL : " + targetUrl);

	$.getJSON(targetUrl, result);
}

function encode(txt){
	return encodeURIComponent(txt);
}

function getMainImage(imageTxtArr){
	if(imageTxtArr.length > 0){
		var imgArr = imageTxtArr.split("||");

		// d("imgArr.length : " + imgArr.length);
		// $.each(imgArr, function(idx, value){
		// 	d(idx+" : " + value);
		// });

		if(imgArr.length > 0){
			if(imgArr[1].length == 0){
				return imgArr[0];
			}else{
				return imgArr[1];
			}
		}else{
			return imgArr[0];
		}
	}else{
		return "";
	}
}

function alert(msg){
	$("#alert").html(msg);
	$("#alert").fadeIn(500).delay(1000).fadeOut(500);
}