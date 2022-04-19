<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

    $param = $_GET;

    $return = '';

    if(!empty($param['q'])){
        $Qry=new Query();
        $Qry->table="(SELECT lgsa_employee_id,lgsa_guard_employee_id, CONCAT(lgsa_guard_lastname,', ',lgsa_guard_firstname,' ',lgsa_guard_middlename) AS fullname FROM lgsa_employee) lgsa_employee";
        $Qry->selected="*";
        $Qry->fields="fullname LIKE '%".$param['q']."%'";
        $rs=$Qry->_select($con);
        $data['pagination']['more']='true';
        if(mysqli_num_rows($rs)>=1){
            $data = array(
                "total_count"=>get_total_rows($con, $param['q'])
            );
            while($row=mysqli_fetch_array($rs)){
                $data['items'][]=array(
                    'id'=>$row['lgsa_guard_employee_id'],
                    'fullname'=>$row['fullname']
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
    $Qry->table="(SELECT lgsa_employee_id,lgsa_guard_employee_id, CONCAT(lgsa_guard_lastname,', ',lgsa_guard_firstname,' ',lgsa_guard_middlename) AS fullname FROM lgsa_employee) lgsa_employee";
    $Qry->selected="*";
    $Qry->fields="fullname LIKE '%".$param."%'";
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