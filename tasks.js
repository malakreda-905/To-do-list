const $ = id => document.getElementById(id);
$('add').onclick = () => App.openForm();
App.bind($('list'));
App.init(() => {
  const q = $('q').value.toLowerCase(), s = $('fs').value, p = $('fp').value, all = App.all();
  const list = App.sort(all.filter(t => (!q || (t.title + t.description).toLowerCase().includes(q)) && (!s || t.status === s) && (!p || t.priority === p)));
  $('list').innerHTML = App.listHTML(list, all.length ? 'No tasks match your filters.' : 'No tasks yet. Click “Add Task” to create your first one!');
});
['q', 'fs', 'fp'].forEach(i => $(i).addEventListener('input', () => App.refresh()));
