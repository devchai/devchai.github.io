var FeedAdmin = function(){
	this.mQueryBaseLoad = "select * from feed where TRIM(IFNULL(IMAGE, '')) > '' " 
		+" AND TYPE LIKE 'NORMAL' "
		+" AND FEED_UNLIKE < 11"
		+" AND VISIBLE LIKE 'Y' "
		+" #next_time_stamp#"
		+" #search#"
		+" ORDER BY INSERT_TIME DESC limit 0, 100";


	this.mQueryDisable = "update feed set VISIBLE = 'N' where INSERT_TIME = ";

	this.mQuerySpamImage = "update crawler set escape_image_url = concat(escape_image_url, '#spam_url#||') where domain like '#domain#'";

	this.mQueryModifyMainImage = "update feed set main_image = '#image_src#' where INSERT_TIME = ";	

	this.mQueryDomainList = ""
	+ "SELECT DISTINCT `DOMAIN`, `DOMAIN_TITLE`, `DOMAIN_ICON_IMAGE`, `TYPE` FROM `feed` " 
				+ "WHERE VISIBLE LIKE 'Y' "
				+ "AND TYPE LIKE 'NORMAL' "
				+ "  GROUP BY DOMAIN "
				+ "ORDER BY INSERT_TIME DESC "; 

	this.mQueryInsertTag = "UPDATE `feed` SET `TAG` = concat(`TAG`, '#tag_name#') where `INSERT_TIME` = ";	


	this.mHtmlSearchBar = ''
		+'<div>'
		    +'<div class="input-group">'
		      +'<input id="search_input" type="text" class="form-control" placeholder="Search for...">'
		      +'<span class="input-group-btn">'
		        +'<button id="search_btn" class="btn btn-default" type="button">Go!</button>'
		      +'</span>'
		    +'</div>'
		  +'</div><br></br><br></br>';


	this.mHtmlDomainListContainer = "<div id='domain_container'></div>";

	this.mHtmlDomainListBtn = '<button type="button" class="btn btn-primary">#domain_title#</button>&nbsp;&nbsp;&nbsp;&nbsp;';


	this.mTimestamp = 0;
	this.mSearchKeyword = "";
	this.mTagList = [];
}

FeedAdmin.prototype.init = function(){
	$(CONTAINER_EL).html("");

	this.draw();
	this.addEventListener(); 
	this.loadDomainList();
	this.loadTagList();
}

FeedAdmin.prototype.draw = function(){
	$(CONTAINER_EL).append(this.mHtmlSearchBar);
	$(CONTAINER_EL).append(this.mHtmlDomainListContainer);
}

FeedAdmin.prototype.addEventListener = function(){
	$("#search_btn").click(function(e){
		e.preventDefault();
		FeedAdmin.prototype.onClickSearchButton();
	});
}


/*
--------------------------------------------------------------------------------------------------------------
Process Method
--------------------------------------------------------------------------------------------------------------
*/
FeedAdmin.prototype.loadData = function(targetQuery, timestamp, searchKeyword){
	feedAdmin.init();

	var query = targetQuery;

	if(timestamp > 0){
		query = query.replace("#next_time_stamp#", "AND INSERT_TIME < "+timestamp);
	}else{
		query = query.replace("#next_time_stamp#", "");
	}


	if(searchKeyword.length > 0){
		query = query.replace("#search#", "AND TITLE LIKE '<percentage>"+searchKeyword+"<percentage>' ");
	}else{
		query = query.replace("#search#", "");
	}

	query = encode(query);

	networkJson(URL_QUERY + query, function(result){
		FeedAdmin.prototype.updateFeedList(result);
	});
}

FeedAdmin.prototype.loadDomainList = function(){
	var query = feedAdmin.mQueryDomainList;

	query = encode(query);

	networkJson(URL_QUERY + query, function(result){
		
	});
}

FeedAdmin.prototype.loadTagList = function(){
	networkJson(URL_TAG, function(result){
		
		$.each(result.feed_add_tag.split("||"), function(idx, value){
			feedAdmin.mTagList.push(value);
		});
	});
}


/*
--------------------------------------------------------------------------------------------------------------
onClick Method
--------------------------------------------------------------------------------------------------------------
*/
FeedAdmin.prototype.onClickSearchButton = function(){
	var searchKeyword = $("#search_input").val();
	feedAdmin.mSearchKeyword = searchKeyword;

	this.loadData(feedAdmin.mQueryBaseLoad, 0, searchKeyword);
}

FeedAdmin.prototype.onClickDisable = function(insert_time){
	var query = this.mQueryDisable + insert_time;

	d(query);

	query = encode(query);

	networkJson(URL_QUERY_UPDATE + query, function(result){
		d(result);
		if(result == 1){
			$("#feed_row_" + insert_time).remove();
			alert("피드 삭제 성공");
		}else{
			alert("피드 삭제 실패");
		}
	});
}

FeedAdmin.prototype.onClickModifyMainImage = function(imageSrc, insert_time){
	d(imageSrc+", "+insert_time);

	var query = this.mQueryModifyMainImage.replace("#image_src#", imageSrc);
	query += insert_time;

	query = encode(query);

	networkJson(URL_QUERY_UPDATE + query, function(result){
		if(result == 1){
			$("#feed_image_"+insert_time).attr("src", imageSrc);

			alert("메인 이미지 변경 성공");
		}else{
			alert("메인 이미지 변경 실패");
		}
	});
}

FeedAdmin.prototype.onClickSpamImage = function(imageSrc, domain){
	d(imageSrc+", " + domain);


	var query = feedAdmin.mQuerySpamImage;
	query = query.replace("#spam_url#", imageSrc);
	query = query.replace("#domain#", domain);

	query = encode(query);

	networkJson(URL_QUERY_UPDATE + query, function(result){
		d(result);
		if(result == 1){
			alert("스팸 이미지 등록 성공");
		}else{
			alert("스팸 이미지 등록 실패");
		}
	});
}


FeedAdmin.prototype.onClickMore = function(){
	feedAdmin.loadData(feedAdmin.mQueryBaseLoad, feedAdmin.mTimestamp, feedAdmin.mSearchKeyword);
}

FeedAdmin.prototype.onClickInsertTag = function(tagName, insert_time){
	var query = feedAdmin.mQueryInsertTag;
	query = query.replace("#tag_name#", "||#"+tagName);
	query = query + insert_time;

	query = encode(query);

	networkJson(URL_QUERY_UPDATE + query, function(result){
		d(result);
		if(result == 1){
			alert("태그 등록 성공");
		}else{
			alert("태그 등록 실패");
		}
	});
}


/*
--------------------------------------------------------------------------------------------------------------
Update Method
--------------------------------------------------------------------------------------------------------------
*/
FeedAdmin.prototype.updateFeedList = function(feedList){

	var htmlFeed = '<div id="feed_container">'
            +'<div class="row">'
	          +'#feed_list#'
	          +'</div></div>';

	

    var htmlFeedList = '';

    $.each(feedList, function(key, value){
    	var htmlFeedEach = ''
			+'  <div id="feed_row_#feed_row_insert_time#" class="col-sm-6 col-md-4">'
			            +'  <div class="thumbnail">'
			              +'  <img id="feed_image_#feed_image_insert_time#" src="#img_src#" style="height:200px;" alt="" class="thumbnail">'
			                +'<div class="caption">'
			                  +'<h3><a target="_blank" href="#link#">#title#</a></h3>'
			                  +'<p>'
			                    +'<div onclick="feedAdmin.onClickDisable(#insert_time#);" class="btn btn-primary" role="button">Disable</div>'
			                    // +'&nbsp;<div onclick="feedAdmin.onClickModifyMainImage(\'#image#\');" class="btn btn-primary" role="button">메인 이미지 변경</div>'

			                    +'&nbsp;&nbsp;<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">'
								+'이미지관리(#img_count#) <span class="caret"></span>'
								+'</a>'
								+'<ul class="dropdown-menu" role="menu">'
								+'#all_image#'
								+'  </ul>'


			     //                +'&nbsp;&nbsp;<a class="dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-expanded="false">'
								// +'이미지스팸등록 <span class="caret"></span>'
								// +'</a>'
								// +'<ul class="dropdown-menu" role="menu">'
								// +'#all_image_spam#'
								// +'  </ul>'

			                  +'</p>'
			                  +'<p>'
			                  +'#tag_button#'
			                  +'</p>'
			                +'</div>'
			              +'</div>'
			            +'</div>';




    	var mainImage = value.main_image;

    	if(value.main_image.length == 0){
    		mainImage = getMainImage(value.image);
    	}

    	htmlFeedEach = htmlFeedEach.replace("#img_src#", mainImage);
    	htmlFeedEach = htmlFeedEach.replace("#title#", value.title);
    	htmlFeedEach = htmlFeedEach.replace("#insert_time#", value.insert_time);
    	htmlFeedEach = htmlFeedEach.replace("#image#", value.image);
    	htmlFeedEach = htmlFeedEach.replace("#feed_image_insert_time#", value.insert_time);
    	htmlFeedEach = htmlFeedEach.replace("#feed_row_insert_time#", value.insert_time);
    	htmlFeedEach = htmlFeedEach.replace("#link#", value.link);


    	feedAdmin.mTimestamp = value.insert_time;


		if(value.image.length > 0){
			var imageLi = "";
			// var imageSpamLi = "";

			$.each(value.image.split("||"), function(idx, eachImageSrc){
				if(eachImageSrc.length > 0){
					imageLi += "<li>"
					+"<img src='"+eachImageSrc+"' style='height:100px;'/>"
					+"&nbsp;&nbsp;<button onclick='feedAdmin.onClickModifyMainImage(\""+eachImageSrc+"\", "+value.insert_time+")' type='button' class='btn btn-danger btn-sm'>메인등록</button>"
					+"&nbsp;&nbsp;<button onclick='feedAdmin.onClickSpamImage(\""+eachImageSrc+"\", \""+value.domain+"\")' type='button' class='btn btn-danger btn-sm'>스팸등록</button>&nbsp;&nbsp;"
					+"<div style='background-color:gray;'>&nbsp;</div></li>";
					// imageSpamLi += "<li><img onclick='feedAdmin.onClickSpamImage(\""+eachImageSrc+"\", \""+value.domain+"\")' src='"+eachImageSrc+"' style='height:100px;'/><div style='background-color:gray;'>&nbsp;</div></li>";
				}
			});

			if(imageLi.length > 0){
				htmlFeedEach = htmlFeedEach.replace("#all_image#", imageLi);
				// htmlFeedEach = htmlFeedEach.replace("#all_image_spam#", imageSpamLi);
			}

			htmlFeedEach = htmlFeedEach.replace("#img_count#", value.image.split("||").length - 1);
		}
		




		var htmlTagList = "";
		//#tag_button#
		//<button type="button" class="btn btn-xs">Primary</button>
		var insertTimeForTag = value.insert_time;
		$.each(feedAdmin.mTagList, function(idx, value){
			htmlTagList += '<button type="button" class="btn btn-xs" onclick="feedAdmin.onClickInsertTag(\''+value+'\', '+insertTimeForTag+');">'+value+'</button>&nbsp;&nbsp;';
		});


		htmlFeedEach = htmlFeedEach.replace("#tag_button#", htmlTagList);

    	
    	
    	
    	htmlFeedList = htmlFeedList + htmlFeedEach;
    });



	$(CONTAINER_EL).append(htmlFeed.replace("#feed_list#", htmlFeedList));
	$(CONTAINER_EL).append('<button onclick="feedAdmin.onClickMore();" type="button" class="btn btn-info">더보기</button>');
}



FeedAdmin.prototype.updateDomainList = function(result){
	var htmlDomainList = "";

	$.each(result, function(idx, value){
		var html = feedAdmin.mHtmlDomainListBtn.replace("#domain_title#", value.domain_title);
		htmlDomainList += html;
	});


	$("#domain_container").append(htmlDomainList);
}































































