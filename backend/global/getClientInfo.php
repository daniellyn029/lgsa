<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

$param = json_decode(file_get_contents('php://input'));
$return = null;

if(!empty($param->accountid)){
    $Qry=new Query();
    $Qry->table="lgsa_client";
    $Qry->selected="*";
    $Qry->fields="lgsa_client_id='".$param->client_name_id."'";
    $rs=$Qry->_select($con);
    if(mysqli_num_rows($rs)>0){
        if($row=mysqli_fetch_array($rs)){
            $data = array(
                'id'=>$row['lgsa_client_id'],
                'clientname'=>$row['lgsa_client_business_name'],
                'address'=>$row['lgsa_client_business_add'],
                'contactnumber'=>$row['lgsa_client_tel_num'],

            );
        }
        $return = json_encode($data);
    }
}else{
    $return = json_encode(array('status'=>'error'));
}










print $return;
mysqli_close($con);

?>