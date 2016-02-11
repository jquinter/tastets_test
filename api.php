<?php
define("TOTAL_REGISTROS", 25000);
/*
Función que crea un registro ficticio, simil a un 
registro de la tabla de BD
posicion(id, fecha_actualizacion, nombre, velocidad)

Parámetros: 
posicion	indice del elemento siendo creado
*/
function generaRegistro($posicion){
	$prefixes = array("AU", "CA", "MB", "FU");
	$now = strtotime("now");

	/*
	fecha_actualizacion sera un timestamp,
	en una ventana de 1000 segundos alrededor de "ahora"
	*/
	return array(
		"id" => $posicion,
		"fecha_actualizacion" => rand($now-1000, $now+1000),
		"nombre" => sprintf("%s_%06d", $prefixes[ rand(0,3) ], $posicion),
		"velocidad" => rand(20, 100)
	);
}

/*
Este archivo simula una api rest, por lo que procesa un request 'get' y retorna 
datos en json

Parametros esperados en query:
offset 			offset para conjunto de datos retornados
limit 			cantidad limite de conjuntos retornados
sort 			asc/desc, para ordenamiento segun campo fecha_actualizacion
*/
if( $_SERVER['REQUEST_METHOD'] == 'GET' ){
	$offset = isset( $_REQUEST['offset'] ) ? $_REQUEST['offset'] : 0;
	$limit = isset( $_REQUEST['limit'] ) ? $_REQUEST['limit'] : TOTAL_REGISTROS;
	$sort = isset( $_REQUEST['sort'] ) ? $_REQUEST['sort'] : 'DESC';

	for($i = 0; $i < $limit; $i++){
		$datos[$i] = generaRegistro($i);
		$fechas[$i] = $datos[$i]["fecha_actualizacion"];
	}

	array_multisort($fechas, $sort == 'DESC' ? SORT_DESC : SORT_ASC, $datos);

	$output = array(
		"datos" => array_slice($datos, $offset, $limit),
		"total" => TOTAL_REGISTROS
	);

	echo json_encode( $output );
}else{
	echo 'Unknown error';
}
?>