document.addEventListener('DOMContentLoaded', function() {
    const orderSelect = document.getElementById('id_order');
    const valueInput = document.getElementById('id_value');

    if (orderSelect && valueInput) {
        orderSelect.addEventListener('change', function() {
            const orderId = orderSelect.value;
            if (!orderId) return;

            // Fetch the order total from a simple API endpoint we'll create
            fetch(`/api/order-total/${orderId}/`)
                .then(response => response.json())
                .then(data => {
                    if (data.total_amount) {
                        valueInput.value = data.total_amount;
                    }
                })
                .catch(error => console.error('Error fetching order total:', error));
        });
    }
});
