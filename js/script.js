document.addEventListener('DOMContentLoaded', () => {
    const IVA_RATE = 0.21;
    const AHORA_18_INTEREST = 0.75;

    const form = document.getElementById('presupuestoForm');
    const productosTable = document.getElementById('productosTable').getElementsByTagName('tbody')[0];

    const calcularTotales = () => {
        let totalSinIVA = 0;

        Array.from(productosTable.rows).forEach(row => {
            const cantidad = parseInt(row.querySelector('.cantidad').value);
            const precioUnitario = parseFloat(row.querySelector('.precioUnitario').value);
            const subtotal = precioUnitario * cantidad;
            row.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
            totalSinIVA += subtotal;
        });

        const iva = totalSinIVA * IVA_RATE;
        const totalConIVA = totalSinIVA + iva;
        const totalAhora12 = totalConIVA;
        const totalAhora18 = totalConIVA * (1 + AHORA_18_INTEREST);

        document.getElementById('totalSinIVA').textContent = `$${totalSinIVA.toFixed(2)}`;
        document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
        document.getElementById('totalConIVA').textContent = `$${totalConIVA.toFixed(2)}`;
        document.getElementById('totalAhora12').textContent = `$${totalAhora12.toFixed(2)}`;
        document.getElementById('totalAhora18').textContent = `$${totalAhora18.toFixed(2)}`;
    };

    productosTable.addEventListener('change', e => {
        if (e.target.classList.contains('producto') || e.target.classList.contains('cantidad') || e.target.classList.contains('precioUnitario')) {
            calcularTotales();
        }
    });

    document.getElementById('agregarProducto').addEventListener('click', () => {
        if (productosTable.rows.length < 5) {
            const nuevaFila = productosTable.insertRow();
            nuevaFila.innerHTML = `
                <td> 
                    <input type="number" class="cantidad" min="1" value="1">
                </td> 
                <td> 
                    <select class="producto" name="producto">
                        <option value="100">Producto A</option>
                        <option value="200">Producto B</option>
                        <option value="300">Producto C</option>
                        <option value="400">Producto D</option>
                        <option value="500">Producto E</option>
                    </select>
                </td> 
                <td>
                    <input type="number" class="precioUnitario" min="0" value="100" step="0.01">
                </td>
                <td class="subtotal">$100</td> 
            `;
            calcularTotales();
        } else {
            alert('Solo se permiten hasta 5 productos.');
        }
    });

    document.getElementById('imprimir').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('exportarPDF').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text('Presupuesto', 10, 10);
        doc.text(`Cliente: ${document.getElementById('nombre').value}`, 50, 10);

        const rows = [];
        Array.from(productosTable.rows).forEach(row => {
            const cantidad = row.querySelector('.cantidad').value;
            const producto = row.querySelector('.producto').selectedOptions[0].text;
            const subtotal = row.querySelector('.subtotal').textContent;
            rows.push([cantidad, producto, subtotal]);
        });

        doc.autoTable({
            head: [['Cantidad', 'Producto', 'Subtotal']],
            body: rows
        });

        doc.text(`Total sin IVA: ${document.getElementById('totalSinIVA').textContent}`, 10, 70);
        doc.text(`IVA (21%): ${document.getElementById('iva').textContent}`, 10, 80);
        doc.text(`Total con IVA: ${document.getElementById('totalConIVA').textContent}`, 10, 90);
        doc.text(`Total Ahora 12 (sin interés): ${document.getElementById('totalAhora12').textContent}`, 10, 100);
        doc.text(`Total Ahora 18 (75% de interés): ${document.getElementById('totalAhora18').textContent}`, 10, 110);

        doc.save('presupuesto.pdf');
    });

    calcularTotales(); // Inicializar los totales
});