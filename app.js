/* TaskFlow shared logic: storage, helpers, task form modal */
const App = {
  KEY: 'taskflow.tasks',
  all() { try { return JSON.parse(localStorage.getItem(this.KEY)) || []; } catch (e) { return []; } },
  save(list) { localStorage.setItem(this.KEY, JSON.stringify(list)); },
  iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
  today() { return this.iso(new Date()); },
  esc(s) { return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
  fmt(s) { if (!s) return 'No date'; const [y, m, d] = s.split('-'); return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); },
  sort(list) { return [...list].sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999')); },

  toggle(id) { const l = this.all(), t = l.find(x => x.id === id); if (t) { t.status = t.status === 'Completed' ? 'Pending' : 'Completed'; this.save(l); } },
  remove(id) { this.save(this.all().filter(x => x.id !== id)); },

  taskHTML(t) {
    const done = t.status === 'Completed', late = !done && t.dueDate && t.dueDate < this.today();
    return `<li class="task ${t.priority} ${done ? 'done' : ''}" data-id="${t.id}">
      <input type="checkbox" data-act="toggle" ${done ? 'checked' : ''} title="Mark completed">
      <div class="body"><strong>${this.esc(t.title)}</strong>
        ${t.description ? `<p>${this.esc(t.description)}</p>` : ''}
        <div class="meta"><span class="badge b-${t.priority}">${t.priority}</span>
          <span class="${late ? 'overdue' : ''}">📅 ${this.fmt(t.dueDate)}${late ? ' (overdue)' : ''}</span><span>${t.status}</span></div></div>
      <div class="actions"><button data-act="edit" title="Edit">✏️</button><button data-act="del" title="Delete">🗑️</button></div></li>`;
  },
  listHTML(list, emptyMsg) {
    return list.length ? list.map(t => this.taskHTML(t)).join('') : `<li class="empty">${emptyMsg}</li>`;
  },
  /* handle toggle / edit / delete clicks inside a container */
  bind(el) {
    el.addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b) return;
      const id = b.closest('.task').dataset.id, act = b.dataset.act;
      if (act === 'toggle') { this.toggle(id); this.refresh(); }
      if (act === 'edit') this.openForm(this.all().find(t => t.id === id));
      if (act === 'del' && confirm('Are you sure you want to delete this task?')) { this.remove(id); this.refresh(); }
    });
  },

  /* modal form */
  openForm(task, date) {
    const f = this.form; f.reset();
    f.id.value = task ? task.id : '';
    f.title.value = task ? task.title : '';
    f.description.value = task ? task.description : '';
    f.dueDate.value = task ? task.dueDate : (date || this.today());
    f.priority.value = task ? task.priority : 'Medium';
    f.status.value = task ? task.status : 'Pending';
    f.querySelector('h2').textContent = task ? 'Edit Task' : 'Add Task';
    this.modal.classList.add('open'); f.title.focus();
  },
  init(refresh) {
    this.refresh = refresh;
    const m = this.modal = document.createElement('div'); m.className = 'modal';
    m.innerHTML = `<form><h2>Add Task</h2><input type="hidden" name="id">
      <label>Title *</label><input name="title" required maxlength="80">
      <label>Description</label><textarea name="description" rows="3"></textarea>
      <div class="row"><div><label>Due date</label><input type="date" name="dueDate" required></div>
      <div><label>Priority</label><select name="priority"><option>Low</option><option selected>Medium</option><option>High</option></select></div></div>
      <label>Status</label><select name="status"><option>Pending</option><option>Completed</option></select>
      <div class="row"><button class="btn" type="submit">Save</button><button class="btn ghost" type="button" id="cancel">Cancel</button></div></form>`;
    document.body.appendChild(m);
    const f = this.form = m.querySelector('form');
    m.querySelector('#cancel').onclick = () => m.classList.remove('open');
    m.addEventListener('mousedown', e => { if (e.target === m) m.classList.remove('open'); });
    f.addEventListener('submit', e => {
      e.preventDefault();
      const data = { title: f.title.value.trim(), description: f.description.value.trim(), dueDate: f.dueDate.value, priority: f.priority.value, status: f.status.value };
      if (!data.title) return;
      const list = this.all();
      if (f.id.value) Object.assign(list.find(t => t.id === f.id.value), data);
      else list.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), ...data });
      this.save(list); m.classList.remove('open'); this.refresh();
    });
    refresh();
  }
};
