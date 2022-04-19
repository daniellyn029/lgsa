<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

    $param = $_GET;

    if(!empty($param['q'])){
        $Qry=new Query();
        $Qry->table="lgsa_client";
        $Qry->selected="lgsa_client_id,lgsa_client_business_name";
        $Qry->fields="lgsa_client_business_name LIKE '%".$param['q']."%'";
        $rs=$Qry->_select($con);
        $data['pagination']['more']='true';
        if(mysqli_num_rows($rs)>=1){
            $data = array(
                "total_count"=>get_total_rows($con, $param['q'])
            );
            while($row=mysqli_fetch_array($rs)){
                $data['items'][]=array(
                    'id'=>$row['lgsa_client_id'],
                    'client_name'=>$row['lgsa_client_business_name']
                );
            }
            $return = json_encode($data);
        }else{
            $data = array(
                "total_count"=>mysqli_num_rows($rs)
            );
        }
    }else{
        $return = json_encode(array('status'=>'empty'));
    }

print $return;
mysqli_close($con);


function get_total_rows($con, $param){
    $rowCount = '';
    $Qry=new Query();
    $Qry->table="lgsa_client";
    $Qry->selected="lgsa_client_id,lgsa_client_business_name";
    $Qry->fields="lgsa_client_business_name LIKE '%".$param."%'";
    $rs=$Qry->_select($con);
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            $rowCount=mysqli_num_rows($rs);
        }
        return $rowCount;
    }else{  
        return null;
    }
}




?>