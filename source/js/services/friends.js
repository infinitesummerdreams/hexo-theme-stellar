utils.jq(() => {
  $(function () {
    const els = document.getElementsByClassName("ds-friends");
    for (var i = 0; i < els.length; i++) {
      const el = els[i];
      const api = el.getAttribute("api");
      if (api == null) {
        continue;
      }
      const default_avatar = def.avatar;
      // layout
      utils.request(el, api, function (data) {
        for (let item of data.content || data) {
          var cell = `<div class="grid-cell user-card">`;
          cell += `<div class="card-link" onclick="window.open('${
            item.html_url || item.url
          }', '_blank')">`;
          cell += `<div class="friend-link-header">`;
          cell += `<div class="name image-meta">`;
          cell += `<span class="image-caption">${
            item.title || item.login
          }</span>`;
          // Adding description and note
          if (item.description) {
            cell += `<div class="user-description">${item.description}</div>`;
          }
          cell += `</div>`;
          cell += `<img src="${
            item.avatar_url || item.avatar || item.icon || default_avatar
          }" onerror="javascript:this.removeAttribute('data-src');this.src='${default_avatar}';"/>`;
          cell += `</div>`;
          if (item.note) {
            cell += `<div class="user-note">${item.note}</div>`;
          }
          cell += `</div>`;
          cell += `</div>`;
          $(el).find(".grid-box").append(cell);
        }
      });
    }
  });
});
