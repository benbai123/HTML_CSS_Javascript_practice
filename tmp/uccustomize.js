(function () {
	if (!window.uccustomize) {
		window.uccustomize = {};
	}
		
	if (!window.uccustomize.findproduct) {
		window.uccustomize.findproduct = {
			// 前一次 request 的 URL
			_previousURL: null,
			// 準備用來組 request 的參數
			_params: null,
			_getPreviousURL: function () {
				return this._previousURL || window.location.href;
			},
			// 從 url 中取出每個變數的值
			_getParamsFromUrl: function (url) {
				if (url.indexOf('?') > 0) {
					var params = url.split('?')[1],
						pmap = {},
						param, pkey, pval;
					// 沒有變數, 回傳空物件
					if (!params) return pmap;
					// 以 & 分割變數
					params = params.split('&');
					// 跑過所有變數段落
					for (var i = 0; i < params.length; i++) {
						// 取當前變數
						param = params[i];
						if (param.indexOf('=') > 0) {
							// 將參數分割為 key value
							pkey = param.split('=')[0] || '';
							pval = param.split('=')[1] || '';
							// 不處理 is_ajax
							if (pkey == 'is_ajax') continue;
							// 若未建過則建新陣列
							if (!pmap[pkey]) {
								pmap[pkey] = pval.split(',');
							} else {
								// 否則連結新陣列
								pmap[pkey] = pmap[pkey].concat(pval.split(','));
							}
						}
					}
					return pmap;
				}
				// url 不帶 ?, 回傳空物件
				return {};
			},
			// 找出選項帶的特定參數
			_findSpecificParam: function (ori, curr) {
				var res = {};

				for (var key in ori) {
					// 選項參數中無該參數
					// 表示該參數即為此選項的參數
					// 取消勾選後就會不見了
					// 如 url 為 a=1&b=2 選項為 a=1
					if (!curr[key]) {
						res[key] = ori[key][0];
						return res;
					}
					var oparam = ori[key].slice(),
						cparam = curr[key].slice(),
						val, index;
					// 參數長度不同, 則找出不同的回傳
					if (oparam.length != cparam.length) {
						for (var i = 0; i < oparam.length; i++) {
							val = oparam[i];
							index = cparam.indexOf(val);
							// 不同的值在原參數內
							// 如 url 為 a=1&b=2,3 選項為 a=1&b=2
							if (index == -1) {
								res[key] = val;
								return res;
							} else {
								cparam.splice(index, 1);
							}
						}
						// 不同的值在選項參數內
						// 如 url 為 a=1&b=2 選項為 a=1&b=2,3
						res[key] = cparam[0];
						return res;
					}
					// 若此參數在選項參數中一致則移除
					// 如 url 為 a=1&b=2,3 選項為 a=1&b=2
					// 則到此選項參數中的 a 會被移掉
					delete curr[key];
				}
				// 參數只存在於選項內, 回傳選項參數
				// 如 url 為 a=1 選項為 a=1&b=2
				for (key in curr) {
					res[key] = curr[key][0];
					return res;
				}
				return {};
			},
			// 將一組參數加入目前參數
			_addParam: function (param) {
				// 若目前無參數就初始化
				if (!this._params) this._params = {};
				// 跑過每個傳入的參數 key
				for (var key in param) {
					// 若目前參數無該 key, 建立空陣列
					if (!this._params[key]) this._params[key] = [];
					// 將傳入參數值存入對應陣列
					/* 如
						{
							cat4: [1, 2, 3],
							effect: [4, 5]
						}
					*/
					this._params[key].push(param[key]);
				}
			},
			// 由選取的選項建立要使用的參數
			_buildParams: function () {
				var wgt = this,
					prevParams = this._getParamsFromUrl(this._getPreviousURL());
				this._params = null;
				// 取得每一個被選取的選項
				$('.group-box-body a')
					.filter(function () {
						return $(this).find('.custom-checkbox-checked')[0];
					}).each(function () {
						// 找出選項帶的參數
						var param = wgt._findSpecificParam(prevParams,
							wgt._getParamsFromUrl($(this).attr('s_href')));
						// 加入到目前參數
						wgt._addParam(param);
					});
			},
			// 初始化上方條件
			_initConditions: function () {
				var wgt = this;
				// 關閉原本綁定的動作
				$('.condition').off()
					.click(function(e){
						e.preventDefault();
						// 以自己帶的 url 找到對應的左方選項
						var url = $(this).attr("s_href"),
							$opt = $('.group-box-body a[s_href="'+url+'"]'),
							$cbx = $opt.find('.custom-checkbox');
						// 被點擊時, 移除左方選項的選取狀態
						// 也移除本身的 dom 元素
						$cbx.removeClass('custom-checkbox-checked')
								.removeClass('show');
						$(this).remove();
						// 若點擊時沒有按著 Ctrl 鍵
						// 則更新頁面
						if (!e.ctrlKey) {
							wgt.ajaxLoad();
						}
				});
				// 清除鈕
				// 關閉原本綁定的動作
				$('.clear').off().
					click(function(e){
					e.preventDefault();
					// 移除所有上方選項
					$('.condition').remove();
					// 清除所有選取狀態
					$('.custom-checkbox-checked')
						.removeClass('custom-checkbox-checked')
						.removeClass('show');
					// 若點擊時沒有按著 Ctrl 鍵
					// 則更新頁面
					if (!e.ctrlKey) {
						wgt.ajaxLoad();
					}
				});
			},
			// 更新頁面
			ajaxLoad: function () {
				// 打開遮罩
				loading();
				// 建立參數
				this._buildParams();
				// 取得不帶參數的 url
				var n = window.location.href.split('?')[0]
					p = [],
					wgt = this;
				// 組出 ajax url
				n += '?';
				for (var key in this._params) {
					// 將所有參數加入陣列
					// 陣列 ['1', '2', '3'].join(',') => 字串 '1,2,3'
					p.push(key+'='+this._params[key].join(','));
				}
				// 陣列 ['a=1', 'b=2'].join('&') => 字串 'a=1&b=2'
				n += p.join('&');
				// 存下本次 URL
				this._previousURL = n;
				$.ajax({
						url: n,
						type: "GET",
						data: {
								is_ajax: !0
						},
						success: function(n) {
								$(".product-filter-list").html(n);
								wgt.init();
								closeLoading();
								$("body,html").animate({
										scrollTop: 200
								}, 800);
						},
						error: function() {}
				})
			},
			// 初始化全部
			init: function () {
				var wgt = this;
				// 所有選項
				// 移除原本綁定
				$('.group-box-body a').off()
					.click(function(e){
						// 點擊時
						e.preventDefault();
						// 找到選項下 checkbox
						var $cbx = $(this).find('.custom-checkbox');
						// 改變勾選狀態
						if ($cbx.hasClass('custom-checkbox-checked')) {
							$cbx.removeClass('custom-checkbox-checked')
								.removeClass('show');
						} else {
							$cbx.addClass('custom-checkbox-checked')
								.addClass('show');
						}
						// 重生右側上方選項
						set_right_condistion();
						wgt._initConditions();
						// 若點擊時沒有按著 Ctrl 則刷新頁面
						if (!e.ctrlKey) {
							wgt.ajaxLoad();
						}
					});
				// 初始化右側上方選項
				wgt._initConditions();
			}
		};
		// 初始化
		window.uccustomize.findproduct.init();
	}
})();
