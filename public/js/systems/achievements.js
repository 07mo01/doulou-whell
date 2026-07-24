(function (global) {
  let globalAchievements = [];

  function loadGlobalAchievements() {
    try {
      globalAchievements = JSON.parse(localStorage.getItem('dl_achievements')) || [];
    } catch (e) {
      globalAchievements = [];
    }
    return globalAchievements;
  }

  function saveGlobalAchievements() {
    localStorage.setItem('dl_achievements', JSON.stringify(globalAchievements));
  }

  function showAchievementNotification(achievement) {
    let notification = document.createElement('div');
    notification.style.cssText = 'position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#2a2a6e,#1a1a4e);border:2px solid var(--gold);border-radius:12px;padding:15px 25px;z-index:200;animation:fadeUp .5s;font-size:14px;';
    notification.innerHTML = `<div style="color:var(--gold);font-weight:bold;">🏆 成就解锁！</div><div style="margin-top:4px;">${achievement.icon} ${achievement.name}</div><div style="color:var(--gray);font-size:12px;">${achievement.desc}</div>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  function checkAchievements() {
    if (!global.G) return;
    ACHIEVEMENTS.forEach(achievement => {
      if (!globalAchievements.includes(achievement.id) && achievement.check(global.G)) {
        globalAchievements.push(achievement.id);
        saveGlobalAchievements();
        showAchievementNotification(achievement);
      }
    });
  }

  function renderAchievements() {
    loadGlobalAchievements();
    const grid = document.getElementById('ach-grid');
    grid.innerHTML = ACHIEVEMENTS.map(achievement => {
      let unlocked = globalAchievements.includes(achievement.id);
      return `<div class="ach-card ${unlocked ? 'unlocked' : 'locked'}">
      <div class="ach-icon">${achievement.icon}</div>
      <div class="ach-name">${achievement.name}</div>
      <div class="ach-desc">${achievement.desc}</div>
      <div class="ach-cat">${achievement.cat}</div>
    </div>`;
    }).join('');
  }

  global.loadGlobalAchievements = loadGlobalAchievements;
  global.saveGlobalAchievements = saveGlobalAchievements;
  global.showAchievementNotification = showAchievementNotification;
  global.checkAchievements = checkAchievements;
  global.renderAchievements = renderAchievements;
})(window);