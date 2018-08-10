

$(function(){


  var currentPage = 1;
  var pageSize = 5;
  var picArr = [];//定义一个空数组,用来装图片地址
  //1-向后台发送请求,后台返回数据渲染
  render();
  function render(){
    $.ajax({
      type : "get",
      url : "/product/queryProductDetailList",
      data : {
        page : currentPage,
        pageSize : pageSize
      },
      dataType : "json",
      success : function(info){
        // console.log(info);
        var str = template("productTmp",info);
        $('tbody').html(str);

        //用分页插件生成分页
        //引包
        //准备结构
        // 实例化对象
        $('#paginator').bootstrapPaginator({
          // 指定bootstrap的版本
          bootstrapMajorVersion : 3,
          //当前页
          currentPage : info.page,
          //总页数
          totalPages : Math.ceil(info.total / info.size),
          // 字体大小
          size : "normal",
          //为数字页码注册点击事件
          onPageClicked : function(a,b,c,page){
            //指向当前页
            currentPage = page;
            //渲染页面
            render();
          },
          //操作当前按钮的文本
          // type: 按钮类型, page, first, last, prev, next
          // page: 当前按钮指向的页码
          // current: 当前页
          itemTexts : function (type, page, current) {
            switch(type){
              case "page":
                return page;
              case "first":
                return "首页";
              case "last" :
                return "尾页";
              case "prev" :
                return "上一页";
              case "next" :
                return "下一页";
            }
          },
          //设置操作按钮的title属性。 。
          tooltipTitles : function(type, page, current){
            switch(type) {
              case "page":
                return "前往第" + page + "页";
              case "first":
                return "首页";
              case "last" : 
                return "尾页";
              case "prev" : 
                return "上一页";
              case "next" : 
                return "下一页";
            }
          },
          //使用bootstrap的tooltips插件,修改title的背景样式
          useBootstrapTooltip:true

        });
      }
    });
  }


  //2-点击添加商品的按钮,弹出模态框
  $('.addBtn').click(function(){
    //弹出模态框
    $('#addModal').modal("show");
      //发送ajax请求,获取二级分类渲染到dropdown-menu
      $.ajax({
        type : "get",
        url : "/category/querySecondCategoryPaging",
        data : {
          page : 1,
          pageSize : 100
        },
        dataType : "json",
        success : function(info){
          console.log(info);
          var htmlStr = template('secondTmp',info);
          //渲染
          $('.dropdown-menu').html(htmlStr);
          
        }
      });
  });

  //3-给二级分类的下拉框注册点击事件(因为下面的li和a都是动态渲染的)
  $('.dropdown-menu').on('click','a',function(){
    //点击a,获取a的文本内容
    var txt = $(this).text();
    //把获取到的文本内容赋值给dropdownText
    $('.dropdownText').text(txt);
    //还要把a父元素上的id赋值给隐藏域的input(为了后面给后台发送请求)
    var id = $(this).data('id');
    //赋值给input 
    $('[name="brandId"]').val(id);
    //手动隐藏域的状态
    $('#form').data('bootstrapValidator').updateStatus('brandId','VALID');
  });

  //4-文件上传
  //引包
  //准备html结构
  //文件上传实例化
  $('#fileupload').fileupload({
    dataType : "json",
      //e：事件对象
      //data：图片上传后的对象，
      //通过data.result.picAddr可以获取上传后的图片地址
      done :function(e,data){
        console.log(data.result);//对象
        //将上传得到的图片地址和名称存到picArr中
        //而且后添加的图片在最前面,也就是添加到数组的最前面
        picArr.unshift(data.result);
        //得到图片地址
        var imgUrl = data.result.picAddr;
        // 因为没有选图片之前在html结构中是没有img的,选择了图片之后
        //才有显示图片
        //把img创建出来并添加到imgBox里面去,作为第一个子元素
        $('.imgBox').prepend('<img src="'+ imgUrl +'" width="100px" alt="">');

        if( picArr.length > 3){
          //删除数组的最后一个
          picArr.pop();
          //图片结构也要移除最后一张
          $('.imgBox img:last-of-type').remove();
        }
        //选好三张之后,它的状态应该改变
        if(picArr.length === 3){
          //重置状态VALID:有效的
          $('#form').data('bootstrapValidator').updateStatus('picStatus','VALID')
        }
      } 
  });



  //5-使用bootstrapValidator插件验证表单
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],
    //可以不设置,不设置就代表都验证
    excluded: [],
     //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //3. 指定校验字段
    fields : {
      brandId :{
        validators : {
          //非空校验
          notEmpty : {
            message : "请选择二级分类"
          }
        }
      },
      proName : {
        validators : {
          //非空校验
          notEmpty : {
            message : "请输入商品名称"
          }
        }
      },
      proDesc : {
        validators : {
          //非空校验
          notEmpty : {
            message : "请输入商品描述"
          }
        }
      },
      num : {
       
       validators : {
         //非空校验
         notEmpty : {
           message : "请输入商品库存"
         },
         //正则校验//商品库存必须是非0开头的数字
         regexp: {
          regexp: /^[1-9]\d*$/,
          message: '商品库存必须是非零开头的数字'
        }
       }
      },
      // 尺码要求: 必须 xx-xx 格式, x 表示数字
      size : {
        validators : {
          //非空校验
          notEmpty : {
            message : "请输入商品尺码"
          },
          regexp : {
            regexp : /^\d{2}-\d{2}$/,
            message :'商品尺码必须是 xx-xx 的格式, 例如 32-40'
          }
        }
      },

      oldPrice : {
        validators : {
          //非空校验
          notEmpty : {
            message : "请输入商品原价"
          }
        }
      },
      price : {
        validators : {
          //非空校验
          notEmpty : {
            message : "请输入商品现价"
          }
        }
      },
      picStatus : {
        validators : {
          notEmpty :{
            message : "请上传3张图片"
          }
        }
      }
    }
  });

  //6-表单基础验证成功之后会有一个表单提交,我们需要阻止,然后
  //通过ajax发送请求
  $('#form').on('success.form.bv',function(e){
    //阻止表单额提交
    e.preventDefault();
    //我们需要获取表单所有数据然后再拼接上图片的地址发送给后台
    var inputData = $('#form').serialize();
    //表单数据获取到之后然后拼接上图片的地址
    //&picAddr1=**&picName1=**;
    inputData += "&picAddr1" + picArr[0].picAddr1 + "&picName1" + picArr[0].picName1;
    inputData += "&picAddr2" + picArr[1].picAddr2+ "&picName2" + picArr[1].picName2;
    inputData += "&picAddr3" + picArr[2].picAddr3 + "&picName3" + picArr[2].picName3;
    //通过ajax发送请求
    $.ajax({
      type : "post",
      url : "/product/addProduct",
      data : inputData,
      dataType : "json",
      success : function(info){
        console.log(info);
        //模态框消失
        $('#addModal').modal("hide");
        //重新渲染第一页
        currentPage = 1;
        render();
        //重置表单内容
        $('#form').data('bootstrapValidator').resetForm(true);
        //手动重置二级分类和图片
        $('.dropdownText').text('请输入二级分类');
        //图片
        $('.imgBox img').remove();
        //以及将数组里面的图片地址和名字重置
        picArr = [];
      }
    });
  });
});