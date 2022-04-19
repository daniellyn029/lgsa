<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

    $param = json_decode(file_get_contents('php://input'));

    $Qry=new Query();
    $Qry->table="lgsa_employee";
    $Qry->selected="lgsa_employee_id, lgsa_guard_employee_id, CONCAT(lgsa_guard_firstname,' ',LEFT(lgsa_guard_middlename,1),'. ',lgsa_guard_lastname) AS fullname";
    $Qry->fields="lgsa_employee_id > 0";
    $rs=$Qry->_select($con);
    //echo $Qry->fields;
    if(mysqli_num_rows($rs)>=1){
        while($row=mysqli_fetch_array($rs)){
            $data[] = array(
                'status'=>'success',
                'id'=>$row['lgsa_employee_id'],
                'employee_id'=>$row['lgsa_guard_employee_id'],
                'fullname'=>$row['fullname']
            );
        }
        $return = json_encode($data);
    }else{
        $return = json_encode(array('status'=>'empty'));
    }

print $return;
mysqli_close($con);


?>