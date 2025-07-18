document.addEventListener('DOMContentLoaded', () => {
    const applicationForm = document.getElementById('applicationForm');
    const companyNameInput = document.getElementById('companyName');
    const roleNameInput = document.getElementById('roleName'); // Get the new role input
    const applicationStatusSelect = document.getElementById('applicationStatus');
    const applicationTableBody = document.querySelector('#applicationTable tbody');

    let applications = JSON.parse(localStorage.getItem('applications')) || [];

    // Function to render applications in the table
    function renderApplications() {
        applicationTableBody.innerHTML = ''; // Clear existing rows
        applications.forEach((app, index) => {
            const row = applicationTableBody.insertRow();
            row.dataset.index = index; // Store the index for easy access

            // Company Name Cell
            const companyCell = row.insertCell();
            companyCell.textContent = app.company;
            companyCell.contentEditable = true; // Make company name editable
            companyCell.addEventListener('blur', (e) => {
                const newCompanyName = e.target.textContent.trim();
                if (newCompanyName !== app.company) {
                    app.company = newCompanyName;
                    saveApplications();
                }
            });

            // Role Cell (New)
            const roleCell = row.insertCell();
            roleCell.textContent = app.role; // Display the role
            roleCell.contentEditable = true; // Make role editable
            roleCell.addEventListener('blur', (e) => {
                const newRoleName = e.target.textContent.trim();
                if (newRoleName !== app.role) {
                    app.role = newRoleName;
                    saveApplications();
                }
            });

            // Status Cell
            const statusCell = row.insertCell();
            const statusDropdown = document.createElement('select');
            statusDropdown.classList.add('status-dropdown');
            ['Pending', 'Initial Interview', 'Assessment', 'Final Interview', 'Passed', 'Rejected', 'Offer'].forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                if (status === app.status) {
                    option.selected = true;
                }
                statusDropdown.appendChild(option);
            });
            statusDropdown.addEventListener('change', (e) => {
                app.status = e.target.value;
                saveApplications();
            });
            statusCell.appendChild(statusDropdown);

            // Actions Cell (Remove Button)
            const actionsCell = row.insertCell();
            actionsCell.classList.add('action-buttons');

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-btn');
            removeButton.addEventListener('click', () => {
                removeApplication(index);
            });
            actionsCell.appendChild(removeButton);
        });
    }

    // Function to add a new application
    applicationForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission

        const newApplication = {
            company: companyNameInput.value.trim(),
            role: roleNameInput.value.trim(), // Include the new role field
            status: applicationStatusSelect.value
        };

        if (newApplication.company && newApplication.role) { // Ensure both company and role are filled
            applications.push(newApplication);
            saveApplications();
            companyNameInput.value = ''; // Clear company input
            roleNameInput.value = ''; // Clear role input
            applicationStatusSelect.value = 'Pending'; // Reset status dropdown
            renderApplications(); // Re-render the table
        } else {
            alert('Please enter both Company Name and Applied Role.');
        }
    });

    // Function to remove an application
    function removeApplication(index) {
        applications.splice(index, 1); // Remove the application at the given index
        saveApplications();
        renderApplications(); // Re-render the table
    }

    // Function to save applications to local storage
    function saveApplications() {
        localStorage.setItem('applications', JSON.stringify(applications));
    }

    // Initial render when the page loads
    renderApplications();
});
