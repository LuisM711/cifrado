let tablaDeBloques = false;
onload = (event) => {
    selectMetodo.addEventListener('change', selectChange);
    selectMetodo.addEventListener('load', selectChange());
    tablaDeBloques = false;

}

selectChange = () => {
    const selectedValue = Number(selectMetodo.value);

    switch (selectedValue) {
        case 1:
            setSoloLectura("tbK", false);
            setSoloLectura("tbP", true);
            setSoloLectura("tbQ", true);
            setSoloLectura("tbClavePrivada", true);
            setSoloLectura("tbClavePublica", true);
            setSoloLectura("tbChar", true);


            break;
        case 2:
            setSoloLectura("tbK", false);
            setSoloLectura("tbP", true);
            setSoloLectura("tbQ", true);
            setSoloLectura("tbClavePrivada", true);
            setSoloLectura("tbClavePublica", true);
            setSoloLectura("tbChar", false);

            break;
        case 3:
            setSoloLectura("tbK", true);
            setSoloLectura("tbP", false);
            setSoloLectura("tbQ", false);
            setSoloLectura("tbClavePrivada", false);
            setSoloLectura("tbClavePublica", false);
            setSoloLectura("tbChar", true);


            break;

        default:
            console.log("fatal error");
            break;
    }


}
cifrar = () => {
    clavePublica = {};
    clavePrivada = {};
    tablaDeBloques = false;
    txtAreaMetodo.textContent = "";
    let textoClaro = String(tbTextoClaro.value).toUpperCase();
    tbTextoClaro.value = textoClaro;
    let k = (tbK.value);
    if (!textoClaro) {
        avisoError("No hay texto claro");
        return false;
    }

    switch (Number(selectMetodo.value)) {
        case 1:
            if (!(/^[0-9]\d*$/).test(k)) {
                avisoError("No hay `k` para cifrar");
                return false;
            }
            tbTextoCifrado.value = cifrarCesar(Number(k), textoClaro);
            break;
        case 2:
            if (!(/^[0-9]\d*$/).test(k)) {
                avisoError("No hay `k` para cifrar");
                return false;
            }
            tbTextoCifrado.value = cifrarBloques(Number(k), textoClaro);
            break;
        case 3:
            let p = String(tbP.value);
            let q = String(tbQ.value);
            p = Number(p);
            q = Number(q);
            tbClavePublica.textContent = "";
            tbClavePrivada.textContent = "";
            if (!(/^[0-9]\d*$/).test(p) || !(/^[0-9]\d*$/).test(q)) {
                avisoError("Valores de p y/o q no son validos");
                return false;
            }
            if (!esPrimo(p)) {
                avisoError(`El valor de p: ${p} no es primo`);
                return false;
            }
            if (!esPrimo(q)) {
                avisoError(`El valor de q: ${q} no es primo`);
                return false;
            }
            if (p == q) {
                avisoError("Los valores no deben ser iguales");
                return false;
            }
            tbTextoCifrado.value = cifrarRSA(p, q, textoClaro);
            break;

    }


}
descifrar = () => {
    txtAreaMetodo.textContent = "";
    let textoCifrado = String(tbTextoCifrado.value);
    let k = (tbK.value);
    let clavePublica = tbClavePublica.value;
    let clavePrivada = tbClavePrivada.value;
    if (!textoCifrado) {
        avisoError("No hay texto cifrado");
        return false;
    }
    switch (Number(selectMetodo.value)) {
        case 1:
            if (!(/^[0-9]\d*$/).test(k)) {
                avisoError("No hay `k` para descifrar");
                return false;
            }
            tbTextoDescifrado.value = descifrarCesar(Number(k), textoCifrado);
            break;
        case 2:

            if (!(/^[0-9]\d*$/).test(k)) {
                avisoError("No hay `k` para descifrar");
                return false;
            }
            if (!tablaDeBloques) {
                avisoError("No se ha generado una tabla anteriormente, genere una cifrando algun dato");
                return false;
            }
            tbTextoDescifrado.value = descifrarBloques(k, textoCifrado);
            break;
        case 3:
            // if (!(clavePrivada.n > 0)) {
            //     avisoError("No se han generados las claves mediante los primos `p` y `q`");
            //     return false;
            // }
            if (clavePublica == '' || clavePrivada == '') {
                avisoError("No hay claves publicas y privadas para descifrar");
                return false;
            }
            tbTextoDescifrado.value = descifrarRSA(textoCifrado, clavePublica, clavePrivada);
            break;

    }

}
verTabla = () => {
    switch (Number(selectMetodo.value)) {
        case 1:
            let k = (tbK.value);
            if (!(/^[0-9]\d*$/).test(k)) {
                avisoError("No hay `k` para mostrar");
                return false;
            }
            k = Number(k);
            let abecedarioNormal = getAbecedario(0);
            let abecedarioCifrado = getAbecedario(k);
            //mostrarModal(abecedarioNormal[0] + "\n" +abecedarioCifrado[0]);
            // mostrarModal(`Abecedario normal = ${abecedarioNormal[0]}
            // Abecedario (k=${k}) = ${abecedarioCifrado[0]}`);
            let string = `Abecedario normal = ${abecedarioNormal[0]}\nAbecedario (k=${k}) = ${abecedarioCifrado[0]}`;
            mostrarModal(string);
            break;
        case 2:
            if (!tablaDeBloques) {
                avisoError("No se ha generado una tabla para el cifrado de bloques");
                return false;
            }
            mostrarModal(JSON.stringify(tablaDeBloques));
            break;
        case 3:
            let clavePublica = tbClavePublica.value;
            let clavePrivada = tbClavePrivada.value;
            if (clavePublica == '' || clavePrivada == '') {
                avisoError("No se han generados las claves mediante los primos `p` y `q`");
                return false;


            }
            else {
                clavePublica = {
                    n: Number(clavePublica.split(',')[0]),
                    e: Number(clavePublica.split(',')[1])
                }
                clavePrivada = {
                    n: Number(clavePrivada.split(',')[0]),
                    d: Number(clavePrivada.split(',')[1])
                }
                let str = `Clave pública:[${clavePublica.n},${clavePublica.e}]\n`
                str += `Clave privada:[${clavePrivada.n},${clavePrivada.d}]\n`
                mostrarModal(str);
            }
            // let str = `Clave pública: ${JSON.stringify(clavePublica)}\n`;
            // str += `Clave privada: ${JSON.stringify(clavePrivada)}`;

            break;
    }


}
limpiar = () => {
    clavePublica = {};
    clavePrivada = {};
    selectMetodo.value = "1";
    tbTextoClaro.value = "";
    tbTextoCifrado.value = "";
    tbTextoDescifrado.value = "";
    tbK.value = "";
    txtAreaMetodo.textContent = "";
    tbP.value = "";
    tbQ.value = "";
    tbClavePublica.value = "";
    tbClavePrivada.value = "";
    setSoloLectura("tbK", false);
    setSoloLectura("tbP", true);
    setSoloLectura("tbQ", true);
    setSoloLectura("tbClavePrivada", true);
    setSoloLectura("tbClavePublica", true);
    setSoloLectura("tbChar", true);

}
print = (txt = "") => {
    txtAreaMetodo.textContent += txt;
}
println = (txt = "") => {
    txtAreaMetodo.textContent += txt + "\n";
}
// setSoloLectura = (id, readOnly = false) => {
//     let elemento = document.getElementById(id);
//     if (elemento) {
//         elemento.readOnly = readOnly;
//         if (readOnly) {
//             elemento.classList.add("readOnly");
//             if (elemento.type == "text")
//                 elemento.value = "";
//             else if (elemento.type == "textarea")
//                 elemento.textContent = "";
//         }
//         else elemento.classList.remove("readOnly");
//     }
//     else console.log("Elemento inexistente");
// }

setSoloLectura = (id, readOnly = false) => {
    //let elemento = document.getElementById(id);
    let elemento = document.querySelector(`.${id}`);
    if (elemento) {
        elemento.readOnly = readOnly;
        if (readOnly) {
            elemento.classList.add("readOnly");
        }
        else elemento.classList.remove("readOnly");
    }
    else console.log(`No se encontro '${id}'`);
}











// cifrarCesar = (k, texto = "") => {
//     //console.log(k,texto);
//     let t = [];
//     for (let i = 0; i < texto.length; i++) {
//         t.push(String.fromCharCode(ascii(texto[i]) + k));
//     }
//     return t.join('');
// }
// cifrarCesar = (k, texto) => {
//     //debugger;
//     println(`Texto en claro: ${texto}`);
//     println(`Valor de k: ${k}`);
//     let textoCifrado = "";
//     for (let i = 0; i < texto.length; i++) {
//         let letra = texto[i];
//         if (letra.match(/[a-zA-ZñÑ]/)) {
//             let codigo = texto.charCodeAt(i);
//             println(`Claro[${i}] : ${letra}, ascii = ${codigo}`);
//             codigo += k;
//             letra = String.fromCharCode(codigo);
//             println(`Cifrado[${i}] : ${codigo - k} + (k = ${k}) = ${codigo} -> ${letra}`);
//             println(`Remplazo[${i}]: ${texto[i]} -> ${letra}\n`);
//         }
//         textoCifrado += letra;
//     }
//     return textoCifrado;
// }
cifrarCesar = (k, texto) => {
    let abecedarioNormal = getAbecedario(0)[0];
    k = k % abecedarioNormal.length;
    let abecedario = getAbecedario(k)[0];
    println(`Texto en claro: ${texto}`);
    println(`Valor de k: ${k}`);
    let textoCifrado = "";
    for (let i = 0; i < texto.length; i++) {
        let letra = texto[i];
        if (letra.match(/[A-ZÑ]/)) {
            let posicion = abecedarioNormal.indexOf(letra);
            println(`Claro[${i}] : ${letra}`);
            letra = abecedario[posicion];
            println(`Cifrado[${i}] : ${letra}`);
            println(`Remplazo[${i}]: ${texto[i]} -> ${letra}\n`);
        }
        textoCifrado += letra;
    }
    return textoCifrado;
}



// descifrarCesar = (k, texto = "") => {
//     return cifrarCesar(-k, texto);
// }
// descifrarCesar = (k, textoCifrado = "") => {
//     println(`Texto cifrado: ${textoCifrado}`);
//     println(`Valor de k: ${k}`);
//     let texto = "";
//     for (let i = 0; i < textoCifrado.length; i++) {
//         let letra = textoCifrado[i];
//         if (letra.match(/[a-zA-ZñÑ]/)) {
//             let codigo = textoCifrado.charCodeAt(i);
//             println(`Cifrado[${i}] : ${letra}, ascii = ${codigo}`);
//             codigo -= k;
//             letra = String.fromCharCode(codigo);
//             println(`Claro[${i}] : ${codigo - k} - (k = ${k}) = ${codigo} -> ${letra}`);
//             println(`Remplazo[${i}]: ${textoCifrado[i]} -> ${letra}\n`);
//         }
//         texto += letra;
//     }
//     return texto;
// }
descifrarCesar = (k, texto) => {
    let abecedarioNormal = getAbecedario(0)[0];
    k = k % abecedarioNormal.length;
    k * -1;
    let abecedario = getAbecedario(k)[0];
    println(`Texto cifrado: ${texto}`);
    println(`Valor de k: ${k}`);
    let textoDescifrado = "";
    for (let i = 0; i < texto.length; i++) {
        let letra = texto[i];
        if (letra.match(/[A-ZÑ]/)) {
            let posicion = abecedario.indexOf(letra);
            println(`Cifrado[${i}] : ${letra}`);
            letra = abecedarioNormal[posicion];
            println(`Descifrado[${i}] : ${letra}`);
            println(`Remplazo[${i}]: ${texto[i]} -> ${letra}\n`);
        }
        textoDescifrado += letra;
    }
    println(`Uniendo todos los remplazos quedaría: ${textoDescifrado}`);
    return textoDescifrado;
}
cifrarBloques = (k = 0, texto = "") => {
    console.clear();
    tbChar.value = '';
    let textoCifrado = "";
    let potencia = Math.pow(2, k);
    let tabla = generarTablaBinariaAleatoria(k);
    println(`Texto en claro: ${texto}`);
    println(`Valor de k: ${k}`);
    println(`Tabla generada, presione 'Ver tabla' para mirarla\n`);
    tablaDeBloques = tabla;
    //console.log(tabla);
    let cifrado = [];
    let unidadCifrada = [];
    let binario = "";
    for (let i = 0; i < texto.length; i++) {

        unidadCifrada = [];
        const elemento = texto[i];
        println(`Cifrando letra: ${elemento}, posicion: ${i}`);
        binario = (elemento.charCodeAt(0)).toString(2).padStart(potencia, 0);
        println(`Conversion de dicha letra a binario(ASCII): ${binario}`);
        binario = partirStringEnGrupos(binario, k);
        println(`Separacion en grupos de (k=${k}): ${binario.reverse().join(',')}`);
        binario.forEach(element => {
            unidadCifrada.push(obtenerCorrespondencia(tabla, element));
            println(`Correspondencia del binario [${element}] con la tabla -> [${unidadCifrada[unidadCifrada.length - 1]}]`);
        });
        console.log(unidadCifrada.join('') +'   '+ parseInt(unidadCifrada.join(''),2));
        tbChar.value += `${String.fromCharCode(parseInt(unidadCifrada.join(''),2))}`;
        println("");
        cifrado.push(unidadCifrada.join('.'));

    }
    // console.log(binario);
    // console.log(unidadCifrada);
    // console.log(cifrado);
    textoCifrado = cifrado.join(',');


    return textoCifrado;
}
descifrarBloques = (k = 0, textoCifrado = "") => {
    textoCifrado = textoCifrado.split(',');
    let textoDescifrado = "";
    let tabla = tablaDeBloques;
    println(`Basandose en la tabla generada anteriormente...`);
    tablaDeBloques = tabla;
    let descifrado = [];
    let unidadDescifrada = [];
    let binario = "";
    for (let i = 0; i < textoCifrado.length; i++) {
        //debugger;
        unidadDescifrada = [];
        const elemento = textoCifrado[i];
        println(`Descifrando el binario: ${elemento.replaceAll('.', '')}, posicion: ${i}`);
        binario = elemento.split('.');
        binario.forEach(element => {
            // println(`Conversion de dicha letra a binario(ASCII): ${binario}`);
            unidadDescifrada.push(obtenerCorrespondenciaInv(tabla, element));
            println(`Correspondencia del binario [${element}] con la tabla -> [${unidadDescifrada[unidadDescifrada.length - 1]}]`);
        });
        descifrado.push(String.fromCharCode(parseInt(unidadDescifrada.join(''), 2)));
        println(`Concatenación del elemento: ${unidadDescifrada.join('')} como ASCII: ${descifrado[descifrado.length - 1]}`);
        print("\n");

    }
    textoDescifrado = descifrado.join('');
    println(`Uniendo todas las concatenaciones quedaría: ${textoDescifrado}`);
    return textoDescifrado;
}
cifrarRSA = (p, q, texto) => {
    let textoCifrado = [];
    println(`Valores de [p,q]: [${p},${q}]`);
    let n = p * q;
    println(`n = p * q`);
    println(`n: (${p})*(${q}) = ${n}`);
    let z = (p - 1) * (q - 1);
    println(`z = (p - 1) * (q - 1)`);
    println(`z: (${p}) * (${q}) = ${z} `);
    let e = 0;
    let d = 0;
    println("Encontrando los primos relativos");
    println(`Calcular e donde i < e < n`);
    println(`e = máximo comun divisor -> MCD(z,e) = 1`);
    for (let i = 2; i < n; i++) {
        if (obtenerMCD(z, i) == 1) {
            e = i; break;
        }
    }
    println(`Valor de e: ${e}`);
    println(`Calcular d donde (e * d)𝑚𝑜𝑑 z = 1 o ((e * d) - 1) 𝑚𝑜𝑑 z = 0`);
    for (let i = 1; i < 1024; i++) {
        if (((e * i) - 1) % z == 0) {
            d = i;
            if (d != e)
                break;
        }
    }
    println(`Valor de d: ${d}`);
    println(`Clave pública = [n,e]: [${n},${e}]`);
    println(`Clave privada = [n,d]: [${n},${d}]`);
    print('\n');
    let clavePublica = { n, e };
    let clavePrivada = { n, d };
    tbClavePublica.value = `${clavePublica.n},${clavePublica.e}`;
    tbClavePrivada.value = `${clavePrivada.n},${clavePrivada.d}`;
    for (let i = 0; i < texto.length; i++) {
        let letra = texto[i];
        println(`Cifrando la letra: ${letra}, posición: ${i}`);
        let m = Number(ascii(letra));
        println(`El código ascii de dicha letra es: ${m}`);
        if (!(m < n)) {
            avisoError(`El valor del dato que se quiere cifrar 'm' debe ser menor a n: (p*q), debe utilizar numeros primos mas grandes`);
            return "M debe ser menor que N";
        }
        println(`Valor cifrado 'c' = m^e mod n`);
        let c = (Math.pow(m, e)) % n;
        println(`c = (${m}^${e}) mod (${n})`);
        println(`c = ${c}`);
        println(`Se remplaza ${letra} -> ${c}`);
        textoCifrado.push(c);
        print('\n');
    }
    textoCifrado = textoCifrado.join(',');
    println(`Uniendo todos los remplazos queda: ${textoCifrado}`);
    return textoCifrado;
}
descifrarRSA = (cifrado = "", clavePublica, clavePrivada) => {
    let textoDescifrado = "";
    let str = `Clave pública: [${clavePublica}]\n`;
    str += `Clave privada: [${clavePrivada}]\n`;
    clavePublica = {
        n: Number(clavePublica.split(',')[0]),
        e: Number(clavePublica.split(',')[1])
    }
    clavePrivada = {
        n: Number(clavePrivada.split(',')[0]),
        d: Number(clavePrivada.split(',')[1])
    }
    print(str);
    println(`Descifrado 'm' = c^d mod n donde m < n y 'c' es lo cifrado`);
    println(`Texto a descifrar: ${cifrado}`);
    let arr = cifrado.split(',');
    /*
    Cifrado : c = m^e mod n
    Descifrado : m = c^d mod n
            donde m < n
    */
    let arrDescifrado = [];
    arr.forEach((element, index) => {
        // element = parseInt(element,2);
        element = Number(element);
        println(`Descifrando ${element}, posición ${index}`);
        let m = powMod(element, clavePrivada.d, clavePrivada.n)
        println(`m: ${element}^${clavePrivada.d} % ${clavePrivada.n} = ${m}`);
        let letra = String.fromCharCode(m);
        println(`Resultado: m = ${m} a texto(ASCII) ->${letra}`);
        arrDescifrado.push(letra);
    });
    textoDescifrado = arrDescifrado.join('');
    println(`Uniendo los resultados queda ${textoDescifrado}`);
    return textoDescifrado;
}
ascii = (a) => {
    //console.log(a,a.charCodeAt(0));
    return a.charCodeAt(0);
}
// getAbecedario = (k) => {
//     let mayusculas = [], minusculas = [];
//     let i = 0;
//     for (let index = 0; index <= 25; index++) {

//         if ((i + k) <= 25) {
//             minusculas.push(String.fromCharCode(97 + (i + k)));
//             mayusculas.push(String.fromCharCode(65 + (i + k)));
//         }
//         else {
//             minusculas.push('a');
//             mayusculas.push('A');
//             i = 0; k = 0;
//         }

//         i++;
//     }
//     return [mayusculas.join(''), minusculas.join('')];
// }
getAbecedario = (k) => {
    let abecedarioString = "abcdefghijklmnñopqrstuvwxyz".toUpperCase();

    let mayusculas = [], minusculas = [];
    let i = 0;
    for (let index = 0; index <= 26; index++) {

        if ((i + k) <= 26) {
            minusculas.push(abecedarioString[i + k].toLowerCase())
            mayusculas.push(abecedarioString[i + k]);
        }
        else {
            minusculas.push('a');
            mayusculas.push('A');
            i = 0; k = 0;
        }

        i++;
    }
    return [mayusculas.join(''), minusculas.join('')];
}
generarTablaBinariaAleatoria = (k) => {
    let tabla = [];
    let combinaciones = [];
    for (let i = 0; i < Math.pow(2, k); i++) {
        let salida = i.toString(2);
        while (salida.length < k) {
            salida = '0' + salida;
        }
        combinaciones.push(salida);
    }
    let numFilas = Math.pow(2, k);
    for (let i = 0; i < numFilas; i++) {
        let fila = {};
        let entrada = i.toString(2);
        while (entrada.length < k) {
            entrada = '0' + entrada;
        }
        fila.entrada = entrada;
        let index = Math.floor(Math.random() * combinaciones.length);
        fila.salida = combinaciones.splice(index, 1)[0];

        tabla.push(fila);
    }

    return tabla;
}
obtenerCorrespondencia = (tabla = [], entrada = "") => {
    let correspondencia = -1;
    tabla.forEach(element => {
        element.entrada == entrada ? correspondencia = element.salida : 0
    });
    return correspondencia;
}
obtenerCorrespondenciaInv = (tabla = [], salida = "") => {
    let correspondencia = -1;
    tabla.forEach(element => {
        element.salida == salida ? correspondencia = element.entrada : 0
    });
    return correspondencia;
}
avisoError = (mensaje = "") => {
    let aviso = document.createElement("div");
    aviso.role = "alert";
    aviso.classList.add("alert");
    aviso.classList.add("alert-danger");

    aviso.innerHTML = mensaje;
    let DOMaviso = document.getElementById("aviso");
    DOMaviso.innerHTML = '';
    DOMaviso.appendChild(aviso);

    setTimeout(function () {
        aviso.style.opacity = '0';
        setTimeout(function () {
            DOMaviso.removeChild(aviso);
        }, 1000);
    }, 2000);
}
mostrarModal = (texto) => {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const contenido = document.createElement('div');
    contenido.classList.add('modal-contenido');
    const textoModal = document.createElement('p');
    textoModal.textContent = texto;
    const botonCerrar = document.createElement('button');
    botonCerrar.textContent = 'Cerrar';
    botonCerrar.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    contenido.appendChild(textoModal);
    contenido.appendChild(botonCerrar);
    modal.appendChild(contenido);
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}
partirStringEnGrupos = (texto, k) => {
    let grupos = [];

    while (texto.length > 0) {
        let grupo = texto.slice(-k).padStart(k, '0');
        grupos.push(grupo);
        texto = texto.slice(0, -k);
    }

    return grupos;
}
esPrimo = (numero) => {
    if (numero <= 1) {
        return false;
    }

    for (let i = 2; i <= Math.sqrt(numero); i++) {
        if (numero % i === 0) {
            return false;
        }
    }

    return true;
}
obtenerMCD = (numero1, numero2) => {
    if (numero2 === 0) {
        return numero1;
    }

    return obtenerMCD(numero2, numero1 % numero2);
}


powMod = (base, exponent, modulus) => {
    let result = 1;

    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }

        base = (base * base) % modulus;
        exponent = Math.floor(exponent / 2);
    }

    return result;
}