
  //1,因为每个页面都有进度条功能,所以应该放在公共部分里面
  $(document).ajaxStart(function(){
    //开启进度条
    NProgress.start();
  });

  $(document).ajaxStop(function(){
    //关闭进度条
    setTimeout(function(){
      NProgress.done();
    },10000);
  });

  
