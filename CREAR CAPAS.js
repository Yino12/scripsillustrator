if (app.documents.length > 0) {
    var doc = activeDocument;

    // Crear el cuadro de diálogo para seleccionar capas
    var layerDialog = new Window("dialog", "Seleccionar Capas");
    layerDialog.alignChildren = "left";

    // Lista de nombres de capas en orden invertido
    var layerNames = ["A", "GUIAS", "MONTAJE", "TROQUEL", "PM", "ORIGINAL", "COTAS Y ROTULO", "BLANCO", "SIMULACIÓN DE BLANCO" , "ARTE", "MATERIAL"];

    // Crear un checkbox para cada capa
    var checkboxes = [];
    for (var i = 0; i < layerNames.length; i++) {
        var checkbox = layerDialog.add("checkbox", undefined, layerNames[i]);
        checkbox.value = true; // Seleccionado por defecto
        checkboxes.push(checkbox);
    }

    // Botón para crear las capas
    var createLayersButton = layerDialog.add("button", undefined, "Crear Capas");
    createLayersButton.onClick = function() {
        createLayers();
        layerDialog.close();
    };

    // Botón para cancelar
    var cancelButton = layerDialog.add("button", undefined, "Cancelar");
    cancelButton.onClick = function() {
        layerDialog.close();
    };
// Función para crear las capas
function createLayers() {
    for (var i = checkboxes.length - 1; i >= 0; i--) {
        if (checkboxes[i].value) {
            try {
                var layer = doc.layers.getByName(layerNames[i]);
            } catch (e) {
                var layer = doc.layers.add();
                layer.name = layerNames[i];
            }
        }
    }
}


    // Mostrar el cuadro de diálogo de capas
    layerDialog.show();
}
