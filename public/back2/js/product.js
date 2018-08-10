/**
 * Created by Jepson on 2018/8/10.
 */

$(function() {
  var currentPage = 1; // 当前页
  var pageSize = 2; // 每页条数
  var picArr = []; // 用于存储上传的图片

  // 1. 一进入页面, 发送ajax请求, 获取数据进行页面渲染
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      // 只要后台指定了响应头, 设置了 Content-Type: application/json; charset=utf-8
      // 就可以省略 dataType
      dataType: "json",
      success: function( info ) {
        console.log( info );
        var htmlStr = template( "productTpl", info );
        $('tbody').html( htmlStr );

        // 分页初始化
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          // 总页数
          totalPages: Math.ceil( info.total / info.size ),
          // 当前页
          currentPage: info.page,
          size: "normal",
          // 添加点击事件
          onPageClicked: function( a, b, c, page ) {
            // 更新当前页
            currentPage = page;
            // 让页面重新刷新
            render();
          },

          // 设置每个按钮的文本
          // 每个按钮在初始化时, 都会调用这个方法, 将这个方法的返回值作为按钮的文本
          // type: 按钮类型, page, first, last, prev, next
          // page: 当前按钮指向的页码
          // current: 当前页
          itemTexts: function( type, page, current ) {
            switch ( type ) {
              case "page":
                return page;
              case "first":
                return "首页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
            }
          },

          // 配置每个按钮的title文本
          tooltipTitles: function( type, page, current ) {
            switch( type ) {
              case "page":
                return "前往第" + page + "页";
              case "next":
                return "下一页";
              case "prev":
                return "上一页";
              case "first":
                return "首页";
              case "last":
                return "尾页";
            }
          },

          // 使用 bootstrap 的 toolTip组件
          useBootstrapTooltip: true

        })
      }
    })
  };


  // 2. 点击添加商品按钮, 显示模态框
  $('#addBtn').click(function() {
    $('#addModal').modal("show");

    // 发送 ajax 请求, 请求二级分类的全部数据, 进行下拉列表渲染
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function( info ) {
        console.log( info );
        var htmlStr = template( "dropdownTpl", info );
        $('.dropdown-menu').html( htmlStr );
      }
    })
  });


  // 3. 给下拉菜单的a注册点击事件 (通过事件委托注册)
  $('.dropdown-menu').on("click", "a", function() {

    // 设置文本
    var txt = $(this).text();
    $('#dropdownText').text( txt );

    // 设置 id 给隐藏域
    var id = $(this).data("id");
    $('[name="brandId"]').val( id );

    // 手动设置隐藏域的校验状态
    $('#form').data("bootstrapValidator").updateStatus("brandId", "VALID");

  });

  // 4. 文件上传初始化
  //    插件内部, 会遍历选中的多张图片, 发送多次请求到后台, 后台就会响应多次, 一旦将图片存好后,
  //    后台就会将图片地址返回, 每次响应都会触发一次 done 事件
  $('#fileupload').fileupload({
    dataType: "json",
    // 图片上传完成, 会返回图片地址, 调用 done 方法
    done: function( e, data ) {
      console.log( data.result );
      // 将上传得到的图片名称和地址的图片对象存在 picArr数组中
      picArr.unshift( data.result );

      // 图片地址
      var picUrl = data.result.picAddr;
      $('#imgBox').prepend('<img src="'+ picUrl +'" width="100" alt="">');

      // 判断, 如果图片超过 3 张, 移除最早添加的, 留下新添加的
      if ( picArr.length > 3 ) {
        // 删除数组的最后一项
        picArr.pop();
        // 图片结构移除最后一张
        // img:last-of-type 找到最后一个img类型的元素, 让他自杀
        $('#imgBox img:last-of-type').remove();
      }


      if ( picArr.length === 3 ) {
        // 说明上传 3 张图片了, 将picStatus校验状态置成 VALID
        $('#form').data("bootstrapValidator").updateStatus("picStatus", "VALID");
      }
    }
  });


  // 5. 进行表单校验配置
  $('#form').bootstrapValidator({
    // 对隐藏域进行校验
    excluded: [],
    // 配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',     // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 配置字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      /*
        库存必须是非0开头的数字
        ^ 以...开头
        $ 以...结尾
        [1-9] 可以出现 1-9
        \d 数字, 0-9
        *  出现0次或多次
        ?  0次或1次
        +  出现1次或多次
        {n} 出现 n 次
        {n,m} 出现 n-m 次
      * */
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      // 尺码要求: 必须 xx-xx 格式, x 表示数字
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码必须是 xx-xx 的格式, 例如 32-40'
          }
        }
      },

      // 原价
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      // 现价
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      // 标记当前图片是否上传满三张
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }

    }


  });


  // 6. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交
  $('#form').on("success.form.bv", function( e ) {
    e.preventDefault();

    var paramsStr = $('#form').serialize(); // 拿到input表单的所有参数
    // 还要拼接上图片信息
    // &picAddr1=xx&picName1=xx
    // &picAddr2=xx&picName2=xx
    // &picAddr3=xx&picName3=xx
    paramsStr += "&picAddr1=" + picArr[0].picAddr + "&picName1=" + picArr[0].picName;
    paramsStr += "&picAddr2=" + picArr[1].picAddr + "&picName2=" + picArr[1].picName;
    paramsStr += "&picAddr3=" + picArr[2].picAddr + "&picName3=" + picArr[2].picName;

    // 通过ajax提交
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: paramsStr,
      dataType: "json",
      success: function( info ) {
        console.log( info )
        if ( info.success ) {
          // 关闭模态框
          $('#addModal').modal("hide");
          // 页面重新渲染, 重新渲染第一页
          currentPage = 1;
          render();
          // 重置表单内容
          $('#form').data("bootstrapValidator").resetForm(true);

          // 手动重置上面的文本,
          $('#dropdownText').text("请输入二级分类");
          // 以及图片重置(将所有图片移除)
          $('#imgBox img').remove();
          picArr = [];
        }
      }
    })
  })

});
