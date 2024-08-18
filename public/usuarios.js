// Función para mostrar el modal de agregar usuario
function showAddUsuarioModal() {
    console.log("Usted ha entrado en la zona de agregar usuarios 😎.");
    $('#addUsuarioModal').modal('show');
}
 
// Manejo del envío del formulario para agregar usuario
$('#addUsuarioForm').on('submit', function(event) {
    event.preventDefault();
 
    const username = $('#username').val();
    const firstName = $('#first_name').val();
    const lastName = $('#last_name').val();
    const password = $('#password').val();
    const rol = $('#rol').val();
 
    $.ajax({
        url: '/api/add-usuario',
        method: 'POST',
        data: {
            username: username,
            first_name: firstName,
            last_name: lastName,
            password: password,
            rol: rol
        },
        success: function(usuario) {
            console.log('Nuevo usuario agregado:', usuario);
 
            // Resetea el modal y lo escondemos
            $('#addUsuarioForm')[0].reset();
            $('#addUsuarioModal').modal('hide');
            cargarUsuarios();
        },
        error: function(error) {
            console.error('Error al agregar el usuario:', error);
        }
    });
});
 
// Función para mostrar mensajes
function showMessage(message, type) {
    const alert = $(`<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`);
    $('#messageContainer').append(alert);
}
 
// Función para cargar usuarios
function cargarUsuarios() {
    $.ajax({
        url: '/api/usuarios',
        method: 'GET',
        success: function(data) {
            const tbody = $('#usuariosBody');
            tbody.empty(); // Limpiar el contenido actual
           
            data.forEach(usuario => {
                const row = $('<tr>').addClass('user').attr('data-id', usuario.id_usuario);
                row.append($('<td>').text(usuario.id_usuario));
                row.append($('<td>').text(usuario.username));
                row.append($('<td>').text(usuario.first_name));
                row.append($('<td>').text(usuario.last_name));
                row.append($('<td>').text(usuario.rol));
                row.append($('<td>')
                    .append(`<button class="btn btn-danger" onclick="deleteUsuarioById(${usuario.id_usuario})">Eliminar</button>`)
                );
                tbody.append(row);
            });
        },
        error: function(error) {
            console.error('Error al cargar usuarios:', error);
        }
    });
}
 
// Función para eliminar un usuario por ID
function deleteUsuarioById(usuarioId) {
    $.ajax({
        type: 'DELETE',
        url: `/api/usuarios/${usuarioId}`,
        success: function(response) {
            if (response.success) {
                console.log('Usuario eliminado con ID:', usuarioId);
                showMessage('Usuario eliminado exitosamente.', 'success');
                // Eliminar la fila de la tabla
                $(`.user[data-id="${usuarioId}"]`).remove();
            } else {
                console.error('Error al eliminar usuario:', response);
                showMessage('Error al eliminar el usuario.', 'danger');
            }
        },
        error: function(error) {
            console.error('Error al eliminar usuario:', error);
            showMessage('Error al eliminar el usuario.', 'danger');
        }
    });
}
 
// Cargar usuarios al iniciar la página
$(document).ready(function() {
    cargarUsuarios();
});