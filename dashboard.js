const $ = id => document.getElementById(id);
$('add').onclick = () => App.openForm();
App.bind($('today')); App.bind($('upcoming'));
App.init(() => {
  const all = App.all(), t = App.today(), done = all.filter(x => x.status === 'Completed').length;
  const pend = all.filter(x => x.status !== 'Completed');
  $('stats').innerHTML = [['s1', all.length, 'Total Tasks'], ['s2', done, 'Completed'], ['s3', pend.length, 'Pending'], ['s4', pend.filter(x => x.dueDate && x.dueDate < t).length, 'Overdue']]
    .map(s => `<div class="stat ${s[0]}"><b>${s[1]}</b>${s[2]}</div>`).join('');
  $('today').innerHTML = App.listHTML(App.sort(all.filter(x => x.dueDate === t)), 'No tasks for today 🎉');
  $('upcoming').innerHTML = App.listHTML(App.sort(pend.filter(x => x.dueDate > t)).slice(0, 6), 'No upcoming deadlines.');
});
