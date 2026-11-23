const $ = id => document.getElementById(id);
let view = new Date(); view.setDate(1);
let selected = App.today();
$('cal').onclick = e => { const d = e.target.closest('[data-date]'); if (d) { selected = d.dataset.date; App.refresh(); } };
$('prev').onclick = () => { view.setMonth(view.getMonth() - 1); App.refresh(); };
$('next').onclick = () => { view.setMonth(view.getMonth() + 1); App.refresh(); };
$('add').onclick = () => App.openForm(null, selected);
App.bind($('dayTasks'));
App.init(() => {
  const y = view.getFullYear(), m = view.getMonth(), all = App.all();
  $('title').textContent = view.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  let h = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<div class="dow">${d}</div>`).join('');
  for (let i = 0; i < new Date(y, m, 1).getDay(); i++) h += '<div class="day blank"></div>';
  for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++) {
    const iso = App.iso(new Date(y, m, d)), ts = all.filter(t => t.dueDate === iso);
    h += `<div class="day ${iso === App.today() ? 'today' : ''} ${iso === selected ? 'sel' : ''}" data-date="${iso}">${d}<br>${ts.slice(0, 6).map(t => `<span class="dot d-${t.priority}"></span>`).join('')}</div>`;
  }
  $('cal').innerHTML = h;
  $('seltitle').textContent = '📌 ' + App.fmt(selected);
  $('dayTasks').innerHTML = App.listHTML(all.filter(t => t.dueDate === selected), 'No tasks on this date.');
});
