
$(function(){

  var currentPage = 1;
  var pageSize = 5;

  render();
  //1-通过发送ajax到后台获取数据,然后前端渲染
  function render(){
    $.ajax({
      type : "get",
      url : "/category/querySecondCategoryPaging",
      data : {     
        page : currentPage,
        pageSize : pageSize
      },
      dataType : "json",
      success : function(info){
        console.log(info);
        //将模板跟数据相结合
        var str = template('secondTmp',info);
        //渲染
        $('tbody').html(str);   

        //引入分页插件,根据返回的数据生成对应的分页
          $('#paginator').bootstrapPaginator({
            bootstrapMajorVersion:3,//指定bootstrap的版本，如果是3，必须指定
            currentPage : info.page,//指定当前页
            totalPages : Math.ceil(info.total / info.size),//指定总页数
            onPageClicked : function(a,b,c,page){
              //page指的是当前点击页,修改了当前页
              currentPage = page;
              //重新渲染当前页
              render();
            }
          });
      } 
    });     
  }


  //2-点击添加分类,模态框出现,先准备模态框
  $('.cateBtn').click(function(){
    //模态框显示
    $('#addModal').modal("show");

    //发送ajax请求,渲染模态框里面的一级分类的下拉数据
    $.ajax({
      type : "get",
      url : "/category/queryTopCategoryPaging",
      data : {
        page : 1,
        pageSize : 500
      },
      dataType : "json",
      success : function(info){
        console.log(info);
        //将模板和数据相结合渲染
        var str = template('cateTmp',info);
        //渲染
        $('.dropdown-menu').html(str);
      }
    });
  })

  //3-点击dropdown-menu下的a,让其展示到dropdown-menu上(因为a是动态渲染的,所以要用事件委托)
  $('.dropdown-menu').on('click','a',function(){
    // 获取到a的文本内容
    var txt = $(this).text();
    //把获取到的内容赋值给dropdownText
    $('.dropdownText').text(txt);
    //不仅要把内容赋值给dropdownText
    //还要把id也传给它,后面就可以发送给后台,进行添加
    var id = $(this).data('id');
    $('[name="categoryId"]').val(id);

    //手动重置一级分类的隐藏表单的状态
    $('#form').data("bootstrapValidator").updateStatus('categoryId',"VALID");
  })


  //4-文件上传jquery fileupload插件
  //先引入
  //准备html结构
  //初始化文件上传
  $('#fileupload').fileupload({
    dataType : "json",
    //文件上传完成会执行的函数,通过这个函数就能获取到图片的地址
    //data就能得到上传图片的结果 
    done : function(e,data){
      //获取到文件上传图片的地址
      var imgUrl = data.result.picAddr;
      //把获取到的图片地址赋值给img的src属性(赋值给img的src是为了让其展示出来)
      $('.imgBox img').attr('src',imgUrl);
      //因为这个地址后面需要发送给后台,所以需要把这个赋值给input(赋值给input是为了后面发送给后台进行添加)
      $('[name="brandLogo"]').val(imgUrl);
      //需要手动重置隐藏域的状态
      $('#form').data('bootstrapValidator').updateStatus("brandLogo","VALID");
    }
  });


  //5-用bootstrapvalidator插件验证表单
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    //   我们需要对隐藏域进行校验, 所以不需要将隐藏域 排除到 校验范围外
    excluded: [],
    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
     //设置校验规则
     fields: {
      categoryId: {
        //校验规则
        validators: {
          //非空校验
          notEmpty: {
            //配置提示信息
            message: "请输入一级分类",  
          },  
        }
      },
      brandName: {
        validators: {
          //非空校验
          notEmpty: {
            message :"请输入二级分类"
          }, 
        }
      },
      brandLogo : {
        validators : {

          //非空校验
          notEmpty: {
            message :"请选择图片"
          }
        }
      }
    }
  });

 

  //6-验证表单成功事件
  $('#form').on('success.form.bv',function(e){
    //阻止表单自动提交
    e.preventDefault();
    //然后再通过ajax向后台发送请求
    $.ajax({
      type : "post",
      url : "/category/addSecondCategory",
      data : $('#form').serialize(),
      dataType : "json",
      success : function(info){
        console.log(info);
        if(info.success) {
          //模态框隐藏
          $('#addModal').modal("hide");
          //重新渲染第一页
          currentPage = 1;
          render();
          //表单的文本内容和状态
          $('#form').data('bootstrapValidator').resetForm(true);
          //手动重置文本内容和图片路径
          $('.dropdownText').text('请选择一级分类');
          $('.imgBox img').attr('src','images/none.png');
        }
      }
    });
  });

  
  
});