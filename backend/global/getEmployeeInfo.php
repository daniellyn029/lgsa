<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

$param = json_decode(file_get_contents('php://input'));
$return = null;

if(!empty($param->accountid)){
    $Qry=new Query();
    $Qry->table="lgsa_employee";
    $Qry->selected="*";
    $Qry->fields="lgsa_guard_employee_id='".$param->employee_name_id."'";
    $rs=$Qry->_select($con);
    if(mysqli_num_rows($rs)>0){
        if($row=mysqli_fetch_array($rs)){
            $data = array(
                'id'=>$row['lgsa_employee_id'],
                'employee_id'=> $row['lgsa_guard_employee_id'],
                'fullname'=>ucfirst($row['lgsa_guard_firstname']).' '.ucfirst($row['lgsa_guard_lastname']),
                'address'=>$row['lgsa_guard_present_address'],
                'contactnumber'=>$row['lgsa_guard_cp_num'],

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