<?php
require_once('../database.php');
require_once('../utils.php');
require_once('../function/password.php');
$conn = new connector();
$con = $conn->connect();

    $param = json_decode(file_get_contents('php://input'));
    
    if(!empty($param->accountuserid) || !empty($param->oldpassword)){
        if(!empty($param->confirmoldpassword) && !empty($param->newpassword) && !empty($param->confirmpassword)){
            if($param->oldpassword!=encrypt($param->confirmoldpassword)){
                $return = json_encode(array('status'=>'oldpassworddidnotmatch'));
            }else if($param->newpassword!=$param->confirmpassword){
                $return = json_encode(array('status'=>'passworddidnotmatch'));	
            }else{
                $Qry = new Query();
                $Qry->table = "lgsa_user";
                $Qry->selected = "lgsa_user_password='".encrypt($param->newpassword)."'";
                $Qry->fields = "lgsa_user_employee_id='".$param->accountuserid."'";
                $rs = $Qry->_update($con);
                if($rs){
                    $return = json_encode(array('status'=>'success'));	
                }else{
                    $return = json_encode(array('status'=>'failed'));
                }
            }
        }else{
            $return = json_encode(array('status'=>'required'));		
        }
    }else{
        $return = json_encode(array('status'=>'error'));
    }

print $return;	
mysqli_close($con);

?>