utils.jq(() => {
  const createCard = (item, defaultAvatar) => `
    <div class="grid-cell user-card">
      <a class="card-link" onclick="window.open('${item.html_url || item.url}', '_blank')">
        <div class="friend-link-header">
          <div class="name image-meta">
            <span class="image-caption">${item.title || item.login}</span>
            ${item.description ? `<div class="user-description">${item.description}</div>` : ''}
          </div>
          <img 
            src="${item.avatar_url || item.avatar || item.icon || defaultAvatar}" 
            onerror="this.removeAttribute('data-src');this.src='${defaultAvatar}';"
          />
        </div>
        ${item.note ? `<div class="user-note">${item.note}</div>` : ''}
      </a>
    </div>
  `;

  // Fisher-Yates shuffle
  const shuffle = arr => {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  [...document.getElementsByClassName("ds-friends")].forEach(el => {
    const api = el.getAttribute("api");
    if (!api) return;

    utils.request(el, api, data => {
      const content = shuffle(data.content || data);
      const cards = content.map(item => createCard(item, def.avatar)).join('');
      $(el).find(".grid-box").html(cards);
    });
  });
});