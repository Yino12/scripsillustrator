if (app.documents.length > 0) {

    // Documento
    var doc = activeDocument;
    // Contar elementos seleccionados
    var selectedItems = parseInt(doc.selection.length, 10) || 0;

    /*----------  Valores por defecto  ----------*/
    // Unidades
    var setUnits = true;
    var defaultUnits = $.getenv("Specify_defaultUnits") ? convertToBoolean($.getenv("Specify_defaultUnits")) : setUnits;
    // Tamaño de fuente
    var setFontSize = 8;
    var defaultFontSize = $.getenv("Specify_defaultFontSize") ? convertToUnits($.getenv("Specify_defaultFontSize")).toFixed(3) : setFontSize;
    // Colores
    var setCyan = 0;
    var defaultColorCyan = $.getenv("Specify_defaultColorCyan") ? $.getenv("Specify_defaultColorCyan") : setCyan;
    var setMagenta = 0;
    var defaultColorMagenta = $.getenv("Specify_defaultColorMagenta") ? $.getenv("Specify_defaultColorMagenta") : setMagenta;
    var setYellow = 0;
    var defaultColorYellow = $.getenv("Specify_defaultColorYellow") ? $.getenv("Specify_defaultColorYellow") : setYellow;
    var setBlack = 0;
    var defaultColorBlack = $.getenv("Specify_defaultColorBlack") ? $.getenv("Specify_defaultColorBlack") : setBlack;
    // Decimales
    var setDecimals = 2;
    var defaultDecimals = $.getenv("Specify_defaultDecimals") ? $.getenv("Specify_defaultDecimals") : setDecimals;

    /*=====================================
    =            Crear Diálogo            =
    =====================================*/

    // Cuadro de diálogo
    var specifyDialogBox = new Window("dialog", "COTAS");
    specifyDialogBox.alignChildren = "left";

    // Panel de dimensiones
    dimensionPanel = specifyDialogBox.add("panel", undefined, "Seleccionar Posición de las COTAS");
    dimensionPanel.orientation = "column";
    dimensionPanel.alignment = "fill";
    dimensionPanel.margins = [20, 20, 20, 10];

    /*----------  Panel de Dimensiones  ----------*/
    dimensionGroup = dimensionPanel.add("group");
    dimensionGroup.orientation = "row";

    // Arriba
    (topCheckbox = dimensionGroup.add("checkbox", undefined, "Arriba")).helpTip = "Dimensión del lado superior del objeto(s).";
    topCheckbox.value = false;

    // Derecha
    (rightCheckbox = dimensionGroup.add("checkbox", undefined, "Derecha")).helpTip = "Dimensión del lado derecho del objeto(s).";
    rightCheckbox.value = false;

    // Abajo
    (bottomCheckbox = dimensionGroup.add("checkbox", undefined, "Abajo")).helpTip = "Dimensión del lado inferior del objeto(s).";
    bottomCheckbox.value = false;

    // Izquierda
    (leftCheckbox = dimensionGroup.add("checkbox", undefined, "Izquierda")).helpTip = "Dimensión del lado izquierdo del objeto(s).";
    leftCheckbox.value = false;

    /*----------  Seleccionar Todo  ----------*/
    selectAllGroup = dimensionPanel.add("group");
    selectAllGroup.orientation = "row";

    (selectAllCheckbox = selectAllGroup.add("checkbox", undefined, "Seleccionar Todo")).helpTip = "Dimensión de todos los lados del objeto(s).";
    selectAllCheckbox.value = false;
    selectAllCheckbox.onClick = function () {
      if (selectAllCheckbox.value) {
        // Seleccionar Todo está marcado
        topCheckbox.value = true;
        topCheckbox.enabled = false;

        rightCheckbox.value = true;
        rightCheckbox.enabled = false;

        bottomCheckbox.value = true;
        bottomCheckbox.enabled = false;

        leftCheckbox.value = true;
        leftCheckbox.enabled = false;
      } else {
        // Seleccionar Todo está desmarcado
        topCheckbox.value = false;
        topCheckbox.enabled = true;

        rightCheckbox.value = false;
        rightCheckbox.enabled = true;

        bottomCheckbox.value = false;
        bottomCheckbox.enabled = true;

        leftCheckbox.value = false;
        leftCheckbox.enabled = true;
      }
    }

    /*----------  Panel de Opciones  ----------*/
    var optionsPanel = specifyDialogBox.add("panel", undefined, "Opciones");
    optionsPanel.orientation = "column";
    optionsPanel.margins = 20;
    optionsPanel.alignChildren = "left";

    // Añadir casillas de verificación del panel de opciones
    (units = optionsPanel.add("checkbox", undefined, "Incluir Unidades")).helpTip = "Cuando está marcado, inserta la etiqueta de unidades junto con\nla dimensión de salida.\nEjemplo: 220 px";
    units.value = defaultUnits;

    // Si exactamente 2 objetos están seleccionados, dar al usuario la opción de dimensionar ENTRE ellos
    if (selectedItems == 2) {
      (between = optionsPanel.add("checkbox", undefined, "Distancia entre objetos")).helpTip = "Cuando está marcado, devuelve la distancia entre\nlos 2 objetos para las dimensiones seleccionadas.";
      between.value = false;
    }

    // Añadir caja de tamaño de fuente
    fontGroup = optionsPanel.add("group");
    fontGroup.orientation = "row";
    fontLabel = fontGroup.add("statictext", undefined, "Tamaño de Fuente:");
    (fontSizeInput = fontGroup.add("edittext", undefined, defaultFontSize)).helpTip = "Ingrese el tamaño de fuente deseado para la(s) etiqueta(s) de dimensión.\nPor defecto: " + setFontSize;
    fontUnitsLabelText = "";
    switch (doc.rulerUnits) {
      case RulerUnits.Picas:
      fontUnitsLabelText = "pc";
      break;
      case RulerUnits.Inches:
      fontUnitsLabelText = "in";
      break;
      case RulerUnits.Millimeters:
      fontUnitsLabelText = "mm";
      break;
      case RulerUnits.Centimeters:
      fontUnitsLabelText = "cm";
      break;
      case RulerUnits.Pixels:
      fontUnitsLabelText = "px";
      break;
      default:
      fontUnitsLabelText = "pt";
    }
    fontUnitsLabel = fontGroup.add("statictext", undefined, fontUnitsLabelText);
    fontSizeInput.characters = 5;
    fontSizeInput.onActivate = function () {
      restoreDefaultsButton.enabled = true;
    }

    /*----------  Añadir grupo de colores  ----------*/
    colorGroup = optionsPanel.add("group");
    colorGroup.orientation = "row";
    colorLabel = colorGroup.add("statictext", [0, 0, 0, 0], "Color (CMYK):");
    // Cian
    (colorInputCyan = colorGroup.add("edittext", [0, 0, 0, 0], 0)).helpTip = "Ingrese el valor de color Cian CMYK para usar en la(s) etiqueta(s) de dimensión.\nPor defecto: " + setCyan;
    colorInputCyan.characters = 3;
    // Magenta
    (colorInputMagenta = colorGroup.add("edittext", [0, 0, 0, 0], 100)).helpTip = "Ingrese el valor de color Magenta CMYK para usar en la(s) etiqueta(s) de dimensión.\nPor defecto: " + setMagenta;
    colorInputMagenta.characters = 3;
    // Amarillo
    (colorInputYellow = colorGroup.add("edittext", [0, 0, 0, 0], 0)).helpTip = "Ingrese el valor de color Amarillo CMYK para usar en la(s) etiqueta(s) de dimensión.\nPor defecto: " + setYellow;
    colorInputYellow.characters = 3;
    // Negro
    (colorInputBlack = colorGroup.add("edittext", [0, 0, 0, 0], 0)).helpTip = "Ingrese el valor de color Negro CMYK para usar en la(s) etiqueta(s) de dimensión.\nPor defecto: " + setBlack;
    colorInputBlack.characters = 3;

    colorInputCyan.onActivate = function () {
        restoreDefaultsButton.enabled = true;
    }
    colorInputMagenta.onActivate = function () {
        restoreDefaultsButton.enabled = true;
    }
    colorInputYellow.onActivate = function () {
        restoreDefaultsButton.enabled = true;
    }
    colorInputBlack.onActivate = function () {
        restoreDefaultsButton.enabled = true;
    }

    // Añadir caja de lugares decimales
    decimalPlacesGroup = optionsPanel.add("group");
    decimalPlacesGroup.orientation = "row";
    decimalPlacesLabel = decimalPlacesGroup.add("statictext", undefined, "Lugares Decimales:");
    (decimalPlacesInput = decimalPlacesGroup.add("edittext", undefined, defaultDecimals)).helpTip = "Ingrese el número deseado de lugares decimales para\nmostrar en las dimensiones de la etiqueta.\nPor defecto: " + setDecimals;
    decimalPlacesInput.characters = 4;
    decimalPlacesInput.onActivate = function () {
      restoreDefaultsButton.enabled = true;
    }

    // Añadir campos de entrada para cotas personalizadas en la interfaz de usuario
    var customDimensionGroup = optionsPanel.add("group");
    customDimensionGroup.orientation = "row";
    var customDimensionLabel = customDimensionGroup.add("statictext", undefined, "Cota Personalizada:");
    var customDimensionInput = customDimensionGroup.add("edittext", undefined, "");
    customDimensionInput.helpTip = "Ingrese el valor de la cota personalizada.";
    customDimensionInput.characters = 10;

    // Texto de información
    infoText = optionsPanel.add("statictext", undefined, "Las opciones son persistentes hasta que se cierra la aplicación");
    infoText.margins = 20;
    // Deshabilitar para hacer que el texto aparezca sutil
    infoText.enabled = false;

    // Botón de restaurar valores por defecto
    restoreDefaultsButton = optionsPanel.add("button", undefined, "Restaurar Valores por Defecto");
    restoreDefaultsButton.alignment = "left";
    restoreDefaultsButton.enabled = (setFontSize != defaultFontSize || setCyan != defaultColorCyan || setMagenta != defaultColorMagenta || setYellow != defaultColorYellow || setBlack != defaultColorBlack || setDecimals != defaultDecimals ? true : false);
    restoreDefaultsButton.onClick = function () {
      restoreDefaults();
    }

    function restoreDefaults() {
      units.value = setUnits;
      fontSizeInput.text = setFontSize;
      colorInputCyan.text = setCyan;
      colorInputMagenta.text = setMagenta;
      colorInputYellow.text = setYellow;
      colorInputBlack.text = setBlack;
      decimalPlacesInput.text = setDecimals;
      restoreDefaultsButton.enabled = false;
      // Desactivar variables ambientales
      $.setenv("Specify_defaultUnits", "");
      $.setenv("Specify_defaultFontSize", "");
      $.setenv("Specify_defaultColorCyan", "");
      $.setenv("Specify_defaultColorMagenta", "");
      $.setenv("Specify_defaultColorYellow", "");
      $.setenv("Specify_defaultColorBlack", "");
      $.setenv("Specify_defaultDecimals", "");
    }

    /*----------  Grupo de Botones  ----------*/
    buttonGroup = specifyDialogBox.add("group");
    buttonGroup.orientation = "row";
    buttonGroup.alignment = "right";
    buttonGroup.margins = [20, 0, 20, 20]; // [izquierda, arriba, derecha, abajo]

    // Botón de cancelar
    cancelButton = buttonGroup.add("button", undefined, "Cancelar");
    cancelButton.onClick = function () {
      specifyDialogBox.close();
    }

    // Botón de especificar
    specifyButton = buttonGroup.add("button", undefined, "Aplicar COTAS");
    specifyButton.size = [125, 40];
    specifyDialogBox.defaultElement = specifyButton;
    specifyButton.onClick = function () {
      startSpec();
    }

    /*=====  Fin de Crear Diálogo  ======*/

    // Capa de especificaciones
    try {
      var specsLayer = doc.layers["COTAS"];
    } catch (err) {
      var specsLayer = doc.layers.add();
      specsLayer.name = "COTAS";
    }

    // Define el color directamente
    var color = new CMYKColor();
    color.cyan = 100;
    color.magenta = 0;
    color.yellow = 0;
    color.black = 0;

    // Declarar variable global de decimales
    var decimals;

    // Espacio entre líneas de medición y objeto
    var gap = 20;

    // Tamaño de líneas de medición perpendiculares.
    var size = 6;

    // Iniciar la especificación
    function startSpec() {

      // Añadir todos los objetos seleccionados a un array
      var objectsToSpec = new Array();
      for (var index = doc.selection.length - 1; index >= 0; index--) {
        objectsToSpec[index] = doc.selection[index];
      }

      // Obtener dimensiones deseadas
      var top = topCheckbox.value;
      var left = leftCheckbox.value;
      var right = rightCheckbox.value;
      var bottom = bottomCheckbox.value;
      // Quitar el enfoque de fontSizeInput para validar (numérico)
      fontSizeInput.active = false;

      // Establecer bool para variables numéricas
      var validFontSize = /^[0-9]{1,3}(\.[0-9]{1,3})?$/.test(fontSizeInput.text);

      var validCyanColor = /^[0-9]{1,3}$/.test(colorInputCyan.text);
      var validMagentaColor = /^[0-9]{1,3}$/.test(colorInputMagenta.text);
      var validYellowColor = /^[0-9]{1,3}$/.test(colorInputYellow.text);
      var validBlackColor = /^[0-9]{1,3}$/.test(colorInputBlack.text);
      // Si los colores son válidos, establecer variables
      if (validCyanColor && validMagentaColor && validYellowColor && validBlackColor) {
        color.Cyan = colorInputCyan.text;
        color.Magenta = colorInputMagenta.text;
        color.Yellow = colorInputYellow.text;
        color.Black = colorInputBlack.text;
        // Establecer variables ambientales
        $.setenv("Specify_defaultColorCyan", color.Cyan);
        $.setenv("Specify_defaultColorMagenta", color.Magenta);
        $.setenv("Specify_defaultColorYellow", color.Yellow);
        $.setenv("Specify_defaultColorBlack", color.Black);
      }

      var validDecimalPlaces = /^[0-4]{1}$/.test(decimalPlacesInput.text);
      if (validDecimalPlaces) {
        // Número de lugares decimales en la medición
        decimals = decimalPlacesInput.text;
        // Establecer variable ambiental
        $.setenv("Specify_defaultDecimals", decimals);
      }

      if (selectedItems < 1) {
        beep();
        alert("Por favor seleccione al menos 1 objeto e intente nuevamente.");
        // Cerrar diálogo
        specifyDialogBox.close();
      } else if (!top && !left && !right && !bottom) {
        beep();
        alert("Por favor seleccione al menos 1 dimensión para dibujar.");
      } else if (!validFontSize) {
        // Si fontSizeInput.text no coincide con regex
        beep();
        alert("Por favor ingrese un tamaño de fuente válido. \n0.002 - 999.999");
        fontSizeInput.active = true;
        fontSizeInput.text = setFontSize;
      } else if (parseFloat(fontSizeInput.text, 10) <= 0.001) {
        beep();
        alert("El tamaño de fuente debe ser mayor que 0.001.");
        fontSizeInput.active = true;
      } else if (!validCyanColor || !validMagentaColor || !validYellowColor || !validBlackColor) {
        // Si las entradas CMYK no son numéricas
        beep();
        alert("Por favor ingrese un CMYKColor válido.");
        colorInputCyan.active = true;
        colorInputCyan.text = defaultColorCyan;
        colorInputMagenta.text = defaultColorMagenta;
        colorInputYellow.text = defaultColorYellow;
        colorInputBlack.text = defaultColorBlack;
      } else if (!validDecimalPlaces) {
        // Si decimalPlacesInput.text no es numérico
        beep();
        alert("Los lugares decimales deben estar en el rango de 0 - 4.");
        decimalPlacesInput.active = true;
        decimalPlacesInput.text = setDecimals;
      } else if (selectedItems == 2 && between.value) {
        if (top) specDouble(objectsToSpec[0], objectsToSpec[1], "Top");
        if (left) specDouble(objectsToSpec[0], objectsToSpec[1], "Left");
        if (right) specDouble(objectsToSpec[0], objectsToSpec[1], "Right");
        if (bottom) specDouble(objectsToSpec[0], objectsToSpec[1], "Bottom");
        // Cerrar diálogo cuando termine
        specifyDialogBox.close();
      } else {
        // Iterar sobre cada objeto seleccionado, creando dimensiones individuales a medida que avanza
        for (var objIndex = objectsToSpec.length - 1; objIndex >= 0; objIndex--) {
          if (top) specSingle(objectsToSpec[objIndex].geometricBounds, "Top");
          if (left) specSingle(objectsToSpec[objIndex].geometricBounds, "Left");
          if (right) specSingle(objectsToSpec[objIndex].geometricBounds, "Right");
          if (bottom) specSingle(objectsToSpec[objIndex].geometricBounds, "Bottom");
        }
        // Cerrar diálogo cuando termine
        specifyDialogBox.close();
      }
    }

    // Especificar un solo objeto
    function specSingle(bound, where) {
      // desbloquear capa de especificaciones
      specsLayer.locked = false;

      // ancho y alto
      var w = bound[2] - bound[0];
      var h = bound[1] - bound[3];

      // a y b son las posiciones horizontales o verticales que cambian
      // c es la posición horizontal o vertical que no cambia
      var a = bound[0];
      var b = bound[2];
      var c = bound[1];

      // xy='x' (medición horizontal), xy='y' (medición vertical)
      var xy = "x";

      // una bandera de dirección para colocar las líneas de medición.
      var dir = 1;

      switch (where) {
        case "Top":
        a = bound[0];
        b = bound[2];
        c = bound[1];
        xy = "x";
        dir = 1;
        break;
        case "Right":
        a = bound[1];
        b = bound[3];
        c = bound[2];
        xy = "y";
        dir = 1;
        break;
        case "Bottom":
        a = bound[0];
        b = bound[2];
        c = bound[3];
        xy = "x";
        dir = -1;
        break;
        case "Left":
        a = bound[1];
        b = bound[3];
        c = bound[0];
        xy = "y";
        dir = -1;
        break;
      }

      // Crear las líneas de medición
      var lines = new Array();

      // medición horizontal
      if (xy == "x") {

        // 2 líneas verticales
        lines[0] = new Array(new Array(a, c + (gap) * dir));
        lines[0].push(new Array(a, c + (gap + size) * dir));
        lines[1] = new Array(new Array(b, c + (gap) * dir));
        lines[1].push(new Array(b, c + (gap + size) * dir));

        // 1 línea horizontal
        lines[2] = new Array(new Array(a, c + (gap + size / 2) * dir));
        lines[2].push(new Array(b, c + (gap + size / 2) * dir));

        // Crear etiqueta de texto
        if (where == "Top") {
          var t = specLabel(w, (a + b) / 2, lines[0][1][1], color);
          t.top += t.height;
        } else {
          var t = specLabel(w, (a + b) / 2, lines[0][0][1], color);
          t.top -= size;
        }
        t.left -= t.width / 2;

        // Añadir cotas personalizadas
        if (customDimensionInput.text) {
            var customValue = parseFloat(customDimensionInput.text);
            // Extender la línea horizontal en ambos extremos
            var extendedLineLeft = new Array(new Array(a, c + (gap + size / 2) * dir));
            extendedLineLeft.push(new Array(a - convertToPoints(customValue), c + (gap + size / 2) * dir));
            var extendedLineRight = new Array(new Array(b, c + (gap + size / 2) * dir));
            extendedLineRight.push(new Array(b + convertToPoints(customValue), c + (gap + size / 2) * dir));

            var pLeft = doc.pathItems.add();
            pLeft.setEntirePath(extendedLineLeft);
            pLeft.strokeDashes = []; // Prevenir líneas de especificación discontinuas
            setLineStyle(pLeft, getMagentaColor());

            var pRight = doc.pathItems.add();
            pRight.setEntirePath(extendedLineRight);
            pRight.strokeDashes = []; // Prevenir líneas de especificación discontinuas
            setLineStyle(pRight, getMagentaColor());

            // Añadir pequeñas líneas verticales al final de las líneas magenta
            var endLineLeft = new Array(new Array(a - convertToPoints(customValue), c + (gap + size / 2) * dir - size / 2));
            endLineLeft.push(new Array(a - convertToPoints(customValue), c + (gap + size / 2) * dir + size / 2));

            var endLineRight = new Array(new Array(b + convertToPoints(customValue), c + (gap + size / 2) * dir - size / 2));
            endLineRight.push(new Array(b + convertToPoints(customValue), c + (gap + size / 2) * dir + size / 2));

            var pEndLeft = doc.pathItems.add();
            pEndLeft.setEntirePath(endLineLeft);
            pEndLeft.strokeDashes = []; // Prevenir líneas de especificación discontinuas
            setLineStyle(pEndLeft, getMagentaColor());

            var pEndRight = doc.pathItems.add();
            pEndRight.setEntirePath(endLineRight);
            pEndRight.strokeDashes = []; // Prevenir líneas de especificación discontinuas
            setLineStyle(pEndRight, getMagentaColor());

            // Añadir texto para la línea magenta izquierda
            var leftText = specLabel(customValue, a - convertToPoints(customValue) / 2, t.top, getMagentaColor());
            leftText.contents = customDimensionInput.text + getUnitLabel();
            leftText.left -= leftText.width / 2;

            // Añadir texto para la línea magenta derecha
            var rightText = specLabel(customValue, b + convertToPoints(customValue) / 2, t.top, getMagentaColor());
            rightText.contents = customDimensionInput.text + getUnitLabel();
            rightText.left -= rightText.width / 2;

            // Agrupar línea y texto magenta izquierdo
            var leftGroup = group(specsLayer, [pLeft, pEndLeft, leftText]);
            // Agrupar línea y texto magenta derecho
            var rightGroup = group(specsLayer, [pRight, pEndRight, rightText]);
        }
      } else {
        // Medición vertical
        // 2 líneas horizontales
        lines[0] = new Array(new Array(c + (gap) * dir, a));
        lines[0].push(new Array(c + (gap + size) * dir, a));
        lines[1] = new Array(new Array(c + (gap) * dir, b));
        lines[1].push(new Array(c + (gap + size) * dir, b));

        //1 línea vertical
        lines[2] = new Array(new Array(c + (gap + size / 2) * dir, a));
        lines[2].push(new Array(c + (gap + size / 2) * dir, b));

        // Crear etiqueta de texto
        if (where == "Left") {
          var t = specLabel(h, lines[0][1][0], (a + b) / 2, color);
          t.left -= t.width;
          t.rotate(90, true, false, false, false, Transformation.BOTTOMRIGHT);
          t.top += t.width;
          t.top += t.height / 2;
          var cianXPosition = t.left; // Guardar la posición en X del texto cian
        } else {
          var t = specLabel(h, lines[0][1][0], (a + b) / 2, color);
          t.rotate(-90, true, false, false, false, Transformation.BOTTOMLEFT);
          t.top += t.width;
          t.top += t.height / 2;
          var cianXPosition = t.left; // Guardar la posición en X del texto cian
        }

        // Añadir cotas personalizadas
        if (customDimensionInput.text) {
            var customValue = parseFloat(customDimensionInput.text);
            // Extender la línea vertical en ambos extremos
            var extendedLineTop = new Array(new Array(c + (gap + size / 2) * dir, a));
            extendedLineTop.push(new Array(c + (gap + size / 2) * dir, a - convertToPoints(customValue)));
            var extendedLineBottom = new Array(new Array(c + (gap + size / 2) * dir, b));
            extendedLineBottom.push(new Array(c + (gap + size / 2) * dir, b + convertToPoints(customValue)));

            var pTop = doc.pathItems.add();
            pTop.setEntirePath(extendedLineTop);
            pTop.strokeDashes = []; // Prevenir líneas de especificación discontinuas
            setLineStyle(pTop, getMagentaColor());

            var pBottom = doc.pathItems.add();
            pBottom.setEntirePath(extendedLineBottom);
            pBottom.strokeDashes = []; // Prevenir líneas de especificación discontinuas
            setLineStyle(pBottom, getMagentaColor());

          // Añadir pequeñas líneas horizontales al final de las líneas magenta verticales
            var endLineTop = new Array(new Array(c + (gap + size / 2) * dir - size / 2, a)); // Usar la coordenada y de la línea vertical magenta superior
            endLineTop.push(new Array(c + (gap + size / 2) * dir + size / 2, a)); // Usar la coordenada y de la línea vertical magenta superior

            var endLineBottom = new Array(new Array(c + (gap + size / 2) * dir - size / 2, b)); // Usar la coordenada y de la línea vertical magenta inferior
            endLineBottom.push(new Array(c + (gap + size / 2) * dir + size / 2, b)); // Usar la coordenada y de la línea vertical magenta inferior

            var pEndTop = doc.pathItems.add();
            pEndTop.setEntirePath(endLineTop);
            pEndTop.strokeDashes = []; // Prevenir líneas de especificación discontinuas
            setLineStyle(pEndTop, getMagentaColor());

            var pEndBottom = doc.pathItems.add();
            pEndBottom.setEntirePath(endLineBottom);
            pEndBottom.strokeDashes = []; // Prevenir líneas de especificación discontinuas
            setLineStyle(pEndBottom, getMagentaColor());

            // Añadir texto para la línea magenta superior
            var topText = specLabel(customValue, c + (gap + size / 2) * dir, a - convertToPoints(customValue) / 2, getMagentaColor());
            topText.contents = customDimensionInput.text + getUnitLabel();
            topText.left = cianXPosition; // Ajustar la posición en X para que coincida con el texto cian
            topText.rotate(90, true, false, false, false, Transformation.BOTTOMRIGHT); // Rotar texto 90 grados

            // Añadir texto para la línea magenta inferior
            var bottomText = specLabel(customValue, c + (gap + size / 2) * dir, b + convertToPoints(customValue) / 2, getMagentaColor());
            bottomText.contents = customDimensionInput.text + getUnitLabel();
            bottomText.left = cianXPosition; // Ajustar la posición en X para que coincida con el texto cian
            bottomText.rotate(90, true, false, false, false, Transformation.BOTTOMRIGHT); // Rotar texto 180 grados

            // Agrupar línea y texto magenta superior
            var topGroup = group(specsLayer, [pTop, pEndTop, topText]);
            // Agrupar línea y texto magenta inferior
            var bottomGroup = group(specsLayer, [pBottom, pEndBottom, bottomText]);
        }
      }

      // Dibujar líneas
      var specgroup = new Array(t);

      for (var i = 0; i < lines.length; i++) {
        var p = doc.pathItems.add();
        p.setEntirePath(lines[i]);
        p.strokeDashes = []; // Prevenir líneas de especificación discontinuas
        setLineStyle(p, color);
        specgroup.push(p);
      }

      group(specsLayer, specgroup);

      // volver a bloquear la capa de especificaciones
      specsLayer.locked = false;

    }

    // Especificar el espacio entre 2 elementos
    function specDouble(item1, item2, where) {

      var bound = new Array(0, 0, 0, 0);

      var a = item1.geometricBounds;
      var b = item2.geometricBounds;

      if (where == "Top" || where == "Bottom") {

        if (b[0] > a[0]) { // item 2 a la derecha,

          if (b[0] > a[2]) { // sin superposición
            bound[0] = a[2];
            bound[2] = b[0];
          } else { // superposición
            bound[0] = b[0];
            bound[2] = a[2];
          }
        } else if (a[0] >= b[0]) { // item 1 a la derecha

          if (a[0] > b[2]) { // sin superposición
            bound[0] = b[2];
            bound[2] = a[0];
          } else { // superposición
            bound[0] = a[0];
            bound[2] = b[2];
          }
        }

        bound[1] = Math.max(a[1], b[1]);
        bound[3] = Math.min(a[3], b[3]);

      } else {

        if (b[3] > a[3]) { // item 2 arriba
          if (b[3] > a[1]) { // sin superposición
            bound[3] = a[1];
            bound[1] = b[3];
          } else { // superposición
            bound[3] = b[3];
            bound[1] = a[1];
          }
        } else if (a[3] >= b[3]) { // item 1 arriba

          if (a[3] > b[1]) { // sin superposición
            bound[3] = b[1];
            bound[1] = a[3];
          } else { // superposición
            bound[3] = a[3];
            bound[1] = b[1];
          }
        }

        bound[0] = Math.min(a[0], b[0]);
        bound[2] = Math.max(a[2], b[2]);
      }
      specSingle(bound, where);
    }

    // Crear una etiqueta de texto que especifique la dimensión
    function specLabel(val, x, y, color) {

      var t = doc.textFrames.add();
      // Obtener tamaño de fuente de specifyDialogBox.fontSizeInput
      var labelFontSize;
      if (parseFloat(fontSizeInput.text) > 0) {
        labelFontSize = parseFloat(fontSizeInput.text);
      } else {
        labelFontSize = defaultFontSize;
      }

      // Convertir tamaño de fuente a RulerUnits
      var labelFontInUnits = convertToPoints(labelFontSize);

      // Establecer variable ambiental
      $.setenv("Specify_defaultFontSize", labelFontInUnits);

      t.textRange.characterAttributes.size = labelFontInUnits;
      t.textRange.characterAttributes.alignment = StyleRunAlignmentType.center;
      t.textRange.characterAttributes.fillColor = color;

      // Conversiones : http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/illustrator/sdk/CC2014/Illustrator%20Scripting%20Guide.pdf
      // Objeto UnitValue (página 230): http://wwwimages.adobe.com/content/dam/Adobe/en/devnet/scripting/pdfs/javascript_tools_guide.pdf

      var displayUnitsLabel = units.value;
      // Establecer variable ambiental
      $.setenv("Specify_defaultUnits", displayUnitsLabel);

      var v = val;
      var unitsLabel = "";

      switch (doc.rulerUnits) {
        case RulerUnits.Picas:
        v = new UnitValue(v, "pt").as("pc");
        var vd = v - Math.floor(v);
        vd = 12 * vd;
        v = Math.floor(v) + "p" + vd.toFixed(decimals);
        break;
        case RulerUnits.Inches:
        v = new UnitValue(v, "pt").as("in");
        v = v.toFixed(decimals);
        unitsLabel = " in"; // añadir abreviatura
        break;
        case RulerUnits.Millimeters:
        v = new UnitValue(v, "pt").as("mm");
        v = v.toFixed(decimals);
        unitsLabel = " mm"; // añadir abreviatura
        break;
        case RulerUnits.Centimeters:
        v = new UnitValue(v, "pt").as("cm");
        v = v.toFixed(decimals);
        unitsLabel = " cm"; // añadir abreviatura
        break;
        case RulerUnits.Pixels:
        v = new UnitValue(v, "pt").as("px");
        v = v.toFixed(decimals);
        unitsLabel = " px"; // añadir abreviatura
        break;
        default:
        v = new UnitValue(v, "pt").as("pt");
        v = v.toFixed(decimals);
        unitsLabel = " pt"; // añadir abreviatura
      }

      if (displayUnitsLabel) {
        t.contents = v + unitsLabel;
      } else {
        t.contents = v;
      }
      t.top = y;
      t.left = x;

      return t;
    }

    function getUnitLabel() {
      var unitsLabel = "";
      switch (doc.rulerUnits) {
        case RulerUnits.Picas:
          unitsLabel = " pc";
          break;
        case RulerUnits.Inches:
          unitsLabel = " in";
          break;
        case RulerUnits.Millimeters:
          unitsLabel = " mm";
          break;
        case RulerUnits.Centimeters:
          unitsLabel = " cm";
          break;
        case RulerUnits.Pixels:
          unitsLabel = " px";
          break;
        default:
          unitsLabel = " pt";
      }
      return unitsLabel;
    }

    function getMagentaColor() {
        var magentaColor = new CMYKColor();
        magentaColor.cyan = 0;
        magentaColor.magenta = 100;
        magentaColor.yellow = 0;
        magentaColor.black = 0;
        return magentaColor;
    }

    function convertToBoolean(string) {
      switch(string.toLowerCase()) {
        case "true":
        return true;
        break;
        case "false":
        return false;
        break;
      }
    }

    function setLineStyle(path, color) {
      path.filled = false;
      path.stroked = true;
      path.strokeColor = color;
      path.strokeWidth = 0.5;
      return path;
    }

    // Agrupar elementos en una capa
    function group(layer, items, isDuplicate) {

      // Crear nuevo grupo
      var gg = layer.groupItems.add();

      // Añadir al grupo
      // Contar al revés, porque la longitud de los elementos se reduce a medida que los elementos se mueven al nuevo grupo
      for (var i = items.length - 1; i >= 0; i--) {

        if (items[i] != gg) { // no agrupar el grupo en sí
        if (isDuplicate) {
          newItem = items[i].duplicate(gg, ElementPlacement.PLACEATBEGINNING);
        } else {
          items[i].move(gg, ElementPlacement.PLACEATBEGINNING);
        }
      }
    }
    return gg;
  }

  function convertToPoints(value) {
    switch (doc.rulerUnits) {
      case RulerUnits.Picas:
      value = new UnitValue(value, "pc").as("pt");
      break;
      case RulerUnits.Inches:
      value = new UnitValue(value, "in").as("pt");
      break;
      case RulerUnits.Millimeters:
      value = new UnitValue(value, "mm").as("pt");
      break;
      case RulerUnits.Centimeters:
      value = new UnitValue(value, "cm").as("pt");
      break;
      case RulerUnits.Pixels:
      value = new UnitValue(value, "px").as("pt");
      break;
      default:
      value = new UnitValue(value, "pt").as("pt");
    }
    return value;
  }

  function convertToUnits(value) {
    switch (doc.rulerUnits) {
      case RulerUnits.Picas:
      value = new UnitValue(value, "pt").as("pc");
      break;
      case RulerUnits.Inches:
      value = new UnitValue(value, "pt").as("in");
      break;
      case RulerUnits.Millimeters:
      value = new UnitValue(value, "pt").as("mm");
      break;
      case RulerUnits.Centimeters:
      value = new UnitValue(value, "pt").as("cm");
      break;
      case RulerUnits.Pixels:
      value = new UnitValue(value, "pt").as("px");
      break;
      default:
      value = new UnitValue(value, "pt").as("pt");
    }
    return value;
  }

  /*
  ** ======================================
  ** EJECUTAR SCRIPT
  ** ======================================
  */
  switch (selectedItems) {
    case 0:
    beep();
    alert("Seleccionar 1 Objeto para aplicar COTAS.");
    break;
    default:
    specifyDialogBox.show();
    break;
  }

  } else { // No hay documento activo
    alert("No hay objetos para especificar. \nPor favor abra un documento para continuar.")
  }
