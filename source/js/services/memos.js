utils.jq(() => {
  $(function () {
    const els = document.getElementsByClassName("ds-memos");
    for (var i = 0; i < els.length; i++) {
      const el = els[i];
      const api = el.getAttribute("api");
      if (api == null) {
        continue;
      }
      const default_avatar = el.getAttribute("avatar") || def.avatar;
      const limit = parseInt(el.getAttribute("limit")) || 10;
      const host = api.replace(/https:\/\/(.*?)\/(.*)/i, "$1");

      // 保存状态
      el.dataset.offset = '0';
      
      // 创建加载更多按钮
      const loadMoreBtn = document.createElement('div');
      loadMoreBtn.className = 'load-more-btn';
      loadMoreBtn.innerHTML = '加载更多';
      loadMoreBtn.style.cssText = 'text-align: center; padding: 10px; cursor: pointer; color: #666; margin-top: 10px;';
      el.appendChild(loadMoreBtn);

      // 渲染消息的函数
      function renderTelegram(data, append = false) {
        var users = [];
        const filter = el.getAttribute("user");
        if (filter && filter.length > 0) {
          users = filter.split(",");
        }
        var hide = [];
        const hideStr = el.getAttribute("hide");
        if (hideStr && hideStr.length > 0) {
          hide = hideStr.split(",");
        }

        let html = '';
        data.forEach((item, i) => {
          if (item.user && item.user.login && users.length > 0) {
            if (!users.includes(item.user.login)) {
              return;
            }
          }
          
          let date = new Date(item.createdTs * 1000);
          var cell = '<div class="timenode" index="' + i + '">';
          cell += '<div class="header">';
          if (!users.length && !hide.includes("user")) {
            cell += '<div class="user-info">';
            if (default_avatar.length > 0) {
              cell += `<img src="${default_avatar}">`;
            }
            cell += "<span>" + item.creatorName + "</span>";
            cell += "</div>";
          }
          cell += "<span>" + date.toLocaleString() + "</span>";
          cell += "</div>";
          cell += `<div class="body">`;
          cell += marked.parse(item.content || "");
          
          var imgs = [];
          for (let res of item.resourceList) {
            if (res.type?.includes("image/")) {
              imgs.push(res);
            }
          }
          if (imgs.length > 0) {
            cell += '<div class="tag-plugin image">';
            for (let img of imgs) {
              if (img.externalLink?.length > 0) {
                cell += `<div class="image-bg"><img src="${img.externalLink}" data-fancybox="memos"></div>`;
              } else {
                cell += `<div class="image-bg"><img src="https://${host}/o/r/${img.id}" data-fancybox="memos"></div>`;
              }
            }
            cell += "</div>";
          }
          cell += "</div>";
          cell += "</div>";  // 结束 timenode
          html += cell;
        });

        // 如果是追加模式，添加到现有内容后面
        if (append) {
          $(el).find('.timenode').last().after(html);
        } else {
          // 清空现有内容（除了加载更多按钮）并添加新内容
          $(el).find('.timenode').remove();
          $(el).prepend(html);
        }

        // 如果没有数据了，隐藏加载更多按钮
        if (data.length < limit) {
          loadMoreBtn.style.display = 'none';
        } else {
          loadMoreBtn.style.display = 'block';
        }

        // 初始化 fancybox
        if (window.Fancybox) {
          window.Fancybox.bind('[data-fancybox="memos"]');
        }
      }

      // 加载数据的函数
      function loadTelegram(offset = 0, append = false) {
        const apiUrl = new URL(api);
        apiUrl.searchParams.set('limit', limit);
        apiUrl.searchParams.set('offset', offset);
        
        utils.request(el, apiUrl.toString(), function(data) {
          renderTelegram(data, append);
          // 更新offset
          el.dataset.offset = (offset + data.length).toString();
        });
      }

      // 初始加载
      loadTelegram(0, false);

      // 绑定加载更多事件
      loadMoreBtn.addEventListener('click', function() {
        const currentOffset = parseInt(el.dataset.offset);
        loadTelegram(currentOffset, true);
      });
    }
  });
});