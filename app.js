let authToken = "";

    function authenticateUser() {
        const loginId = document.getElementById('login_id').value;
        const password = document.getElementById('password').value;

        fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                login_id: loginId,
                password: password
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Authentication failed');
            }
            return response.json();
        })
        .then(data => {
            authToken = data.access_token;
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('customerListScreen').style.display = 'block';
        })
        .catch(error => {
            alert('Authentication failed. Please check your credentials.'+' '+ password);
            console.error('Authentication Error:', error);
        });
    }

    function getCustomerList() {
        fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=get_customer_list`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to retrieve customer list');
            }
            return response.json();
        })
        .then(data => {
            const customerList = document.getElementById('customerList');
            customerList.innerHTML = '';
            data.forEach(customer => {
                const listItem = document.createElement('li');
                listItem.textContent = `${customer.first_name} ${customer.last_name} - ${customer.address} -${customer.city}- ${customer.state} - ${customer.email} - ${customer.phone}`;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => deleteCustomer(customer.uuid));

                const updateButton = document.createElement('button');
                updateButton.textContent = 'Update';
                updateButton.addEventListener('click', () => updateCustomer(customer.uuid));

                listItem.appendChild(deleteButton);
                listItem.appendChild(updateButton);

                customerList.appendChild(listItem);
            });
        })
        .catch(error => {
            alert('Failed to retrieve customer list.');
            console.error('Get Customer List Error:', error);
        });
    }

    function gotoAddCustomer(){
        document.getElementById('customerListScreen').style.display = 'none';
        document.getElementById('addCustomerScreen').style.display = 'block';
    }

    function createNewCustomer() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const street = document.getElementById('street').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;


    

        fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                street: street,
                address: address,
                city: city,
                state: state,
                email: email,
                phone: phone
            })
        })
        .then(response => {
            if (response.status === 201) {
                alert('Customer created successfully!');
            } else if (response.status === 400) {
                alert('Failed to create customer. First Name or Last Name is missing.');
            } else {
                throw new Error('Failed to create customer');
            }
        })
        .catch(error => {
            console.error('Create Customer Error:', error);
        });
    }

    function deleteCustomer(uuid) {
        fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=delete&uuid=${uuid}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        })
        .then(response => {
            if (response.status === 200) {
                alert('Customer deleted successfully!');
            } else if (response.status === 500) {
                alert('Error: Customer not deleted.');
            } else if (response.status === 400) {
                alert('Error: UUID not found.');
            } else {
                throw new Error('Failed to delete customer');
            }
        })
        .catch(error => {
            console.error('Delete Customer Error:', error);
        });
    }

    function updateCustomer(uuid) {
        // Get updated customer data from the form or other input sources
        const updatedFirstName = prompt('Enter updated first name:');
        const updatedLastName = prompt('Enter updated last name:');
        const updatedStreet = prompt('Enter updated street:');
        const updatedAddress = prompt('Enter updated address:');
        const updatedCity = prompt('Enter updated city:');
        const updatedState = prompt('Enter updated state:');
        const updatedEmail = prompt('Enter updated email:');
        const updatedPhone = prompt('Enter updated phone number:');
    
        fetch(`https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp?cmd=update&uuid=${uuid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                first_name: updatedFirstName,
                last_name: updatedLastName,
                street: updatedStreet,
                address: updatedAddress,
                city: updatedCity,
                state: updatedState,
                email: updatedEmail,
                phone: updatedPhone
            })
        })
        .then(response => {
            if (response.status === 200) {
                alert('Customer updated successfully!');
                // Refresh the customer list after updating
                getCustomerList();
            } else if (response.status === 500) {
                alert('Error: Customer not updated.');
            } else if (response.status === 400) {
                alert('Error: UUID not found.');
            } else {
                throw new Error('Failed to update customer');
            }
        })
        .catch(error => {
            console.error('Update Customer Error:', error);
        });
    }