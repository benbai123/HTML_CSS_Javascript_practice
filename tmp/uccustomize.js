(function () {
	window.uccustomize = {};
		
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
						// 不處理 is_ajax 與 page
						if (pkey == 'is_ajax' || pkey == 'page') continue;
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
		_processItemClick: function (e, $item) {
			var wgt = this;
			// 點擊時
			e.preventDefault();
			// 找到選項下 checkbox
			var $cbx = $item.find('.custom-checkbox');
			// 改變勾選狀態
			if ($cbx.hasClass('custom-checkbox-checked')) {
				$cbx.removeClass('custom-checkbox-checked')
					.removeClass('show');
			} else {
				$cbx.addClass('custom-checkbox-checked')
					.addClass('show');
				// 若為選取時, 移除第二選取區中的項目
				var lb = $item.find('.label').text(),
					title = $item.closest('.group-box')
						.find('.group-box-header .group-box-title').text();
				$('.second-level-cond-block')
					.find('[data-label="'+lb+'"][data-title="'+title+'"]').remove();
			}
			// 重生右側上方選項
			set_right_condistion();
			wgt._initConditions();
			// 若點擊時沒有按著 Ctrl 則刷新頁面
			if (!e.ctrlKey) {
				wgt.ajaxLoad();
			}
		},
		// 將項目存到第二區
		// $conds: 傳入的上方選項
		_addToSecond: function ($conds) {
			// $scondBlock: 第二區
			var $scondBlock = $('.second-level-cond-block'),
				wgt = this;
			// 若無第二區就先生成
			if (!$scondBlock[0]) {
				// $cnt: 第二區內部內容
				// $clear: 第二區整區清除鈕
				var $cnt = $('<div class="cnt"></div>'),
					$clear = $('<span>全部清除</span>');
				$scondBlock = $('<div class="second-level-cond-block"></div>');
				// 調整 style
				$scondBlock.css({
					'position': 'relative', 'height': '25px', 'left': '5px'
				});
				$cnt.css({
					'position': 'absolute', 'left': '0', 'top': '0', 'z-index': '999999',
					'width': '220px', 'height': '30px', 'overflow': 'hidden',
					'background-color': '#CCCCCC', 'white-space': 'normal'
				});
				$clear.css({
					'color': '#DD406F', 'cursor': 'pointer', 'font-size': '18px'
				});
				// 移入時展開, 移出時收起
				$cnt.on('mouseenter', function () {
					$cnt.css('height', 'auto');
				}).on('mouseleave', function () {
					$cnt.css('height', '30px');
				});
				// 點擊全部清除時移除第二區
				$clear.on('click', function () {
					$scondBlock.remove();
				});
				// 將第二區加到頁面
				$cnt.append($clear);
				$scondBlock.append($cnt);
				$('.product-filter-list').before($scondBlock);
			}
			// 每一個上方選項
			$conds.each(function () {
				// 由選項所帶的 url 找到對應左方選項
				// 取得選項文字及區塊 title
				// $scond: 第二區選項 (待生成)
				// $cross: 選項的移除鈕
				var url = $(this).attr("s_href"),
					$opt = $('.group-box-body a[s_href="'+url+'"]'),
					lb = $opt.find('.label').text(),
					title = $opt.closest('.group-box')
						.find('.group-box-header .group-box-title').text(),
					$scond,
					$cross = $('<span>&times;</span>');
					// 若已有該選項則不再添加
					if ($scondBlock.find('[data-label="'+lb+'"][data-title="'+title+'"]')[0]) return;
					// 生成選項內容
					$scond = $('<div data-label="'+lb+'" data-title="'+title+'" title="'+title+'--'+lb+'">'+lb+'</div>');
					// 調整 style
					$scond.css({
						'display': 'inline-block', 'font-size': '18px', 'color': '#888888',
						'padding': '5px 10px', 'cursor': 'pointer'
					});
					$cross.css({
						'color': '#DD406F'
					});
					// 點擊時
					// 若點在 $cross 上則移除選項
					// 若點在其它部份則重新選取選項
					$scond.on('click', function (e) {
						if (e.target == $(this).find('span')[0]) {
							$(this).remove();
						} else {
							// 從 $scond 上取出 title 及 label
							var slb = $(this).attr('data-label'),
								stitle = $(this).attr('data-title'),
								$item;
							$(this).remove();
							// 由 title 及 label 找到對應的左方選項
							$item = $('.group-box').filter(function () {
								return $(this).find('.group-box-header .group-box-title').text() == stitle;
							}).find('a')
							.filter(function () {
								return $(this).find('.label').text() == slb;
							});
							// 若為已選取狀態則略過
							if ($item.find('.custom-checkbox-checked')[0]) return;
							// 否則當選項點擊處理
							wgt._processItemClick(e, $item);
						}
					});
					// 將項目內容加到頁面
					$scond.append($cross);
					$scondBlock.find('.cnt').append($scond);
			});
		},
		// 初始化左方選項
		_initSelections: function () {
			var wgt = this;
			// 所有選項
			// 移除原本綁定
			// 重新綁定點擊事件
			$('.group-box-body a').off()
				.click(function(e) {
					wgt._processItemClick(e, $(this));
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
					// 將項目轉存到第二層
					// 也移除本身的 dom 元素
					$cbx.removeClass('custom-checkbox-checked')
							.removeClass('show');
					wgt._addToSecond($(this));
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
				// 將項目轉存到第二層
				wgt._addToSecond($('.condition'));
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
		// 初始化分頁按鈕
		_initPagin: function () {
			var wgt = this;
			// 重新綁定分頁鈕的 click
			$('.pagination a').off()
				.click(function(e){
			  e.preventDefault();
			  wgt.ajaxLoad($(this).attr('href'));
			})
		},
		// 更新頁面
		ajaxLoad: function (n, opts) {
			// 打開遮罩
			loading();
			var wgt = this;
			if (!n) {
				var p = [];
				// 建立參數
				this._buildParams();
				// 取得不帶參數的 url
				n = window.location.href.split('?')[0]
				// 組出 ajax url
				n += '?';
				for (var key in this._params) {
					// 將所有參數加入陣列
					// 陣列 ['1', '2', '3'].join(',') => 字串 '1,2,3'
					p.push(key+'='+this._params[key].join(','));
				}
				// 陣列 ['a=1', 'b=2'].join('&') => 字串 'a=1&b=2'
				n += p.join('&');
			}
			n = decodeURIComponent(n);
			// 若有 is_ajax=true 就先清掉
			n = n.replace('is_ajax=true', '');
			// 存下本次 URL
			this._previousURL = n;
			// 如果未指明要略過更新 history 便更新 history
			if (!opts || !opts.skipPushHistory) {
				if (window.history && window.history.pushState) {
					var state = {
						type: 'ucstate',
						url: n
					};
					window.history.pushState(state, document.title, n);
				}
			}
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
		// 顯示操作說明 (首次)
		_showDirections: function () {
			// 還沒顯示過才顯示
			if (!this.dirShown) {
				this.dirShown = true;
				// 藉用 loading 的遮罩
				loading();
				// 藏掉 loading 圖示
				$('#loading-position').hide();
				// $dir: 說明區塊
				// $cross: 關閉鈕
				var $dir = $('<div></div>'),
					$cross = $('<div>&times;</div>');
				// 調整 style
				$dir.css({
					'position': 'fixed', 'left': '0', 'top': '0', 'right': '0', 'bottom': '0',
					'margin': '20px', 'padding': '20px', 'border-radius': '15px', 'z-index': '999999',
					'background-color': 'white', 'color': '#DD406F', 'font-size': '22px',
					'overflow-y': 'auto'
				});
				$cross.css({
					'position': 'absolute', 'top': '5px', 'right': '15px',
					'cursor': 'pointer'
				});
				// 加上內容
				$dir.html([
					'操作方式:<br/>',
					'1. Ctrl + 滑鼠左鍵 Click 連續選取/取消選取左方或上方選項<br/>',
					'2. 滑鼠左鍵 Click 選取/取消選取左方或上方選項並載入內容<br/>',
					'3. 點擊上方選項取消選取時, 會增加一個 "第二層區塊" 於左方選項上方, 方便將一度選取過又刪除的項目再重新選取而不必重新於左方選項中翻找<br/>',
					'4. 第二層區塊中點擊 "全部清除" 可移除整個區塊, 點擊選項文字部份可重新選取選項, 點擊選項叉叉鈕可將該選項自第二層區塊中移除<br/>',
					'5. 網址在載入資料時會更新, 可用上一頁/下一頁切換並方便分享<br/><br/>',
					'注意:<br/>',
					'1. 需在做任何選取操作之前啟用, 若啟用前已有做過選取操作, 啟用後請先滑鼠左鍵 Click 點擊任一選項<br/>',
					'2. 連續選取後需有一載入動作後下方分頁才可正確動作<br/>',
					'3. 原始網頁內容均忠實呈現, 僅稍加修改操作流程、添加本操作說明及第二層選取區與更新網址'
				].join(''));
				// 點關閉鈕時
				$cross.on('click', function () {
					// 移除 loading 及說明區塊
					closeLoading();
					$dir.remove();
				});
				// 將內容加到頁面上
				$dir.append($cross);
				$('body').append($dir);
			}
		},
		// 初始化全部
		init: function () {
			// 初始化左方選項
			this._initSelections();
			// 初始化右側上方選項
			this._initConditions();
			// 初始化分頁按鈕
			this._initPagin();
			// 顯示操作說明 (首次)
			this._showDirections();
		}
	};
	// 初始化
	window.uccustomize.findproduct.init();
	// 綁定 history popstate
	$(window).bind('popstate',
		function(e) {
			var state = e.originalEvent.state;
			// 判斷是否為 ucstate
			if (state && state.type && state.type=='ucstate') {
				// 載入內容, 並指明略過更新 history 狀態
				window.uccustomize.findproduct.ajaxLoad(state.url, {skipPushHistory: true});
			}
		});
})();
