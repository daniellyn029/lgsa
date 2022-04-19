<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

function checkClient( $con, $client_name ){
    $Qry = new Query(); 
    $Qry->table = "lgsa_client";
    $Qry->selected = "lgsa_client_business_name";
    $Qry->fields = "lgsa_client_business_name='".$client_name."'";
    $rs = $Qry->_select($con);
    if(mysqli_num_rows($rs)>= 1){
        return true;
    }
    return false;
}

function getCompanyName($con, $id){
    $Qry=new Query();
    $Qry->table="lgsa_client";
    $Qry->selected="lgsa_client_business_name";
    $Qry->fields="lgsa_client_id='".$id."'";
    $rs=$Qry->_select($con);
    if(mysqli_num_rows($rs)>=1){
        if($row=mysqli_fetch_array($rs)){
            return $row['lgsa_client_business_name'];
        }
    }
    return null;
}


?>