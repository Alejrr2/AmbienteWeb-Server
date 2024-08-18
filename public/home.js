// Función para mostrar el modal de agregar apelación
function showAddApelacionModal() {
    console.log("Usted ha entrado en la zona de agregar apelaciones 😎.");
    $('#addApelacionModal').modal('show');
}
 
// Manejo del envío del formulario para agregar apelación
$('#addApelacionForm').on('submit', function(event) {
    event.preventDefault();
 
    const motivo = $('#motivo').val();
    const estado = $('#estado').prop('checked'); // Suponiendo que el campo estado es un checkbox
    const id_usuario = $('#id_usuario').val(); // Asegúrate de tener un campo para el ID del usuario
 
    $.ajax({
        url: '/api/add-apelacion',
        method: 'POST',
        data: {
            motivo: motivo,
            estado: estado,
            id_usuario: id_usuario
        },
        success: function(apelacion) {
            console.log('Nueva apelación agregada:', apelacion);
 
            // Reseatea el modal y lo escondemos
            $('#addApelacionForm')[0].reset();
            $('#addApelacionModal').modal('hide');
            cargarApelaciones();
        },
        error: function(error) {
            console.error('Error al agregar la apelación:', error);
        }
    });
});
 
// Función para cargar apelaciones desde el servidor
function cargarApelaciones() {
    $.ajax({
        url: '/api/apelaciones',
        method: 'GET',
        success: function(data) {
            const tbody = $('#apelacionesBody');
            tbody.empty();
           
            data.forEach(apelacion => {
                const row = $('<tr>');
                row.append($('<td>').text(apelacion.id_apelacion));
                row.append($('<td>').text(apelacion.username));
                row.append($('<td>').text(apelacion.motivo));
                row.append($('<td>').text(apelacion.estado ? 'Activo' : 'Inactivo')); // Mostrar estado como texto
                row.append($('<td>').text(new Date(apelacion.fecha).toLocaleDateString())); // Formatear fecha
                row.append($('<td>')
                    .append('<button class="btn btn-primary btn-sm">Modificar</button>')
                    .append('<button class="btn btn-danger btn-sm">Eliminar</button>')
                );
                tbody.append(row);
            });
        },
        error: function(error) {
            console.error('Error al cargar las apelaciones:', error);
        }
    });
}
 
// Cargar apelaciones al iniciar la página
$(document).ready(function() {
    cargarApelaciones();
});