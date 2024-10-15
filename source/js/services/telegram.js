utils.jq(() => {
  $(function () {
    const els = document.getElementsByClassName("ds-telegram");
    for (var i = 0; i < els.length; i++) {
      const el = els[i];
      const api = el.getAttribute("api");
      if (api == null) {
        continue;
      }
      const default_avatar = el.getAttribute("avatar") || def.avatar;
      const limit = el.getAttribute("limit");
      const host = api.replace(/https:\/\/(.*?)\/(.*)/i, "$1");
      // layout
      utils.request(el, api, function (data) {
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
        data.forEach((item, i) => {
          if (limit && i >= limit) {
            return;
          }
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
          // const originalLink = `https://t.me/s/seeyounexttimeline/${item.id}`;
          // cell += `<a class="body" href="${originalLink}" target="_blank">`;
          // cell += `<div class="body" onclick="window.open('${item.originalUrl}', '_blank')">`;
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

          // cell += '<div class="flex right">';
          // cell +=
          //   '<a class="item comments last" href="' +
          //   item.originalUrl +
          //   '#comment" target="_blank" rel="external nofollow noopener noreferrer">';
          // // cell +=
          // //   '<span><svg t="1666270368054" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2528" width="200" height="200"><path d="M952 64H72C32.3 64 0 96.3 0 136v508c0 39.7 32.3 72 72 72h261l128 128c14 14 32.5 21.1 50.9 21.1s36.9-7 50.9-21.1l128-128h261c39.7 0 72-32.3 72-72V136c0.2-39.7-32.1-72-71.8-72zM222 462c-39.8 0-72-32.2-72-72s32.2-72 72-72 72 32.2 72 72-32.2 72-72 72z m290-7.7c-39.8 0-72-32.2-72-72s32.2-72 72-72 72 32.2 72 72c0 39.7-32.2 72-72 72z m290 8c-39.8 0-72-32.2-72-72s32.2-72 72-72 72 32.2 72 72c0 39.7-32.2 72-72 72z" p-id="2529"></path></svg> ' +
          // //   (item.comments || 0) +
          // //   "</span>";
          //   cell +=
          //   '<span><svg t="1666270368054" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2528" width="200" height="200"><path d="M952 64H72C32.3 64 0 96.3 0 136v508c0 39.7 32.3 72 72 72h261l128 128c14 14 32.5 21.1 50.9 21.1s36.9-7 50.9-21.1l128-128h261c39.7 0 72-32.3 72-72V136c0.2-39.7-32.1-72-71.8-72zM222 462c-39.8 0-72-32.2-72-72s32.2-72 72-72 72 32.2 72 72-32.2 72-72 72z m290-7.7c-39.8 0-72-32.2-72-72s32.2-72 72-72 72 32.2 72 72c0 39.7-32.2 72-72 72z m290 8c-39.8 0-72-32.2-72-72s32.2-72 72-72 72 32.2 72 72c0 39.7-32.2 72-72 72z" p-id="2529"></path></svg></span>';
          // cell += "</a>";
          // cell += "</div>";

          cell += "</div>";
          // cell += "</a>"; // Close the <a> tag here inside the body
          // cell += "</div>"; // Close the timenode div
          $(el).append(cell);
        });
      });
    }
  });
});
