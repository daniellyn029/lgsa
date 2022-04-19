<?php
require_once('../database.php');
require_once('../utils.php');
require_once('../function/getData.php');
$conn = new connector();
$con = $conn->connect();

$param = json_decode(file_get_contents('php://input'));
$date = SysDate();
$time = SysTime();
$datetime = $date.' '.$time;
$return = '';



//Check if already logged in
if( !empty($param->accountuserid)){
    if( !empty($param->employee_id)){
        if( !empty($param->amount)){


            // Update 
            $Qry_a            = new Query();
            $Qry_a->table     = "lgsa_cashadvance_employee_name";
            $Qry_a->selected  = "lgsa_cashadvance_employee_id     ='".$param->employee_id."',
                                lgsa_cashadvance_name            ='".getEmployeeName($con, $param->employee_id)."',
                                lgsa_cashadvance_employee_amount ='".$param->amount."'";

            $Qry_a->fields    = "lgsa_cashadvance_employee_name_id='".$param->edit_cashadvance_id."'";

            $rs_a             = $Qry_a->_update($con);   
            if($rs_a){
        
                $return = json_encode(array("status"=>"success"));
            
            }else{
                $return = json_encode(array('status'=>'error','delete','lgsa_cashadvance_employee_name', mysqli_error($con)));
            }

        }else{
            $return = json_encode(array("status"=>"noamo"));
        }

    }else{
        $return = json_encode(array("status"=>"noemp"));
    }


}else{
    $return = json_encode(array("status"=>"notloggedin"));
}

    



print $return;
mysqli_close($con);




?>