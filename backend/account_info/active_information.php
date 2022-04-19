<?php
require_once('../database.php');
require_once('../utils.php');
$conn = new connector();
$con = $conn->connect();

    $param = json_decode(file_get_contents('php://input'));

    $time = SysTime();

    if(!empty($param->accountid)){

        $Qry=new Query();
        $Qry->table="lgsa_user";
        $Qry->selected="*";
        $Qry->fields="lgsa_user_employee_id='".$param->accountuserid."' AND lgsa_user_role='".$param->accounttype."'";
        $rs=$Qry->_select($con);
        if(mysqli_num_rows($rs)==1){
            if($row=mysqli_fetch_array($rs)){
                $data = array(
                    'id'=>$row['lgsa_user_id'],
                    'employeeid'=>$row['lgsa_user_employee_id'],
                    'first_name'=>ucfirst($row['lgsa_user_firstname']),
                    'middle_name'=>ucfirst($row['lgsa_user_middlename']),
                    'last_name'=>ucfirst($row['lgsa_user_lastname']),
                    'account_type'=>$row['lgsa_user_role'],
                    'profile_pic'=>$row['lgsa_user_profile_pic'].'?'.time(),
                    'password'=>$row['lgsa_user_password']
                );  
                $return = json_encode($data);
            }
        }else{
            $return = json_encode(array('status'=>'empty'));
        }
    }else{
		$return = json_encode(array('status'=>'error'));
    }

print $return;
mysqli_close($con);

?>