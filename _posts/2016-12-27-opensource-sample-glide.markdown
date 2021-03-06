---
layout: post
title:  "[OpenSource] Glide 에서 일반 이미지와 GIF 사용"
date:   2016-12-28 11:45:31 +0530
categories: "android"
author: "Dev C"
tag : ANDROID
image : https://github.com/bumptech/glide/raw/master/static/glide_logo.png
comments : true
---

이미지 로드 라이브러리로 **Glide**를 사용하여 일반 이미지와 GIF를 사용하는 방법을 알아보겠습니다.

일단 build 파일에 아래의 내용을 추가하여 주세요.

**compile 'com.github.bumptech.glide:glide:3.7.0'**




퍼미션 관련 설정도 해주세요.

```xml
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```





그리고 로드 할 액티비티에 두 가지(일반 이미지, GIF)를 로드할 이미지 뷰 두 개를 추가하여 줍니다.

```xml
<LinearLayout
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:weightSum="1">
    <RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="0.5">
        <ImageView
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:id="@+id/imageview_normal"/>
    </RelativeLayout>
    <RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="0.5">
        <ImageView
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:id="@+id/imageview_gif"/>
    </RelativeLayout>
</LinearLayout>
```






일반 이미지와 같은 경우에는 Glide만을 사용하여 아래와 같이 간단하게 이미지 로드가 가능한데요 **GIF** 관련해서는 한가지 추가되는 부분이 있습니다. 

바로 **GlideDrawableImageViewTarget**입니다.

{% highlight java %}
public class MainActivity extends AppCompatActivity {

    private static final String NORMAL_IMAGE_URL = "http://www.w3schools.com/css/img_fjords.jpg";
    private static final String GIF_IMAGE_URL = "https://media.giphy.com/media/MGdfeiKtEiEPS/giphy.gif";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        showNormalImage();
        showGifImage();
    }

    private void showGifImage() {
        ImageView imageViewGif = (ImageView) findViewById(R.id.imageview_gif);

        GlideDrawableImageViewTarget imageViewTarget = new GlideDrawableImageViewTarget(imageViewGif);
        Glide.with(this).load(GIF_IMAGE_URL).into(imageViewTarget);
    }

    private void showNormalImage() {
        ImageView imageViewNormal = (ImageView) findViewById(R.id.imageview_normal);
        Glide.with(this).load(NORMAL_IMAGE_URL).into(imageViewNormal);
    }
}  
{% endhighlight %}

위와 같이 이미지 로드를 간단하게 할 수 있어 좋은 라이브러리이지만 이미지 관련 개발을 하시다 보면 메모리 관리 때문에 Resize 와 같은 작업들을 하신 경험이 있을 텐데요 *OOM*{: style="color:red"} 관리를 Glide에서 해준다는 것이 가장 장점 같네요.


>##### 아래의 링크에서 전체 프로젝트를 확인하실 수 있습니다.

[![](https://jitpack.io/w/img/github-logo.png){:height="50px" width="120px"}](https://github.com/devchai/GlideSample){: target="_blank"}






