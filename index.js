const jobForm = document.getElementById('job-form');
const jobList = document.getElementById('job-list');

// Load from localStorage
document.addEventListener('DOMContentLoaded', loadJobs);

jobForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const company = document.getElementById('company').value.trim();
  const roles = document.getElementById('roles').value.trim();
  const status = document.getElementById('status').value;

  if (!company || !roles) return;

  const job = {
    id: Date.now(),
    company,
    roles,
    status
  };

  addJobToDOM(job);
  saveJobToStorage(job);

  jobForm.reset();
});

function addJobToDOM(job) {
  const li = document.createElement('li');
  li.className = 'job-item';
  li.dataset.id = job.id;

  const statusOptions = [
    'Pending',
    'Assessment',
    'Initial Interview',
    'Final Interview',
    'Rejected',
    'Passed'
  ];

  const statusSelect = document.createElement('select');
  statusSelect.className = 'status-dropdown';

  statusOptions.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    if (option === job.status) opt.selected = true;
    statusSelect.appendChild(opt);
  });

  statusSelect.addEventListener('change', () => {
    updateJobStatus(job.id, statusSelect.value);
  });

  li.innerHTML = `
    <span><strong>Company:</strong> ${job.company}</span>
    <span><strong>Roles:</strong> ${job.roles}</span>
  `;
  li.appendChild(statusSelect);

  const removeBtn = document.createElement('span');
  removeBtn.textContent = 'Remove';
  removeBtn.className = 'remove-btn';
  removeBtn.addEventListener('click', () => {
    removeJob(job.id);
  });

  li.appendChild(removeBtn);
  jobList.appendChild(li);
}

function saveJobToStorage(job) {
  const jobs = getJobsFromStorage();
  jobs.push(job);
  localStorage.setItem('jobs', JSON.stringify(jobs));
}

function getJobsFromStorage() {
  return JSON.parse(localStorage.getItem('jobs')) || [];
}

function loadJobs() {
  const jobs = getJobsFromStorage();
  jobs.forEach(job => addJobToDOM(job));
}

function removeJob(id) {
  const jobs = getJobsFromStorage().filter(job => job.id !== id);
  localStorage.setItem('jobs', JSON.stringify(jobs));

  const item = document.querySelector(`.job-item[data-id='${id}']`);
  if (item) item.remove();
}

function updateJobStatus(id, newStatus) {
  const jobs = getJobsFromStorage().map(job => {
    if (job.id === id) {
      job.status = newStatus;
    }
    return job;
  });
  localStorage.setItem('jobs', JSON.stringify(jobs));
}
