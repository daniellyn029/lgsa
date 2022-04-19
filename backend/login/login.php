<?php
require_once('../database.php');
require_once('../utils.php');
require_once('../function/password.php');
$conn = new connector();
$con = $conn->connect();

$param = json_decode(file_get_contents('php://input'));



    // Process flow
    // if(!empty($param->username) && !empty($param->password)){
        $Qry=new Query();
        $Qry->table="lgsa_user";
        $Qry->selected="lgsa_user_id, lgsa_user_role, lgsa_user_employee_id, lgsa_user_username, lgsa_user_password, lgsa_account_status";
        $Qry->fields="lgsa_user_username='".$param->username."' AND lgsa_user_password='".encrypt($param->password)."'";
        $rs=$Qry->_select($con);
        if(mysqli_num_rows($rs)>=1){
            if($rowa=mysqli_fetch_array($rs)){
                if($rowa['lgsa_account_status']=='Active'){
                    $data = array(
                        'accountid'=>$rowa['lgsa_user_id'],
                        'accountrole'=>$rowa['lgsa_user_role'],
                        'accountuserid'=>$rowa['lgsa_user_employee_id'],
                        'status'=>'success'
                    );
                    $return = json_encode($data);
                }else{
                    $return = json_encode(array('status'=>'blocked'));
                }
            }
        }else{
            $return = json_encode(array('status'=>'notfound'));
        }       
    // }else{
    //     $return = json_encode(array('status'=>'empty'));
    // }

print $return;
mysqli_close($con); 

?>